
import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { XMarkIcon } from './icons/XMarkIcon';
import { BellIcon } from './icons/BellIcon';
import { CheckIcon } from './icons/CheckIcon';

const NotificationPanel: React.FC = () => {
    const { notifications, isPanelOpen, closePanel, markAsRead, markAllAsRead } = useNotifications();

    if (!isPanelOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-40" onClick={closePanel}>
            <div 
                className="absolute top-16 right-4 max-w-sm w-full bg-white rounded-lg shadow-xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-3 border-b">
                    <h2 className="text-base font-semibold text-gray-800">Notifications</h2>
                    <button onClick={closePanel} className="text-gray-500 hover:text-gray-800" aria-label="Close notifications">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                
                {notifications.length > 0 ? (
                    <>
                        <div className="p-2 border-b">
                            <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:underline w-full text-right">
                                Mark all as read
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-96">
                            {notifications.map(n => (
                                <div key={n.id} className={`flex items-start gap-3 p-3 border-b last:border-b-0 ${!n.read ? 'bg-blue-50' : 'bg-white'}`}>
                                    <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} aria-hidden="true"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">{n.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                                    </div>
                                    {!n.read && (
                                        <button onClick={() => markAsRead(n.id)} className="text-gray-400 hover:text-gray-600 p-1" aria-label={`Mark notification as read`}>
                                            <CheckIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8">
                        <BellIcon className="w-12 h-12 text-gray-300" />
                        <h3 className="mt-4 text-lg font-semibold text-gray-700">No Notifications</h3>
                        <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
