import React from 'react';
import { Order } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { IdentificationIcon } from './icons/IdentificationIcon';

interface ShippingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const DetailRow: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="text-gray-500 dark:text-gray-400 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const ShippingDetailsModal: React.FC<ShippingDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 sm:p-6 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-6">
            <DetailRow icon={<IdentificationIcon className="w-5 h-5"/>} label="Order ID" value={order.id}/>
            <DetailRow icon={<UserIcon className="w-5 h-5"/>} label="Full Name" value={order.customer.fullName}/>
            <DetailRow icon={<PhoneIcon className="w-5 h-5"/>} label="Phone Number" value={order.customer.phone}/>
            <DetailRow icon={<MapPinIcon className="w-5 h-5"/>} label="Shipping Address" value={order.customer.address}/>
        </div>
         <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 flex flex-row-reverse rounded-b-lg">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
      </div>
    </div>
  );
};

export default ShippingDetailsModal;