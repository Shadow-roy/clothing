<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 👗 ChicChariot — Women's Fashion E-Commerce Store

A premium women's fashion e-commerce web application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. It features a beautiful storefront for customers and a powerful admin dashboard for complete store management — all running in the browser with `localStorage` persistence.

View your app in AI Studio: https://ai.studio/apps/03311590-a311-4518-8271-cace75442c7a

---

## ✨ Features

### 🛍️ Customer Side
- **Product Storefront** — Browse women's clothing with high-quality images
- **Category Filtering** — Filter by Dresses, Tops, Skirts, Pants, Outerwear, Accessories
- **Product Details** — View description, pricing, stock info, and customer reviews
- **Shopping Cart** — Add/remove items, adjust quantities, real-time total calculation
- **Wishlist** — Save favorite items for later
- **Checkout** — Full checkout with customer details (name, phone, address)
- **Payment Methods** — PhonePe (with screenshot upload) & Cash on Delivery
- **Order History** — Track orders (Pending → Out for Delivery → Delivered)
- **Reviews & Ratings** — 5-star rating system with written reviews
- **User Profile** — Manage personal details and account settings
- **Dark / Light Theme** — Toggle between themes
- **Responsive Design** — Works on desktop, tablet, and mobile

### 🔐 Admin Dashboard
- **Product Management** — Add, edit, delete products (name, price, stock, image, category)
- **Category Management** — Add, rename, and delete categories
- **Order Management** — View orders, update delivery status, view shipping details
- **Admin Management** — Add, edit, and remove admin accounts
- **Analytics Dashboard** — Store metrics and performance overview
- **Notifications** — Real-time alerts when new orders arrive

### 🔑 Authentication
- **Login / Signup** — Username & password authentication
- **Google Login** — Simulated Google sign-in
- **Role-Based Access** — Separate `admin` and `user` roles
- **Session Persistence** — Login state saved in `localStorage`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI components with hooks |
| TypeScript 5.8 | Static typing |
| Vite 6 | Dev server & build tool |
| Tailwind CSS 4 | Utility-first styling |
| localStorage | Client-side data persistence |
| Google Fonts | Playfair Display + Inter typography |

---

## 📁 Project Structure

```
clothing/
├── index.html              # HTML entry with fonts & meta tags
├── index.tsx               # React root render
├── index.css               # Global styles & Tailwind imports
├── App.tsx                 # Main app — routing, header, layout
├── types.ts                # TypeScript interfaces (Product, Order, User, etc.)
├── constants.ts            # Default products, categories, admin account
├── vite.config.ts          # Vite config (port 3000, Tailwind plugin)
├── package.json            # Dependencies & scripts
│
├── contexts/               # State management (React Context + localStorage)
│   ├── AuthContext.tsx      # Login, signup, role management
│   ├── ItemsContext.tsx     # Product & category CRUD
│   ├── CartContext.tsx      # Shopping cart
│   ├── OrderContext.tsx     # Order management
│   ├── WishlistContext.tsx  # Wishlist
│   ├── ReviewsContext.tsx   # Product reviews
│   ├── NotificationContext.tsx  # Admin notifications
│   ├── NavigationContext.tsx    # Page navigation
│   ├── ThemeContext.tsx     # Dark/Light theme
│   └── ToastContext.tsx     # Toast messages
│
├── components/             # UI Components
│   ├── Storefront.tsx      # Product grid page
│   ├── ItemCard.tsx        # Product card component
│   ├── ItemDetail.tsx      # Product detail page
│   ├── CategoryFilter.tsx  # Category filter bar
│   ├── CartModal.tsx       # Cart slide-over panel
│   ├── WishlistModal.tsx   # Wishlist panel
│   ├── CheckoutPage.tsx    # Checkout form
│   ├── OrderConfirmationPage.tsx  # Order success page
│   ├── CustomerOrderHistoryModal.tsx  # Order history
│   ├── Login.tsx           # Login & signup page
│   ├── ProfilePage.tsx     # User profile page
│   ├── AdminDashboard.tsx  # Admin panel (products, orders, categories, admins)
│   ├── AnalyticsDashboard.tsx  # Store analytics
│   ├── ItemFormModal.tsx   # Add/edit product modal
│   ├── ConfirmationModal.tsx   # Confirmation dialog
│   ├── ShippingDetailsModal.tsx  # Shipping info modal
│   ├── ChangePasswordModal.tsx  # Password change modal
│   ├── NotificationPanel.tsx    # Notification dropdown
│   ├── ImageUpload.tsx     # Payment proof upload
│   ├── StarRating.tsx      # Star rating component
│   ├── ToastContainer.tsx  # Toast notifications
│   └── icons/              # 48 SVG icon components
```

---

## 🚀 Run Locally

**Prerequisites:** Node.js (v18+)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set the `GEMINI_API_KEY`** in [.env.local](.env.local) to your Gemini API key

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## 👤 Default Admin Login

| Username | Password |
|---|---|
| `sanjay` | `123` |

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type check |

---

## 🔄 How Data Persistence Works

All data (products, orders, cart, wishlist, reviews, users, notifications) is stored in the browser's `localStorage`:

- ✅ Data persists across page refreshes
- ✅ No backend server required
- ✅ Works offline after first load
- ⚠️ Clearing browser data resets the store to defaults

---

<div align="center">
<b>Made with ❤️ using React + TypeScript</b>
</div>
