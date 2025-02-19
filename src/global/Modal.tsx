import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Modal ({ isOpen, onClose, children }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            const firstInput = modalRef.current.querySelector('input');
            if (firstInput) {
                (firstInput as HTMLInputElement).focus();
            }
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
    
        document.addEventListener('keydown', handleEscape);
        return () => {
          document.removeEventListener('keydown', handleEscape);
        };
      }, [onClose]);

    if(!isOpen) return null;

    const modalRoot = document.body;
    if(!modalRoot) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div ref={modalRef} className="modal-content" onClick={(e) => e.stopPropagation()}>
                { children }
            </div>
        </div>,
        modalRoot
    )
}