import React from 'react';

const PreviewModal: React.FC<{
    visible: boolean;
    imageUrl: string;
    onClose: () => void;
}> = ({ visible, imageUrl, onClose }) => {
    if (!visible) return null;

    return (
        <div
            className="modal-overlay"
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
            onClick={onClose}
        >
            <img
                src={imageUrl}
                alt="预览"
                style={{
                    maxWidth: '80vw',
                    maxHeight: '80vh',
                    boxShadow: '0 0 20px rgba(255,255,255,0.8)',
                    borderRadius: '8px',
                }}
            />
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    padding: '8px 12px',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >
                关闭
            </button>
        </div>
    );
};

export default PreviewModal;