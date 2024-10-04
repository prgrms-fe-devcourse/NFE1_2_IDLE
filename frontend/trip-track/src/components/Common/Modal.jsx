import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;  // 모달이 열리지 않은 경우 렌더링하지 않음

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;