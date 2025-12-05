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
          <div className="min-h-screen font-sans transition-colors duration-200 relative bg-stone-50 dark:bg-black text-stone-900 dark:text-stone-100">
              {/* Abstract Gradient Background matching the image */}
              <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                  {/* Top Left - Cyan/Teal */}
                  <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vh] bg-teal-500/20 dark:bg-teal-500/15 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
                  
                  {/* Top Right - Red/Rose */}
                  <div className="absolute -top-[10%] -right-[10%] w-[60vw] h-[60vh] bg-rose-600/20 dark:bg-rose-600/15 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>

                  {/* Bottom Left - Orange */}
                  <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vh] bg-orange-500/20 dark:bg-orange-600/15 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>

                  {/* Bottom Right - Blue */}
                  <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vh] bg-blue-600/20 dark:bg-blue-700/15 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
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
  const iconButtonClass = "relative text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-stone-100/50 dark:hover:bg-white/10";

  const handleMobileNav = (action: () => void) => {
      action();
      setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-white/20 dark:border-stone-800 shadow-sm sticky top-0 z-40 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Logo */}
          <div className="flex items-center flex-shrink-0">
            <h1 onClick={() => navigate('store')} className="text-stone-800 dark:text-white text-2xl font-bold cursor-pointer font-serif tracking-tight">ChicChariot</h1>
          </div>
          
          {/* RIGHT SIDE: Navigation + Icons */}
          <div className="flex items-center gap-2 md:gap-6">
              {/* Desktop Navigation Links */}
             <nav className="hidden md:flex items-center gap-6">
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
             </nav>
             
             {/* Divider (Desktop Only) */}
             <div className="hidden md:block h-6 w-px bg-stone-300 dark:bg-stone-700"></div>

             {/* Icons (Visible on all screens) */}
             <div className="flex items-center gap-2">
                <button onClick={openWishlist} className={iconButtonClass} aria-label="Wishlist">
                    <HeartOutlineIcon className="h-6 w-6" />
                    {wishlistItemCount > 0 && (
                        <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 bg-rose-500 text-white text-[10px] rounded-full ring-2 ring-white dark:ring-stone-900">{wishlistItemCount}</span>
                    )}
                </button>
                <button onClick={openCart} className={iconButtonClass} aria-label="Cart">
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartItemCount > 0 && (
                        <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 bg-rose-500 text-white text-[10px] rounded-full ring-2 ring-white dark:ring-stone-900">{cartItemCount}</span>
                    )}
                </button>
                 <button onClick={toggleTheme} className={iconButtonClass} aria-label="Toggle theme">
                  {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                </button>
             </div>
            
            {/* Hamburger for Mobile */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-stone-600 dark:text-stone-300 ml-1">
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
          </div>
      )}
    </header>
  );
}

export default App;