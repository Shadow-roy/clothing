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
import { ReviewsProvider } from './contexts/ReviewsContext';
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
      <ReviewsProvider>
      <NavigationProvider>
        <NotificationProvider>
          {/* Main Background with Gradients for Glassmorphism */}
          <div className="min-h-screen font-sans transition-colors duration-200 relative bg-stone-50 dark:bg-black text-stone-800 dark:text-stone-100 selection:bg-fuchsia-500 selection:text-white">
              {/* Background Orbs */}
              <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                  {/* Light Mode Gradients */}
                  <div className="dark:hidden absolute top-0 left-1/4 w-96 h-96 bg-rose-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                  <div className="dark:hidden absolute top-0 right-1/4 w-96 h-96 bg-stone-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                  
                  {/* Dark Mode Gradients (Requested Theme) */}
                  {/* Purple/Pink Glow (Bottom Left) */}
                  <div className="hidden dark:block absolute -bottom-[10%] -left-[10%] w-[70vw] h-[70vw] bg-fuchsia-700/25 rounded-full mix-blend-screen filter blur-[120px] opacity-100 animate-pulse"></div>
                  {/* Cyan/Blue Glow (Bottom Right) */}
                  <div className="hidden dark:block absolute -bottom-[10%] -right-[10%] w-[70vw] h-[70vw] bg-cyan-600/25 rounded-full mix-blend-screen filter blur-[120px] opacity-100 animate-pulse animation-delay-4000"></div>
                  {/* Subtle Top Glow to bridge them */}
                  <div className="hidden dark:block absolute top-[-20%] left-[20%] w-[60vw] h-[40vw] bg-purple-900/10 rounded-full filter blur-[150px]"></div>
              </div>

              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col min-h-screen">
                  <AppContent />
              </div>
              <ToastContainer />
          </div>
        </NotificationProvider>
      </NavigationProvider>
      </ReviewsProvider>
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
            <main className="container mx-auto px-4 py-8 flex-grow">
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
  
  const textButtonClass = "text-sm font-medium text-stone-600 hover:text-rose-600 dark:text-stone-300 dark:hover:text-rose-400 transition-colors";
  const iconButtonClass = "relative text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-stone-100/50 dark:hover:bg-white/10";

  return (
    <header className="bg-white/70 dark:bg-black/30 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm sticky top-0 z-40 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 onClick={() => navigate('store')} className="text-stone-800 dark:text-white text-2xl font-bold cursor-pointer font-serif tracking-tight">ChicChariot</h1>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
             <button onClick={openHistory} className={textButtonClass}>Orders</button>
             {isLoggedIn ? (
                <>
                  <button onClick={() => navigate('profile')} className={page === 'profile' ? 'text-sm font-medium text-rose-600 dark:text-rose-400' : textButtonClass}>Account</button>
                  {isAdmin && <button onClick={() => navigate('admin')} className={page === 'admin' ? 'text-sm font-medium text-rose-600 dark:text-rose-400' : textButtonClass}>Admin</button>}
                  <button onClick={logout} className={textButtonClass}>Logout</button>
                </>
             ) : (
                <button onClick={() => navigate('login')} className="bg-rose-600/90 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg shadow-rose-200/20 dark:shadow-none backdrop-blur-sm">Login</button>
             )}
             <div className="h-6 w-px bg-stone-300 dark:bg-white/10 hidden sm:block"></div>
            <button onClick={openWishlist} className={iconButtonClass}>
                <HeartOutlineIcon className="h-6 w-6" />
                {wishlistItemCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 bg-rose-500 text-white text-[10px] rounded-full ring-2 ring-white dark:ring-black">{wishlistItemCount}</span>
                )}
            </button>
            <button onClick={openCart} className={iconButtonClass}>
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 bg-rose-500 text-white text-[10px] rounded-full ring-2 ring-white dark:ring-black">{cartItemCount}</span>
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