import React, { useState, useRef } from 'react';

const ImageUploader = () => {
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
    <div style={{ width: '400px', margin: '20px auto', textAlign: 'center' }}>
      {/* 拖拽/顯示視窗 */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          width: '100%', height: '300px', border: '2px dashed #ccc',
          position: 'relative', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#f8f9fa', borderRadius: '8px'
        }}
      >
        {images.length > 0 ? (
          <>
            <img src={images[currentIndex].url} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            <button
              onClick={removeImage}
              style={{
                position: 'absolute', top: '10px', right: '10px',
                background: 'rgba(255,0,0,0.7)', color: 'white', border: 'none',
                borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer'
              }}
            >✕</button>
          </>
        ) : (
          <p>拖拽圖片至此</p>
        )}
      </div>

      {/* 左右切換 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0' }}>
        <button 
          disabled={currentIndex === 0 || images.length === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >◀ 上一張</button>
        
        <span>{images.length > 0 ? `${currentIndex + 1} / ${images.length}` : '0 / 0'}</span>
        
        <button 
          disabled={currentIndex === images.length - 1 || images.length === 0}
          onClick={() => setCurrentIndex(currentIndex + 1)}
        >下一張 ▶</button>
      </div>

      {/* 手動按鈕 */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />
      <button 
        onClick={() => fileInputRef.current.click()}
        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        選擇檔案上傳
      </button>
    </div>
  );
};

export default ImageUploader;
