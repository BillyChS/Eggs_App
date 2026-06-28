import React, { useState, useRef } from 'react';
import FeedbackModal, { FeedbackType } from '../components/FeedbackModal';
import Toast from '../components/Toast';

interface ModalState {
    visible: boolean;
    type: FeedbackType;
    title: string;
    message: string;
    onConfirm?: () => void;
}

interface ToastState {
    visible: boolean;
    message: string;
    onDismiss?: () => void;
}

const HIDDEN_MODAL: ModalState = { visible: false, type: 'error', title: '', message: '' };
const HIDDEN_TOAST: ToastState = { visible: false, message: '' };

export const useFeedback = () => {
    const [modal, setModal] = useState<ModalState>(HIDDEN_MODAL);
    const [toast, setToast] = useState<ToastState>(HIDDEN_TOAST);

    const showError = (message: string) =>
        setModal({ visible: true, type: 'error', title: 'Error', message });

    const showWarning = (message: string) =>
        setModal({ visible: true, type: 'warning', title: 'Atención', message });

    const showConfirm = (title: string, message: string, onConfirm: () => void) =>
        setModal({ visible: true, type: 'confirm', title, message, onConfirm });

    const showSuccess = (message: string, onDismiss?: () => void) =>
        setToast({ visible: true, message, onDismiss });

    const dismissModal = () => setModal(HIDDEN_MODAL);

    const handleConfirm = () => {
        const cb = modal.onConfirm;
        dismissModal();
        cb?.();
    };

    const dismissToast = () => {
        const cb = toast.onDismiss;
        setToast(HIDDEN_TOAST);
        cb?.();
    };

    const FeedbackUI = (
        <>
            <FeedbackModal
                visible={modal.visible}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onDismiss={dismissModal}
                onConfirm={handleConfirm}
            />
            <Toast
                visible={toast.visible}
                message={toast.message}
                onDismiss={dismissToast}
            />
        </>
    );

    return { showError, showWarning, showSuccess, showConfirm, FeedbackUI };
};
