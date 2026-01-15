import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/CaseDetails.css';

const DefaultContent = '在這裡輸入內容...（上限2000字）';

// 現場記錄彈窗
function WorkRecordDialog({ isOpen, onClose }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);
    return (
        <dialog ref={dialogRef} className={'caseDetailDialog'} onClose={onClose}>
            <div className={'blocktitle'}>新增現場紀錄</div>
            <div className={'dialogcontainer row'}>
                <div className={'block col-12 col-md textareacontainer dialogcol'}>
                    <textarea className={'dialogtext'} placeholder={DefaultContent} minLength="1" maxLength="2000"></textarea>
                    {/*後端需要再做限制*/}
                </div>
                <div className={'col-12 col-md dialogcol'}>
                    <ImageUploader key={isOpen ? "active" : "inactive"} onClose={onClose} isOpen={isOpen} />
                </div>
            </div>
        </dialog>
    )
}
// 意外回報彈窗
function IncidentDialog({ isOpen, onClose }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);
    return (
        <dialog ref={dialogRef} className={'caseDetailDialog'} onClose={onClose}>
            <div className={'blocktitle'}>新增意外回報</div>
            <div className={'dialogcontainer row'}>
                <div className={'block col-12 col-md textareacontainer dialogcol'}>
                    <textarea className={'dialogtext'} placeholder={DefaultContent} minLength="1" maxLength="2000"></textarea>
                    {/*後端需要再做限制*/}
                </div>
                <div className={'col-12 col-md dialogcol'}>
                    <ImageUploader key={isOpen ? "active" : "inactive"} onClose={onClose} />
                </div>
            </div>
        </dialog>
    )
}

//彈窗圖片功能
const ImageUploader = ({ onClose }) => {
    const [images, setImages] = useState([]); // 儲存物件：{ url: string, file: File }
    const [currentIndex, setCurrentIndex] = useState(0);
    const fileInputRef = useRef(null);

    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    const handleFiles = (files) => {
        const validFiles = Array.from(files).filter((file) => {
            if (!file.type.startsWith('image/')) return false;
            if (file.size > MAX_SIZE_BYTES) {
                alert(`檔案 "${file.name}" 超過 ${MAX_SIZE_MB}MB，已自動跳過`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const newImageObjs = validFiles.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name,
        }));

        setImages((prev) => [...prev, ...newImageObjs]);
        // 上傳後自動跳到新上傳的第一張
        setCurrentIndex(images.length);
    };

    const removeImage = (e) => {
        e.stopPropagation(); // 防止觸發父層事件
        const targetUrl = images[currentIndex].url;

        const newImages = images.filter((_, i) => i !== currentIndex);
        setImages(newImages);
        URL.revokeObjectURL(targetUrl); // 釋放記憶體

        // 調整索引，確保不會溢出
        if (currentIndex >= newImages.length && newImages.length > 0) {
            setCurrentIndex(newImages.length - 1);
        }
    };

    return (
        <>
            {/* 拖拽/顯示視窗 */}
            <div className={'block'} style={{ height: '70%', padding: '3%' }}>
                <div
                    className={'dialogimg'}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFiles(e.dataTransfer.files);
                    }}
                >
                    {images.length > 0 ? (
                        <>
                            <img src={images[currentIndex].url} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            <button
                                className={'imgdelbtn'}
                                onClick={removeImage}
                            >✕</button>
                        </>
                    ) : (
                        <p>拖拽圖片至此</p>
                    )}
                </div>
            </div>

            {/* 左右切換 */}
            <div className={'imgchgbtncontainer'}>
                <button
                    className={'imgchgbtn'}
                    disabled={currentIndex === 0 || images.length === 0}
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                ><i className="fa-solid fa-caret-left fa-lg"></i> 上一張</button>

                <span>{images.length > 0 ? `${currentIndex + 1} / ${images.length}` : '0 / 0'}</span>

                <button
                    className={'imgchgbtn'}
                    disabled={currentIndex === images.length - 1 || images.length === 0}
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                >下一張 <i className="fa-solid fa-caret-right fa-lg"></i></button>
            </div>

            <div className={'bottombtncontainer'}>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFiles(e.target.files)}
                    style={{ display: 'none' }}
                />
                <button
                    className={'bottombtn'}
                    onClick={() => fileInputRef.current.click()}
                >
                    選擇檔案上傳
                </button>
                <div style={{}}>
                    <button className={'bottombtn'}>
                        送出紀錄
                    </button>
                    <button
                        className={'bottombtn'}
                        style={{ marginLeft: '1vw', backgroundColor: '#ccc', color: '#333' }}
                        onClick={onClose}>
                        取消
                    </button></div>
            </div>
        </>
    );
};

const CaseDetail = () => {
    // 模擬數據
    const progressData = [
        { time: "2026/06/06 08:00", status: "到達起點", staff: "王小名" },
        { time: "2026/06/06 09:00", status: "離開起點", staff: "王小名" },
        { time: "2026/06/06 11:00", status: "到達目的", staff: "王小名" },
        { time: "2026/06/06 12:00", status: "完成搬運", staff: "王小名" },
    ];

    const incidentData = Array(5).fill({ time: "2026/06/06 09:00", type: "車禍", staff: "王小名" });

    const [newWorkRecordIsOpen, setNewWorkRecordIsOpen] = useState(false);
    const [newIncidentIsOpen, setNewIncidentIsOpen] = useState(false);

    const newWorkRecordClick = (e) => {
        e.preventDefault(); // 阻止瀏覽器跳轉或重新整理
        setNewWorkRecordIsOpen(true);
    };
    const newIncidentClick = (e) => {
        e.preventDefault(); // 阻止瀏覽器跳轉或重新整理
        setNewIncidentIsOpen(true);
    };

    return (
        <div className="casedetailcontainer">
            <div className="topText">排程號：aaaaaaa111111</div>
            <div className="row" style={{ margin: 0, flex: 1, minHeight: 0, overflow: 'hidden' }}>

                {/* 左側案件資訊 */}
                <div className="col-12 col-md-8 casedetailrow">
                    <div className="block" style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
                        <p className="blocktitle">作業資訊</p>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 30px', overflow: 'hidden' }}>
                            <div style={{ flexShrink: 0, fontSize: '20px' }}>
                                客戶名稱：<br />
                                客戶電話：<br />
                                起點：<br />
                                終點：<br />
                                狀態：<br />
                                司機：<br />
                                搬運：<br />
                                注意事項：
                            </div>
                            <p style={{ flex: 1, overflowY: 'auto', fontSize: '18px', padding: '10px', scrollbarColor: '#999 transparent' }}>
                                {Array(14).fill("X").map((text, i) => <React.Fragment key={i}>{text}<br /></React.Fragment>)}
                            </p>
                            <div style={{ height: '20px' }}></div>
                        </div>
                    </div>
                </div>
                <div className={'showgap'}></div>

                {/* 右側案件回報 */}
                <div className="col-12 col-md-4 casedetailrow" style={{ gap: '0.5%' }}>

                    {/* 進度追蹤 */}
                    <div className="block casedetailrowblock">
                        <p className="blocktitle">進度追蹤</p>
                        <div className={'tablecontainer'}>
                            <table style={{ width: '100%', textAlign: 'left' }}>
                                <thead className={'tablehead'}>
                                    <tr>
                                        <th style={{ width: '50%' }}>時間</th>
                                        <th style={{ width: '25%' }}>狀態</th>
                                        <th style={{ width: '25%' }}>回報人員</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {progressData.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.time}</td>
                                            <td>{item.status}</td>
                                            <td>{item.staff}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 現場紀錄 */}
                    <div className="block casedetailrowblock">
                        <p className="blocktitle">
                            現場紀錄
                            <a href="#" onClick={newWorkRecordClick} className={'newlink'}>新增</a>
                        </p>
                        {/* 根據狀態顯示 Dialog */}
                        <WorkRecordDialog
                            isOpen={newWorkRecordIsOpen}
                            onClose={() => setNewWorkRecordIsOpen(false)}
                        />

                        <div className={'tablecontainer'}>
                            <table style={{ width: '100%', textAlign: 'left' }}>
                                <thead className={'tablehead'}>
                                    <tr>
                                        <th style={{ width: '75%' }}>時間</th>
                                        <th style={{ width: '25%' }}>回報人員</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>2026/06/06 08:00</td><td>王小名</td></tr>
                                    <tr><td>2026/06/06 09:00</td><td>王小名</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 意外回報 */}
                    <div className="block casedetailrowblock">
                        <p className="blocktitle">
                            意外回報
                            <a href="#" onClick={newIncidentClick} className={'newlink'}>新增</a>
                        </p>
                        {/* 根據狀態顯示 Dialog */}
                        <IncidentDialog
                            isOpen={newIncidentIsOpen}
                            onClose={() => setNewIncidentIsOpen(false)}
                        />
                        <div className={'tablecontainer'}>
                            <table style={{ width: '100%', textAlign: 'left' }}>
                                <thead className={'tablehead'}>
                                    <tr>
                                        <th style={{ width: '50%' }}>時間</th>
                                        <th style={{ width: '25%' }}>類型</th>
                                        <th style={{ width: '25%' }}>回報人員</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incidentData.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.time}</td>
                                            <td>{item.type}</td>
                                            <td>{item.staff}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="invisible"></div>
            </div>
        </div>
    );
};

export default CaseDetail;
