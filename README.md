# Golden Zone — Premium 1 Gram Gold-Plated Jewellery E-Commerce Platform

A production-structured, lightweight, and modern jewellery e-commerce platform designed exclusively for **1 Gram Gold-Plated Jewellery / Imitation Jewellery**.

> **IMPORTANT BRAND POSITIONING:**  
> This platform strictly represents **1 Gram Gold-Plated Jewellery**. It does not make misleading claims such as solid gold, 22K/24K solid gold, BIS-certified gold, real gold investments, or guaranteed gold values.

---

## 🏛 Production Architecture Overview

```text
Production domain (e.g., https://goldenzone.in)
      │
      ▼
Node / Express Server
      │
      ├── /api/*  → Backend REST APIs (auth, products, orders, payments, webhooks)
      │
      └── /*      → client/dist (React SPA production build)

Admin domain (e.g., https://admin.goldenzone.in or separate port)
      │
      ▼
Separate Admin React application
      │
      └── calls Backend API (/api/*) with CORS authorization
```

### Directory Structure
```
/
├── client/          # Customer storefront (React 18 + Vite + React Router + Context API + Lucide)
├── admin/           # Administrative control dashboard (React 18 + Vite + Lucide)
├── server/          # REST API & static server (Node.js + Express + MySQL2 + JWT + bcrypt + rate limiting)
├── database/
│   ├── schema.sql   # Relational InnoDB MySQL database schema
│   └── seed.sql     # Initial data: Categories, 26 products, admin, settings
├── README.md        # Comprehensive setup and usage documentation
├── package.json     # Root scripts (start, build, client, admin, server)
└── .gitignore
```

---

## 1. Prerequisites & Node Version

- **Node.js**: v18.0.0 or later (Tested on Node v22.14.0)
- **npm**: v9.0.0 or later
- **MySQL Server**: 8.0 or later (InnoDB support)

---

## 2. MySQL Setup & Database Creation

1. Open your terminal or MySQL command-line client:
   ```bash
   mysql -u root -p
   ```
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS kalyani_jewellers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

---

## 3. Running Schema & Seed Data

You can automatically initialize both schema and seed data using the server's automated DB script:

```bash
cd server
npm run db:init
```

Alternatively, you can execute them directly via the MySQL CLI:

```bash
mysql -u root -p kalyani_jewellers < database/schema.sql
mysql -u root -p kalyani_jewellers < database/seed.sql
```

The seed script creates:
- **Admin account** (`7976580806`, password `Subhash29` stored as bcrypt hash)
- **6 Categories**: Ring, Chain, Bali, Kada, Bracelet, Other
- **26 Demo Products** with realistic titles, descriptions, pricing, and discount calculations
- **61 Product Gallery Images** pointing to external CDN URLs
- **Customer Reviews**
- **Complete Centralized Site Settings** (Hero image, announcement strip, WhatsApp support, Instagram handle, etc.)

---

## 4. Environment Variables

### Server Configuration (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```bash
cd server
cp .env.example .env
```

Set the following variables:

```ini
# Express Server Port
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YourMySQLPassword
DB_NAME=kalyani_jewellers

# JWT Authentication
JWT_SECRET=kalyani_jewellers_secure_jwt_secret_2026_super_key
JWT_EXPIRES_IN=7d

# Renflair SMS API Configuration
RENFLAIR_API_KEY=your_renflair_sms_api_key
RENFLAIR_SENDER_ID=GNZONE

# Razorpay Production API
RAZORPAY_KEY_ID=your_live_razorpay_key_id
RAZORPAY_KEY_SECRET=your_live_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Initial Admin Credentials
ADMIN_MOBILE=7976580806
ADMIN_INITIAL_PASSWORD=Subhash29

# Frontend URLs for CORS
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Google Maps Directions Base URL
GOOGLE_MAPS_BASE_URL=https://www.google.com/maps

# =================================================================
# RAZORPAY PAYMENT GATEWAY (ONLINE PAYMENTS ONLY - NO COD)
# =================================================================
# Get keys from Razorpay Dashboard: https://dashboard.razorpay.com/app/keys
# In Test Mode: Starts with rzp_test_
# In Live Mode: Starts with rzp_live_
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourRazorpayKeySecretHere

# Razorpay Webhook Secret:
# Configure Webhook URL in Razorpay Dashboard -> Settings -> Webhooks:
# URL: http://<your-domain>/api/payments/webhook
# Active Events: payment.captured, order.paid, payment.failed
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere
```

---

## 4.1 Razorpay Online Payment Integration

Golden Zone strictly operates on **Prepaid Online Payments via Razorpay**. Cash on Delivery (COD) is completely removed throughout the platform.

### Security & Architecture Principles:
1. **Server-Side Order Creation**: Order records and corresponding Razorpay Orders (`rzp.orders.create`) are strictly generated on the backend.
2. **Tamper-Proof Price Calculation**: The server recalculates item prices and totals exclusively from current database records (`discounted_price`). Any price passed from the frontend is discarded.
3. **Stock Verification**: Stock status (`is_out_of_stock`, active status) is verified within a MySQL database transaction prior to order initiation.
4. **Cryptographic HMAC-SHA256 Verification**: Payments are verified using official Razorpay HMAC-SHA256 signature verification with `crypto.timingSafeEqual`:
   $$\text{signature} = \text{HMAC-SHA256}(\text{razorpay\_order\_id} + "|" + \text{razorpay\_payment\_id}, \text{secret})$$
5. **Idempotent Webhooks & Order Confirmation**: Both frontend callback `/api/payments/verify` and backend webhook `/api/payments/webhook` are idempotent, locking order rows (`FOR UPDATE`) to prevent duplicate confirmations or double order fulfillment.
6. **Graceful Failure & 1-Click Retry**: If a payment is cancelled or fails at the gateway, the order status transitions to `FAILED` with the gateway error reason recorded in DB, while the customer's cart and entered address remain preserved for instant retry.
7. **Development Mode Fallback**: If Razorpay credentials are left empty during initial local setup, the backend automatically issues simulated orders (`order_sim_...`) in `NODE_ENV=development` allowing seamless offline UI testing.

---

## 4.2 Smooth Premium Animations

The platform features tailored, hardware-accelerated CSS animations:
- **Drawers & Sidebars**: Smooth slide-in (`transform: translateX(0)`) with backdrop blur (`backdrop-filter: blur(4px)`) for Cart Drawer and Mobile Navigation.
- **Product Gallery**: Horizontal slide track (`translateX(-N00%)`) with active thumbnail zoom ring and animated lightbox popup modal.
- **Micro-interactions**: Product card elevation on hover (`translateY(-4px)` with warm gold shadow), image scale (`scale(1.04)`), and button tap spring feedback (`scale(0.97)`).
- **Modals & Dropdowns**: Smooth scale pop-in (`modalPopIn`) and search result slide-down.

---

## 4.3 Real Payment & Order Tracking

- All fake seeded orders and payments have been completely purged from the system.
- The **Admin Payments Dashboard** tracks exclusively real Razorpay transactions with:
  - Razorpay Payment ID (`pay_...`)
  - Razorpay Order ID (`order_...`)
  - Associated Order Number (`GZ-...`)
  - Customer Name & Mobile Number
  - Payment Method (UPI, Cards, NetBanking, Wallet)
  - Real-time Status (`PAID`, `PENDING`, `FAILED`)
  - Full Order Details Modal with ordered items and delivery address

---

## 4.4 Dedicated Contact Page (`/contact`)

A dedicated contact experience matching the Golden Zone maroon/gold aesthetic:
- **Phone**: Direct call button (`tel:+91...`)
- **WhatsApp Chat**: Direct prefilled chat link (`https://wa.me/...`)
- **WhatsApp VIP Group**: Direct join invitation link
- **Instagram**: Official handle link
- **Email**: Support email link
- **Customer Enquiry Form**: Direct submission to `POST /api/settings/contact` with rate-limiting and persistent storage in `enquiries` table.
- All contact information is dynamically configurable from **Admin ➔ Site Settings**.
```

---

## 5. Development Commands

### Running All Components

You can run individual services from their respective directories:

#### 1. Backend Server (Port 5000)
```bash
cd server
npm install
npm run dev
```

#### 2. Customer Storefront (Port 5173)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### 3. Admin Dashboard (Port 5174)
```bash
cd admin
npm install
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

---

## 6. Production Build

To build the client and admin applications for production:

```bash
# Build storefront
cd client
npm run build

# Build admin dashboard
cd admin
npm run build
```

The production assets are generated in `client/dist` and `admin/dist`.

---

## 7. Production Admin & Customer Authentication
 
### Admin Portal Credentials
- **URL**: [http://localhost:5174](http://localhost:5174)
- **Mobile Number**: `7976580806`
- **Password**: `Subhash29` (stored as bcrypt hash in database)
- **Production OTP**: Secure 6-digit dynamic OTP delivered via Renflair SMS API directly to the admin mobile number.
 
### Customer Storefront OTP Authentication
- Any valid 10-digit Indian mobile number can be entered.
- **Production OTP Verification**: Cryptographic 6-digit dynamic OTP sent via Renflair SMS Gateway with 5-minute validity and attempt rate-limiting.

---

## 8. REST API Structure

| Module | Method | Endpoint | Description | Auth Required |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/customer/send-otp` | Send customer OTP | Public |
| | `POST` | `/api/auth/customer/verify-otp` | Verify OTP & Login | Public |
| | `GET` | `/api/auth/customer/profile` | Get customer profile | Customer |
| | `PUT` | `/api/auth/customer/profile` | Update profile | Customer |
| | `POST` | `/api/auth/admin/login` | Admin credentials + OTP login | Public |
| | `GET` | `/api/auth/admin/profile` | Get admin details | Admin |
| | `PUT` | `/api/auth/admin/change-password` | Change admin password | Admin |
| **Products** | `GET` | `/api/products` | Get products (with filters & search) | Public |
| | `GET` | `/api/products/:id` | Get single product detail + images | Public |
| | `POST` | `/api/products/admin` | Create product with up to 10 image URLs | Admin |
| | `PUT` | `/api/products/admin/:id` | Edit product metadata (Images locked) | Admin |
| | `DELETE`| `/api/products/admin/:id` | Soft delete product | Admin |
| | `PATCH`| `/api/products/admin/:id/stock` | Toggle Out of Stock status | Admin |
| | `PATCH`| `/api/products/admin/:id/recommended` | Toggle Recommended badge | Admin |
| | `PATCH`| `/api/products/admin/:id/bestseller` | Toggle Bestseller badge | Admin |
| **Categories** | `GET` | `/api/categories` | List active categories | Public |
| | `POST` | `/api/categories/admin` | Create new category | Admin |
| | `PUT` | `/api/categories/admin/:id` | Rename category | Admin |
| | `DELETE`| `/api/categories/admin/:id` | Safe delete category (checks products) | Admin |
| **Orders** | `POST` | `/api/orders` | Place order (MySQL Transaction & server pricing) | Customer |
| | `GET` | `/api/orders/customer/saved-address` | Fetch previous delivery details | Customer |
| | `GET` | `/api/orders/customer/my-orders` | Customer order history | Customer |
| | `GET` | `/api/orders/track/:orderNumber` | Flipkart-style order tracking | Public / Customer |
| | `GET` | `/api/orders/admin/all` | Admin order list with status filters | Admin |
| | `PATCH`| `/api/orders/admin/:id/status` | Mark Shipped / Delivered (with strict rules) | Admin |
| | `PATCH`| `/api/orders/admin/:id/remark` | Save admin remark | Admin |
| | `DELETE`| `/api/orders/admin/:id` | Soft delete order | Admin |
| **Dashboard**| `GET` | `/api/dashboard/stats` | DB-queried analytics & revenue metrics | Admin |
| **Settings** | `GET` | `/api/settings` | Public website settings | Public |
| | `PUT` | `/api/settings/admin` | Update settings (Hero, Contact, Social) | Admin |

---

## 9. Key Business Rules & Implementation Highlights

### 1. Order Lifecycle & Status Rules
- **States**: `ORDERED` ➔ `SHIPPED` ➔ `DELIVERED` (plus soft-deleted `DELETED`).
- **Checkbox Rule**: In the admin panel, the `Delivered` checkbox is **strictly disabled** until `Shipped` has been checked.
- **Server Enforcement**: The server rejects any attempt to mark an order as `is_delivered: true` while `is_shipped: false` with HTTP 400.
- **Flipkart-Style Tracking**: Customer tracking page visually presents the 3 stages with completion markers, timestamps, and address snapshot.

### 2. Saved Customer Address Behavior
- On checkout, the customer's previous delivery address is retrieved in the background without blocking the UI.
- A polite popup appears: *"We found your previous delivery details. Use them?"*
- Clicking **"USE SAVED DETAILS"** fills the address form.
- **GPS coordinates are deliberately NOT pre-filled**: The customer must click *"Get Current Location"* afresh for new location accuracy.

### 3. Geolocation & Google Maps Integration
- Clicking *"Get Current Location"* uses the browser's HTML5 Geolocation API with user permission.
- The order stores `latitude`, `longitude`, and generates a direct Google Maps URL:
  `https://www.google.com/maps?q=LATITUDE,LONGITUDE`
- Admin can click **"VIEW LOCATION"** to open the map, or **"DIRECTIONS"** to open turn-by-turn navigation directly in Google Maps.

### 4. Product Image System & Intentional Editing Constraint
- Multiple external image URLs (up to 10) are supported per product and stored in the `product_images` table.
- **Admin Image Modification Rule**: As strictly specified, when a product is created, all image URLs are entered with live previews. After creation, individual image editing/reordering is locked to ensure database safety. The admin panel displays: *"To change product images, delete/recreate the product."*

### 5. Automatic Discount Calculation
- The percentage discount is calculated automatically on both server and client:
  $$\text{discount\_percentage} = \frac{\text{price} - \text{discounted\_price}}{\text{price}} \times 100$$
- Server validates that `discounted_price <= price`.

### 6. Centralized Site Settings (Hero & Contact Management)
- Admin can update all brand copy, hero banner, announcement strip, WhatsApp contact details, and Instagram handles in **Admin ➔ Site Settings**.
- Changes take effect across the customer storefront immediately without code edits.

---

## 10. Audit Logging & Security

- **Password Hashing**: `bcryptjs` with salt rounds = 10.
- **SQL Injection Prevention**: Parameterized queries / prepared statements used on all queries.
- **Server-Side Price Integrity**: Order totals are calculated exclusively from database prices on the server; client-submitted totals are never trusted.
- **Audit Logging**: Sensitive admin actions (product creation, order status changes, remark updates, setting changes) are recorded in `admin_audit_logs`.
