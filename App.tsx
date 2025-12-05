import React, { useEffect, useState } from 'react';
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
import { Bars3Icon } from './components/icons/Bars3Icon';
import { XMarkIcon } from './components/icons/XMarkIcon';

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
          <div className="min-h-screen font-sans transition-colors duration-200 relative bg-stone-50 dark:bg-stone-950">
              {/* Background Orbs */}
              <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/30 dark:bg-rose-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
                  <div className="absolute top-0 right-1/4 w-96 h-96 bg-stone-200/40 dark:bg-stone-800/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-rose-100/30 dark:bg-rose-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const textButtonClass = "text-sm font-medium text-stone-600 hover:text-rose-600 dark:text-stone-300 dark:hover:text-rose-400 transition-colors";
  const iconButtonClass = "relative text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-stone-100/50 dark:hover:bg-stone-700/50";

  const handleMobileNav = (action: () => void) => {
      action();
      setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border-b border-white/20 dark:border-stone-800 shadow-sm sticky top-0 z-40 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 onClick={() => navigate('store')} className="text-stone-800 dark:text-white text-2xl font-bold cursor-pointer font-serif tracking-tight">ChicChariot</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 sm:gap-4">
             <button onClick={openHistory} className={textButtonClass}>Orders</button>
             {isLoggedIn ? (
                <>
                  <button onClick={() => navigate('profile')} className={page === 'profile' ? 'text-sm font-medium text-rose-600 dark:text-rose-400' : textButtonClass}>Account</button>
                  {isAdmin && <button onClick={() => navigate('admin')} className={page === 'admin' ? 'text-sm font-medium text-rose-600 dark:text-rose-400' : textButtonClass}>Admin</button>}
                  <button onClick={logout} className={textButtonClass}>Logout</button>
                </>
             ) : (
                <button onClick={() => navigate('login')} className="bg-rose-600/90 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg shadow-rose-200 dark:shadow-none backdrop-blur-sm">Login</button>
             )}
             <div className="h-6 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block"></div>
            <button onClick={openWishlist} className={iconButtonClass}>
                <HeartOutlineIcon className="h-6 w-6" />
                {wishlistItemCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 bg-rose-500 text-white text-[10px] rounded-full ring-2 ring-white dark:ring-stone-900">{wishlistItemCount}</span>
                )}
            </button>
            <button onClick={openCart} className={iconButtonClass}>
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 bg-rose-500 text-white text-[10px] rounded-full ring-2 ring-white dark:ring-stone-900">{cartItemCount}</span>
                )}
            </button>
             <button onClick={toggleTheme} className={iconButtonClass} aria-label="Toggle theme">
              {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
          </nav>

          {/* Mobile Navigation Icons & Menu Toggle */}
          <div className="flex md:hidden items-center gap-1">
             <button onClick={openWishlist} className={iconButtonClass}>
                <HeartOutlineIcon className="h-6 w-6" />
                {wishlistItemCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center h-3 w-3 bg-rose-500 text-white text-[9px] rounded-full ring-1 ring-white dark:ring-stone-900">{wishlistItemCount}</span>
                )}
            </button>
            <button onClick={openCart} className={iconButtonClass}>
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center h-3 w-3 bg-rose-500 text-white text-[9px] rounded-full ring-1 ring-white dark:ring-stone-900">{cartItemCount}</span>
                )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-stone-600 dark:text-stone-300">
                {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 z-50">
             <button onClick={() => handleMobileNav(openHistory)} className="text-left py-2 px-4 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-stone-700 dark:text-stone-200">Orders</button>
             {isLoggedIn ? (
                <>
                  <button onClick={() => handleMobileNav(() => navigate('profile'))} className="text-left py-2 px-4 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-stone-700 dark:text-stone-200">Account</button>
                  {isAdmin && <button onClick={() => handleMobileNav(() => navigate('admin'))} className="text-left py-2 px-4 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-stone-700 dark:text-stone-200">Admin Dashboard</button>}
                  <button onClick={() => handleMobileNav(logout)} className="text-left py-2 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-red-600 dark:text-red-400">Logout</button>
                </>
             ) : (
                <button onClick={() => handleMobileNav(() => navigate('login'))} className="text-center py-2 px-4 bg-rose-600 text-white rounded-lg font-semibold">Login</button>
             )}
             <div className="border-t border-stone-200 dark:border-stone-700 pt-3 flex items-center justify-between px-4">
                 <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Appearance</span>
                 <button onClick={toggleTheme} className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                     {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                 </button>
             </div>
          </div>
      )}
    </header>
  );
}

export default App;