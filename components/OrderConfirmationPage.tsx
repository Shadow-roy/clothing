import React from 'react';
import { Order } from '../types';
import { useNavigation } from '../contexts/NavigationContext';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface OrderConfirmationPageProps {
  order: Order;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order }) => {
    const { navigate } = useNavigation();

    if (!order) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-red-600">Order Not Found</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-2">We couldn't find the details for your order.</p>
                <button onClick={() => navigate('store')} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                    Return to Store
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto text-center py-12 px-4">
            <div className="relative inline-block">
                <CheckCircleIcon className="w-24 h-24 text-green-500" />
                <SparklesIcon className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-stone-900 dark:text-white">Thank You for Your Order!</h1>
            <p className="mt-2 text-lg text-stone-600 dark:text-stone-400">Your order has been placed successfully.</p>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-500">Order ID: <span className="font-medium text-stone-700 dark:text-stone-300">{order.id}</span></p>

            <div className="mt-10 text-left bg-white dark:bg-stone-800 p-6 rounded-lg border border-stone-200 dark:border-stone-700">
                <h2 className="text-xl font-semibold text-stone-900 dark:text-white mb-4">Order Summary</h2>
                <div className="space-y-3">
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-stone-600 dark:text-stone-300">{item.name} <span className="text-stone-500 dark:text-stone-400">x {item.quantity}</span></span>
                            <span className="font-medium text-stone-800 dark:text-stone-100">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-stone-200 dark:border-stone-700 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-stone-600 dark:text-stone-400">Subtotal</span><span className="text-stone-800 dark:text-stone-200">₹{order.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-stone-600 dark:text-stone-400">Shipping</span><span className="text-stone-800 dark:text-stone-200">₹{order.shipping.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg mt-2"><span className="text-stone-900 dark:text-white">Total Paid</span><span className="text-stone-800 dark:text-stone-100">₹{order.total.toFixed(2)}</span></div>
                </div>
            </div>

            <button
                onClick={() => navigate('store')}
                className="mt-10 w-full sm:w-auto bg-rose-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-rose-700 transition-colors"
            >
                Continue Shopping
            </button>
        </div>
    );
};

export default OrderConfirmationPage;