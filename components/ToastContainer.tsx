
import React, { useContext } from 'react';
import { ToastStateContext } from '../contexts/ToastContext';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';

const Toast: React.FC<{ message: string; type: 'success' | 'error' }> = ({ message, type }) => {
  const Icon = type === 'success' ? CheckCircleIcon : ExclamationCircleIcon;
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className={`flex items-center gap-4 w-full max-w-md p-4 text-white ${bgColor} rounded-xl shadow-lg`}>
      <Icon className="w-7 h-7 flex-shrink-0" />
      <div className="text-base font-medium">{message}</div>
    </div>
  );
};


const ToastContainer: React.FC = () => {
  const toasts = useContext(ToastStateContext);

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 space-y-4 z-[9999]"
    >
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  );
};

export default ToastContainer;
