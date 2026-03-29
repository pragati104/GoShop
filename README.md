# 🛍️ GoShop - Full Stack E-commerce Application

GoShop is a **full-stack e-commerce web application** built using React and Node.js.
It allows users to shop products, manage carts, place orders, and enables admins to control the system.

---

## 🚀 Features

### 👤 User Features

- Sign up & Login (JWT authentication)
- Browse & search products
- Add to cart & manage cart
- Checkout with payment integration
- View order history
- Update profile & address
- Chat with support (ChatBot)

---

### 🧑‍💼 Admin Features

- Dashboard with analytics (Revenue, Orders, Users, Products)
- Manage products (CRUD)
- Manage users & roles
- Manage orders & update status
- Configure admin settings

---

### 🛒 Cart & Orders

- Add/remove products
- Quantity management
- Discount price calculation
- Order tracking (Pending, Dispatched, Canceled)

---

### 💬 ChatBot

- Real-time chat interface
- Token-based authentication
- Backend API integration

---

## 🛠️ Tech Stack

### Frontend

- React JS
- Ant Design
- Tailwind CSS
- Zustand (state management)
- SWR (data fetching)
- React Router

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- Stripe (payment integration)
- JWT Authentication

---

## 📂 Project Structure

### 🔹 Backend Routes

- `/auth` → User authentication & management
- `/products` → Product CRUD operations
- `/cart` → Cart management
- `/orders` → Order handling
- `/checkout` → Payment & checkout
- `/settings` → Admin settings
- `/chat` → ChatBot API
- `/checkout/webhook` → Stripe webhook

---

## 📌 How it works

1. User registers or logs in
2. Browses products and adds to cart
3. Proceeds to checkout (Stripe payment)
4. Order is created after successful payment
5. Admin manages products, users, and orders
6. Dashboard shows system insights

---

## 🔐 Authentication

- JWT-based authentication
- Role-based access (User / Admin)
- Protected routes

---

## 💳 Payment Integration

- Stripe checkout integration
- Secure payment flow
- Webhook handles payment confirmation

---

## 👨‍💻 Author

- Pragati Kumari

---

## ⭐ Conclusion

GoShop is a **complete full-stack e-commerce platform** with modern technologies, real-world features, and scalable architecture.
