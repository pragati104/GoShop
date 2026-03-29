import React from "react";
import "animate.css";
import "antd/dist/reset.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import DashBoard from "./components/admin/DashBoard";
import AuthGuard from "./components/AuthGuard";
import Layout from "./components/admin/Layout";
import Customers from "./components/admin/Customers";
import Products from "./components/admin/Products";
import Orders from "./components/admin/Orders";
import Settings from "./components/admin/Settings";
import NotFound from "./components/NotFound";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import UserLayout from "./components/user/UserLayout";
import UserCarts from "./components/user/UserCarts";
import UserOrders from "./components/user/UserOrders";
import UserSettings from "./components/user/UserSettings";
import MainLayout from "./components/MainLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<AuthGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Layout />}>
            <Route path="dashboard" element={<DashBoard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="products" element={<Products />} />
            <Route path="settings" element={<Settings />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route path="/user" element={<UserLayout />}>
            <Route path="carts" element={<UserCarts />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="orders" element={<UserOrders />} />
          </Route>
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
