import React, { useState } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';
import { useAuth } from '../contexts/AuthContext';

interface PasswordInputProps {
  name: 'current' | 'newPass' | 'confirmPass';
  label: string;
  value: string;
  error?: string;
  show: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onToggleShow: () => void;
}

// Moved PasswordInput outside to prevent re-creation on parent render, which caused focus loss.
const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  label,
  value,
  error,
  show,
  onChange,
  onBlur,
  onToggleShow,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative mt-1">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`block w-full border rounded-md shadow-sm p-2 pr-10 ${error ? 'border-red-500' : 'border-gray-300'}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
        onClick={onToggleShow}
        aria-label={show ? `Hide ${label}` : `Show ${label}`}
      >
        {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </button>
    </div>
    {error && 
      <div id={`${name}-error`} className="flex items-center text-red-500 text-xs mt-1">
        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
        <span>{error}</span>
      </div>
    }
  </div>
);

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { adminPassword, updatePassword } = useAuth();
  const [formData, setFormData] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(errors[name]) {
        // Clear error on type to provide a better UX
        setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[name];
            return newErrors;
        });
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof typeof formData; value: string };
    
    let error = '';
    switch(name) {
        case 'current':
            if (!value) error = 'Current password is required.';
            else if (value !== adminPassword) error = 'Current password does not match.';
            break;
        case 'newPass':
            if (!value) error = 'New password is required.';
            else if (value.length < 3) error = 'New password must be at least 3 characters.';
            break;
        case 'confirmPass':
            if (!value) error = 'Please confirm your new password.';
            else if (formData.newPass !== value) error = 'Passwords do not match.';
            break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));

    // Also re-validate the confirm password field if the new password changes
    if (name === 'newPass' && formData.confirmPass) {
        if (value !== formData.confirmPass) {
            setErrors(prev => ({ ...prev, confirmPass: 'Passwords do not match.' }));
        } else {
             setErrors(prev => {
                const nextErrors = { ...prev };
                delete nextErrors.confirmPass;
                return nextErrors;
            });
        }
    }
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({...prev, [field]: !prev[field]}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.current) {
        newErrors.current = 'Current password is required.';
    } else if (formData.current !== adminPassword) {
        newErrors.current = 'Current password does not match.';
    }
    if (!formData.newPass) {
        newErrors.newPass = 'New password is required.';
    } else if (formData.newPass.length < 3) {
      newErrors.newPass = 'New password must be at least 3 characters.';
    }
    if (!formData.confirmPass) {
        newErrors.confirmPass = 'Please confirm your new password.';
    } else if (formData.newPass !== formData.confirmPass) {
      newErrors.confirmPass = 'Passwords do not match.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      updatePassword(formData.newPass);
      onClose();
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-4 sm:p-6 space-y-4">
            <PasswordInput 
                name="current" 
                label="Current Password" 
                value={formData.current}
                error={errors.current}
                show={showPasswords.current}
                onChange={handleChange}
                onBlur={handleBlur}
                onToggleShow={() => toggleShowPassword('current')}
            />
            <PasswordInput 
                name="newPass" 
                label="New Password" 
                value={formData.newPass}
                error={errors.newPass}
                show={showPasswords.new}
                onChange={handleChange}
                onBlur={handleBlur}
                onToggleShow={() => toggleShowPassword('new')}
            />
            <PasswordInput 
                name="confirmPass" 
                label="Confirm New Password" 
                value={formData.confirmPass}
                error={errors.confirmPass}
                show={showPasswords.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                onToggleShow={() => toggleShowPassword('confirm')}
            />
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Update Password
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
