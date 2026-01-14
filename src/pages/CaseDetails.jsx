import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/CaseDetails.css';
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
            <div className={'blocktitle'}>新增紀錄</div>
            <div className={'dialogcontainer row'}>
                <div className={'block col'} style={{ height: '100%' }}>
                    <textarea className={'dialogtext'} style={{  }}>
                        在這裡輸入內容...
                    </textarea>
                </div>
                <div className={'col'}>
                    <div className={'block'} style={{ height: '70%' }}></div>
                    <div style={{ height: '15%' }} ></div>
                    <div className={'row'} style={{ height: '15%' }} >
                        <div className={'col btncontainer'}>
                            <button className={'dialogbtn'} style={{}}>新增圖片</button>
                        </div>
                        <div className={'col btncontainer'}>
                            <button className={'dialogbtn'} style={{}}>上傳紀錄</button>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    )
}

const CaseDetail = () => {
    // 模擬數據，實際應用可從 props 或 API 獲取
    const progressData = [
        { time: "2026/06/06 08:00", status: "到達起點", staff: "王小名" },
        { time: "2026/06/06 09:00", status: "離開起點", staff: "王小名" },
        { time: "2026/06/06 11:00", status: "到達目的", staff: "王小名" },
        { time: "2026/06/06 12:00", status: "完成搬運", staff: "王小名" },
    ];

    const incidentData = Array(5).fill({ time: "2026/06/06 09:00", type: "車禍", staff: "王小名" });

    const [newWorkRecordisOpen, setNewWorkRecordIsOpen] = useState(false);

    const newWorkRecordClick = (e) => {
        e.preventDefault(); // 阻止瀏覽器跳轉或重新整理
        setNewWorkRecordIsOpen(true);
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
                        <IncidentDialog
                            isOpen={newWorkRecordisOpen}
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
                            <a href="#" className={'newlink'}>新增</a>
                        </p>
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
