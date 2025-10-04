
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../contexts/NavigationContext';
import { XMarkIcon } from './icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

const CartModal: React.FC = () => {
  const { isCartOpen, closeCart, cartItems, updateCartQuantity, removeFromCart, cartItemCount } = useCart();
  const { navigate } = useNavigation();
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    closeCart();
    navigate('checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50" aria-modal="true" role="dialog" >
      <div 
        className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Your Cart ({cartItemCount})</h2>
          <button onClick={closeCart} className="text-gray-500 hover:text-gray-800" aria-label="Close cart">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {cartItems.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <img src={item.imageURL} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2 border border-gray-200 rounded-md w-fit">
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-600 hover:text-gray-900" aria-label={`Decrease quantity of ${item.name}`}>
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50" aria-label={`Increase quantity of ${item.name}`}>
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                     <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 mt-2" aria-label={`Remove ${item.name} from cart`}>
                        <TrashIcon className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Shipping calculated at checkout.</p>
              <button
                onClick={handleCheckout}
                className="w-full mt-4 bg-emerald-600 text-white font-semibold py-3 rounded-md hover:bg-emerald-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
             <ShoppingCartIcon className="w-16 h-16 text-gray-300"/>
             <h3 className="mt-4 text-xl font-semibold text-gray-700">Your cart is empty</h3>
             <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
