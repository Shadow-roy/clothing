

import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { ItemsProvider } from './contexts/ItemsContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { OrderProvider, useOrders } from './contexts/OrderContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';
import Storefront from './components/Storefront';
import ItemDetail from './components/ItemDetail';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import CartModal from './components/CartModal';
import CustomerOrderHistoryModal from './components/CustomerOrderHistoryModal';
import ToastContainer from './components/ToastContainer';
import { ShoppingCartIcon } from './components/icons/ShoppingCartIcon';

function App() {
  return (
    <ToastProvider>
    <AuthProvider>
    <ItemsProvider>
    <OrderProvider>
    <CartProvider>
    <NavigationProvider>
      <NotificationProvider>
        <div className="bg-gray-50 min-h-screen font-sans">
            <AppContent />
            <ToastContainer />
        </div>
      </NotificationProvider>
    </NavigationProvider>
    </CartProvider>
    </OrderProvider>
    </ItemsProvider>
    </AuthProvider>
    </ToastProvider>
  );
}

const AppContent: React.FC = () => {
    const { page, params } = useNavigation();
    const { isLoggedIn, isAdmin } = useAuth();
    
    const renderPage = () => {
        switch (page) {
            case 'store':
                return <Storefront />;
            case 'detail':
                return params.item ? <ItemDetail item={params.item} /> : <Storefront />;
            case 'checkout':
                return <CheckoutPage />;
            case 'confirmation':
                return params.order ? <OrderConfirmationPage order={params.order} /> : <Storefront />;
            case 'login':
                return <Login />;
            case 'admin':
                return isLoggedIn && isAdmin ? <AdminDashboard /> : <Login />;
            default:
                return <Storefront />;
        }
    };
    
    // Admin page has its own layout, so we don't render the header for it.
    if(page === 'admin' && isLoggedIn && isAdmin) {
      return <AdminDashboard />
    }

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            <CartModal />
            <CustomerOrderHistoryModal />
        </>
    );
};

// Create a simple header component for navigation
const Header: React.FC = () => {
  const { navigate, page } = useNavigation();
  const { openCart, cartItemCount } = useCart();
  const { openHistory } = useOrders();
  const { isLoggedIn, logout, currentUser, isAdmin } = useAuth();
  
  const navClass = (p: string) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${page === p ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;

  return (
    <header className="bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 onClick={() => navigate('store')} className="text-white text-xl font-bold cursor-pointer">GroceryGloss</h1>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={openHistory} className={navClass('history')}>Order History</button>
             {isLoggedIn ? (
                <>
                  {isAdmin && <button onClick={() => navigate('admin')} className={navClass('admin')}>Admin</button>}
                  <span className="text-gray-300 text-sm hidden sm:block">Hi, {currentUser?.username}</span>
                  <button onClick={logout} className={navClass('logout')}>Logout</button>
                </>
             ) : (
                <button onClick={() => navigate('login')} className={navClass('login')}>Login / Sign Up</button>
             )}
            <button onClick={openCart} className="relative text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs rounded-full">{cartItemCount}</span>
                )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default App;
