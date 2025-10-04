
import React, { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useToasts } from '../contexts/ToastContext';
import { useItems } from '../contexts/ItemsContext';
// Fix: Import useNotifications to add a notification on new order.
import { useNotifications } from '../contexts/NotificationContext';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { WalletIcon } from './icons/WalletIcon';
import { CashIcon } from './icons/CashIcon';
import { Order, CustomerDetails } from '../types';

// Moved InputField outside to prevent re-creation on parent render, which caused focus loss.
const InputField: React.FC<{
  name: keyof Omit<CustomerDetails, 'email'>;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: string;
}> = ({ name, label, icon, value, onChange, error, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative mt-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);


const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { navigate } = useNavigation();
  const { showToast } = useToasts();
  const { updateItem, items: allItems } = useItems();
  const { addNotification } = useNotifications();

  const [customer, setCustomer] = useState<CustomerDetails>({ fullName: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Phone Pay');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
  const shipping = 40;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Fix: Cast `name` to a key of `CustomerDetails` to allow dynamic property setting.
    setCustomer(prev => ({ ...prev, [name as keyof CustomerDetails]: value }));
    if(errors[name]) {
        setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customer.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!customer.phone.trim()) {
        newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(customer.phone)) {
        newErrors.phone = 'Phone number must be 10 digits.';
    }
    if (!customer.address.trim()) newErrors.address = 'Address is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fill in all required fields correctly.', 'error');
      return;
    }

    // Stock check
    for (const cartItem of cartItems) {
        const storeItem = allItems.find(i => i.id === cartItem.id);
        if(!storeItem || storeItem.stock < cartItem.quantity) {
            showToast(`Sorry, ${cartItem.name} is out of stock or has limited quantity.`, 'error');
            return;
        }
    }
    
    // Process order
    const newOrder = addOrder(cartItems, customer, paymentMethod);
    // Fix: Add a notification for the new order.
    addNotification(newOrder);

    // Update stock
    cartItems.forEach(cartItem => {
        const storeItem = allItems.find(i => i.id === cartItem.id)!;
        updateItem({ ...storeItem, stock: storeItem.stock - cartItem.quantity });
    });

    clearCart();
    navigate('confirmation', { order: newOrder });
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p className="text-gray-500 mt-2">Add items to your cart to proceed to checkout.</p>
        <button onClick={() => navigate('store')} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Go Shopping
        </button>
      </div>
    );
  }
  
  const isFormValid = useMemo(() => {
    return customer.fullName.trim() && /^\d{10}$/.test(customer.phone.trim()) && customer.address.trim();
  }, [customer]);

  const paymentOptions = [
    { id: 'Phone Pay', icon: WalletIcon, label: 'Phone Pay' },
    { id: 'Cash on Delivery', icon: CashIcon, label: 'Cash on Delivery' },
  ] as const;


  return (
    <form onSubmit={handlePlaceOrder} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Customer Details */}
      <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Shipping Information</h2>
        <InputField name="fullName" label="Full Name" icon={<UserIcon className="w-5 h-5 text-gray-400" />} value={customer.fullName} onChange={handleInputChange} error={errors.fullName} />
        <InputField name="phone" label="Phone" type="tel" icon={<PhoneIcon className="w-5 h-5 text-gray-400" />} value={customer.phone} onChange={handleInputChange} error={errors.phone} />
        <InputField name="address" label="Address" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} value={customer.address} onChange={handleInputChange} error={errors.address} />
        
        <h2 className="text-2xl font-bold text-gray-800 pt-4">Payment Method</h2>
        <div className="flex flex-wrap gap-4">
            {paymentOptions.map(({ id, icon: Icon, label }) => (
                 <button type="button" key={id} onClick={() => setPaymentMethod(id)} className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${paymentMethod === id ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-100'}`}>
                    <Icon className="w-5 h-5" /> {label}
                </button>
            ))}
        </div>
        
        {paymentMethod === 'Phone Pay' && (
            <div className="text-center bg-gray-50 p-6 rounded-lg">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=9980327249@kotak811`} alt="UPI QR Code" className="mx-auto"/>
                <p className="mt-4 text-gray-600">Scan the QR code with your favorite payment app to complete the purchase.</p>
            </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-8 rounded-lg shadow-md lg:col-span-1 h-fit sticky top-28">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-4 text-sm">
                    <div className="flex gap-3">
                        <img src={item.imageURL} alt={item.name} className="w-12 h-12 rounded-md object-cover"/>
                        <div>
                           <p className="font-semibold text-gray-800">{item.name}</p>
                           <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                    </div>
                    <span className="font-medium text-gray-800 whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
        </div>
        <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span>₹{shipping.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg mt-2"><span className="text-gray-900">Total</span><span className="text-blue-600">₹{total.toFixed(2)}</span></div>
        </div>
         <button 
            type="submit"
            disabled={!isFormValid}
            className="w-full mt-8 flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 rounded-md hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <LockClosedIcon className="w-5 h-5"/> Place Order (₹{total.toFixed(2)})
        </button>
      </div>
    </form>
  );
};

export default CheckoutPage;
