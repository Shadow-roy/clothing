
// Fix: Implemented the CustomerOrderHistoryModal component.
import React, { useState } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { XMarkIcon } from './icons/XMarkIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';
import { Order } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ClockIcon } from './icons/ClockIcon';
import { TruckIcon } from './icons/TruckIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const OrderItem: React.FC<{ order: Order }> = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusChip = (status: Order['status']) => {
        switch (status) {
            case 'Pending':
                return <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full"><ClockIcon className="w-4 h-4"/>{status}</span>;
            case 'Out for Delivery':
                return <span className="flex items-center gap-1.5 text-xs font-medium text-green-800 bg-green-100 px-2 py-1 rounded-full"><TruckIcon className="w-4 h-4"/>{status}</span>;
            case 'Delivered':
                return <span className="flex items-center gap-1.5 text-xs font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded-full"><CheckCircleIcon className="w-4 h-4"/>{status}</span>;
            default:
                return null;
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg">
            <button 
                className="w-full flex justify-between items-center p-4 text-left"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                <div>
                    <p className="font-semibold text-gray-800">Order {order.id}</p>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                     <div className="mt-2 sm:hidden"> 
                        {getStatusChip(order.status)}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                        {getStatusChip(order.status)}
                    </div>
                    <span className="font-bold text-gray-900">₹{order.total.toFixed(2)}</span>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <ul className="space-y-2 text-sm">
                        {order.items.map(item => (
                            <li key={item.id} className="flex justify-between">
                                <span>{item.name} <span className="text-gray-500">x {item.quantity}</span></span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


const CustomerOrderHistoryModal: React.FC = () => {
  const { orders, isHistoryOpen, closeHistory } = useOrders();

  if (!isHistoryOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50" aria-modal="true" role="dialog">
      <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Order History</h2>
          <button onClick={closeHistory} className="text-gray-500 hover:text-gray-800" aria-label="Close order history">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <OrderItem key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ReceiptIcon className="w-16 h-16 text-gray-300" />
              <h3 className="mt-4 text-xl font-semibold text-gray-700">No Order History</h3>
              <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderHistoryModal;
