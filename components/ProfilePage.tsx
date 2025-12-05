import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToasts } from '../contexts/ToastContext';
import { CustomerDetails } from '../types';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

const ProfilePage: React.FC = () => {
    const { currentUser, updateUserProfile, changePassword } = useAuth();
    const { showToast } = useToasts();

    const [details, setDetails] = useState({
        username: '',
        fullName: '',
        phone: '',
        address: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    useEffect(() => {
        if (currentUser) {
            setDetails({
                username: currentUser.username,
                fullName: currentUser.customerDetails?.fullName || '',
                phone: currentUser.customerDetails?.phone || '',
                address: currentUser.customerDetails?.address || ''
            });
        }
    }, [currentUser]);

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveDetails = (e: React.FormEvent) => {
        e.preventDefault();
        const customerDetails: CustomerDetails = {
            fullName: details.fullName,
            phone: details.phone,
            address: details.address,
        };
        const result = updateUserProfile({ username: details.username, customerDetails });
        if (result.success) {
            showToast('Profile updated successfully!', 'success');
        } else {
            showToast(result.message || 'Failed to update profile.', 'error');
        }
    };
    
    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('New passwords do not match.', 'error');
            return;
        }
        if (passwordData.newPassword.length < 3) {
            showToast('New password must be at least 3 characters.', 'error');
            return;
        }

        const result = changePassword(passwordData.currentPassword, passwordData.newPassword);
        if (result.success) {
            showToast('Password changed successfully!', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            showToast(result.message || 'Failed to change password.', 'error');
        }
    };
    
    const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({...prev, [field]: !prev[field]}));
    };

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    const isGoogleUser = currentUser.provider === 'google';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">My Account</h1>

            {/* Account & Shipping Details */}
            <form onSubmit={handleSaveDetails} className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-md border border-stone-200 dark:border-stone-700 space-y-6">
                <h2 className="text-xl font-bold text-stone-900 dark:text-white border-b dark:border-stone-700 pb-4">Profile Information</h2>
                
                {/* Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="username" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Username</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="w-5 h-5 text-stone-400"/></div>
                            <input type="text" id="username" name="username" value={details.username} onChange={handleDetailsChange} disabled={isGoogleUser} className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white disabled:bg-stone-100 dark:disabled:bg-stone-800 dark:disabled:text-stone-400" />
                        </div>
                         {isGoogleUser && <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Username cannot be changed for Google accounts.</p>}
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 pt-4">Saved Shipping Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Full Name</label>
                        <div className="relative mt-1">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="w-5 h-5 text-stone-400"/></div>
                             <input type="text" id="fullName" name="fullName" value={details.fullName} onChange={handleDetailsChange} className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Phone</label>
                         <div className="relative mt-1">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><PhoneIcon className="w-5 h-5 text-stone-400"/></div>
                             <input type="tel" id="phone" name="phone" value={details.phone} onChange={handleDetailsChange} className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white"/>
                        </div>
                    </div>
                 </div>
                 <div>
                    <label htmlFor="address" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Address</label>
                    <div className="relative mt-1">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPinIcon className="w-5 h-5 text-stone-400"/></div>
                         <input type="text" id="address" name="address" value={details.address} onChange={handleDetailsChange} className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white"/>
                    </div>
                </div>

                <div className="text-right pt-4">
                    <button type="submit" className="bg-rose-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-rose-700 transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>

            {/* Change Password */}
             {!isGoogleUser && (
                <form onSubmit={handleSavePassword} className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-md border border-stone-200 dark:border-stone-700 space-y-6">
                    <h2 className="text-xl font-bold text-stone-900 dark:text-white border-b dark:border-stone-700 pb-4">Change Password</h2>
                    <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Current Password</label>
                           <div className="relative mt-1">
                                <input type={showPasswords.current ? 'text' : 'password'} id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full pr-10 py-2 border rounded-md bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white" />
                                <button type="button" onClick={() => toggleShowPassword('current')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500">{showPasswords.current ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}</button>
                           </div>
                        </div>
                         <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-stone-700 dark:text-stone-300">New Password</label>
                           <div className="relative mt-1">
                                <input type={showPasswords.new ? 'text' : 'password'} id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full pr-10 py-2 border rounded-md bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white" />
                                <button type="button" onClick={() => toggleShowPassword('new')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500">{showPasswords.new ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}</button>
                           </div>
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Confirm New Password</label>
                           <div className="relative mt-1">
                                <input type={showPasswords.confirm ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full pr-10 py-2 border rounded-md bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white" />
                                <button type="button" onClick={() => toggleShowPassword('confirm')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500">{showPasswords.confirm ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}</button>
                           </div>
                        </div>
                    </div>
                     <div className="text-right pt-4">
                        <button type="submit" className="bg-rose-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-rose-700 transition-colors">
                            Update Password
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProfilePage;