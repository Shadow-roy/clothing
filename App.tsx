import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { ItemsProvider } from './contexts/ItemsContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { OrderProvider, useOrders } from './contexts/OrderContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';
import { WishlistProvider, useWishlist } from './contexts/WishlistContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Storefront from './components/Storefront';
import ItemDetail from './components/ItemDetail';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import CartModal from './components/CartModal';
import WishlistModal from './components/WishlistModal';
import CustomerOrderHistoryModal from './components/CustomerOrderHistoryModal';
import ToastContainer from './components/ToastContainer';
import ProfilePage from './components/ProfilePage';
import { ShoppingCartIcon } from './components/icons/ShoppingCartIcon';
import { HeartOutlineIcon } from './components/icons/HeartOutlineIcon';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
      <AuthProvider>
      <ItemsProvider>
      <OrderProvider>
      <CartProvider>
      <WishlistProvider>
      <NavigationProvider>
        <NotificationProvider>
          <div className="bg-gray-50 dark:bg-slate-900 min-h-screen font-sans">
              <AppContent />
              <ToastContainer />
          </div>
        </NotificationProvider>
      </NavigationProvider>
      </WishlistProvider>
      </CartProvider>
      </OrderProvider>
      </ItemsProvider>
      </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

const AppContent: React.FC = () => {
    const { page, params, navigate } = useNavigation();
    const { isLoggedIn, isAdmin } = useAuth();

    useEffect(() => {
        if (isLoggedIn && page === 'login') {
            navigate('store');
        } else if (!isLoggedIn && page !== 'login') {
            navigate('login');
        }
    }, [isLoggedIn, page, navigate]);
    
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
            case 'profile':
                return isLoggedIn ? <ProfilePage /> : <Login />;
            case 'admin':
                return isLoggedIn && isAdmin ? <AdminDashboard /> : <Login />;
            default:
                return <Storefront />;
        }
    };
    
    if (page === 'login') {
        return <Login />;
    }
    
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
            <WishlistModal />
            <CustomerOrderHistoryModal />
        </>
    );
};

// Create a simple header component for navigation
const Header: React.FC = () => {
  const { navigate, page } = useNavigation();
  const { openCart, cartItemCount } = useCart();
  const { openHistory } = useOrders();
  const { isLoggedIn, logout, isAdmin } = useAuth();
  const { openWishlist, wishlistItemCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  
  const textButtonClass = "text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors";
  const iconButtonClass = "relative text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700";

  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 onClick={() => navigate('store')} className="text-slate-800 dark:text-white text-2xl font-bold cursor-pointer font-serif">ChicChariot</h1>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
             <button onClick={openHistory} className={textButtonClass}>Order History</button>
             {isLoggedIn ? (
                <>
                  <button onClick={() => navigate('profile')} className={page === 'profile' ? 'text-sm font-medium text-indigo-600 dark:text-indigo-400' : textButtonClass}>My Account</button>
                  {isAdmin && <button onClick={() => navigate('admin')} className={page === 'admin' ? 'text-sm font-medium text-indigo-600 dark:text-indigo-400' : textButtonClass}>Admin</button>}
                  <button onClick={logout} className={textButtonClass}>Logout</button>
                </>
             ) : (
                <button onClick={() => navigate('login')} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition hover:bg-indigo-700 shadow-sm">Login / Sign Up</button>
             )}
             <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <button onClick={openWishlist} className={iconButtonClass}>
                <HeartOutlineIcon className="h-6 w-6" />
                {wishlistItemCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 bg-red-500 text-white text-[10px] rounded-full">{wishlistItemCount}</span>
                )}
            </button>
            <button onClick={openCart} className={iconButtonClass}>
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 bg-red-500 text-white text-[10px] rounded-full">{cartItemCount}</span>
                )}
            </button>
             <button onClick={toggleTheme} className={iconButtonClass} aria-label="Toggle theme">
              {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default App;