// components/ToastNotification.js
import React from 'react';
import { useState, useEffect } from 'react';

const ToastNotification = ({ message, type, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => onClose(), 3000); // Auto-hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    return (
        message ? (
            <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white ${type === 'success' ? 'bg-green-700' : 'bg-red-500'}`}>
                {message}
            </div>
        ) : null
    );
};

export default ToastNotification;
