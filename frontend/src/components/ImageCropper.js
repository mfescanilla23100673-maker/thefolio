import React, { useEffect, useRef, useState } from 'react';

const ImageCropper = ({ file, onCrop, label = 'Crop image', previewLabel = 'Preview' }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scale, setScale] = useState(1.1);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setImageUrl(null);
      setPreviewUrl(null);
      setImage(null);
      setScale(1.1);
      setMessage('');
      onCrop(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setScale(1.1);
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, onCrop]);

  useEffect(() => {
    if (image) {
      drawPreview(image, scale);
    }
  }, [image, scale]);

  const drawPreview = (img, scaleValue) => {
    const size = 320;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, size, size);

    const imageRatio = img.width / img.height;
    const targetSize = size * scaleValue;
    let drawWidth;
    let drawHeight;
    if (imageRatio > 1) {
      drawWidth = targetSize;
      drawHeight = targetSize / imageRatio;
      if (drawHeight < size) {
        drawHeight = size;
      }
    } else {
      drawHeight = targetSize;
      drawWidth = targetSize * imageRatio;
      if (drawWidth < size) {
        drawWidth = size;
      }
    }

    const dx = (size - drawWidth) / 2;
    const dy = (size - drawHeight) / 2;
    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    setPreviewUrl(canvas.toDataURL('image/jpeg'));
  };

  const handleCrop = () => {
    if (!image) return;
    const size = 320;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const imageRatio = image.width / image.height;
    const targetSize = size * scale;
    let drawWidth;
    let drawHeight;
    if (imageRatio > 1) {
      drawWidth = targetSize;
      drawHeight = targetSize / imageRatio;
      if (drawHeight < size) {
        drawHeight = size;
      }
    } else {
      drawHeight = targetSize;
      drawWidth = targetSize * imageRatio;
      if (drawWidth < size) {
        drawWidth = size;
      }
    }

    const dx = (size - drawWidth) / 2;
    const dy = (size - drawHeight) / 2;
    ctx.drawImage(image, dx, dy, drawWidth, drawHeight);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const croppedBlob = new File([blob], file.name, { type: 'image/jpeg' });
      onCrop(croppedBlob);
      setMessage('Image cropped and ready to upload.');
      setPreviewUrl(canvas.toDataURL('image/jpeg'));
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className='cropper-panel'>
      <div className='cropper-header'>
        <h4>{label}</h4>
        <p>Drag the zoom slider to resize and click Crop when ready.</p>
      </div>
      {imageUrl && (
        <>
          <div className='cropper-preview'>
            <img src={previewUrl || imageUrl} alt='Crop preview' className='cropper-image' />
          </div>
          <div className='cropper-controls'>
            <label htmlFor='crop-scale'>Zoom / Resize</label>
            <input
              id='crop-scale'
              type='range'
              min='1'
              max='3'
              step='0.05'
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
            <button type='button' className='btn-secondary' onClick={handleCrop}>
              Crop Image
            </button>
          </div>
          {message && <p className='cropper-message'>{message}</p>}
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ImageCropper;
