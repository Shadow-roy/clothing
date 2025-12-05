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
                return <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100/80 dark:text-amber-300 dark:bg-amber-900/50 px-3 py-1 rounded-full border border-amber-200/50 dark:border-amber-700/50"><ClockIcon className="w-3.5 h-3.5"/>{status}</span>;
            case 'Out for Delivery':
                return <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-100/80 dark:text-sky-300 dark:bg-sky-900/50 px-3 py-1 rounded-full border border-sky-200/50 dark:border-sky-700/50"><TruckIcon className="w-3.5 h-3.5"/>{status}</span>;
            case 'Delivered':
                return <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/80 dark:text-emerald-300 dark:bg-emerald-900/50 px-3 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-700/50"><CheckCircleIcon className="w-3.5 h-3.5"/>{status}</span>;
            default:
                return null;
        }
    };

    return (
        <div className="group rounded-xl overflow-hidden transition-all duration-300 
            bg-white/60 dark:bg-stone-800/40 backdrop-blur-sm border border-white/60 dark:border-stone-700/50 
            hover:shadow-md hover:border-rose-200/50 dark:hover:border-rose-900/30">
            <button 
                className="w-full flex justify-between items-center p-5 text-left transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-stone-800 dark:text-stone-100 text-lg">#{order.id.replace('#', '')}</span>
                        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium px-2 py-0.5 bg-stone-100 dark:bg-stone-700 rounded-md">
                            {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        {getStatusChip(order.status)}
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-stone-500 dark:text-stone-400">Total</p>
                        <p className="font-bold text-stone-800 dark:text-stone-100 text-lg">₹{order.total.toFixed(2)}</p>
                    </div>
                    <div className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-rose-100 dark:bg-rose-900/30 rotate-180' : 'bg-stone-100 dark:bg-stone-700 group-hover:bg-rose-50 dark:group-hover:bg-stone-600'}`}>
                        <ChevronDownIcon className={`w-5 h-5 ${isExpanded ? 'text-rose-600 dark:text-rose-400' : 'text-stone-500 dark:text-stone-400'}`} />
                    </div>
                </div>
            </button>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-5 pt-0 border-t border-dashed border-stone-200 dark:border-stone-700/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mt-4 mb-3">Order Items</h4>
                    <ul className="space-y-3">
                        {order.items.map(item => (
                            <li key={item.id} className="flex items-center justify-between group/item">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-700">
                                        <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover/item:opacity-100 transition-opacity" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{item.name}</p>
                                        <p className="text-xs text-stone-500 dark:text-stone-400">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700/30 flex justify-between items-center">
                         <span className="text-xs text-stone-500 dark:text-stone-400">Shipping</span>
                         <span className="text-xs font-medium text-stone-600 dark:text-stone-300">₹{order.shipping.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


const CustomerOrderHistoryModal: React.FC = () => {
  const { orders, isHistoryOpen, closeHistory } = useOrders();

  if (!isHistoryOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-stone-900/30 dark:bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={closeHistory}
      ></div>

      {/* Slide-over Panel with Glassmorphism */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex flex-col shadow-2xl transition-transform duration-300 transform translate-x-0
        bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-l border-white/20 dark:border-stone-700/30">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200/50 dark:border-stone-700/50">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-white">Your Orders</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">Track and manage your purchases</p>
          </div>
          <button 
            onClick={closeHistory} 
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors" 
            aria-label="Close order history"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <OrderItem key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
                  <ReceiptIcon className="w-10 h-10 text-stone-400 dark:text-stone-500" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-stone-800 dark:text-stone-200">No past orders</h3>
              <p className="mt-2 text-stone-500 dark:text-stone-400 max-w-xs">Looks like you haven't discovered your style yet. Start shopping to fill this page!</p>
            </div>
          )}
        </div>
        
        {/* Footer decoration */}
        <div className="p-4 border-t border-stone-200/50 dark:border-stone-700/50 text-center text-xs text-stone-400 dark:text-stone-600">
            ChicChariot &bull; Est. 2024
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderHistoryModal;