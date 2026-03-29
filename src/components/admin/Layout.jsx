import { Avatar, Badge, Dropdown, Popconfirm } from "antd";
import {
  AlignRight,
  Axis3D,
  Bell,
  Key,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { href, Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../zustand/useAuth";

const Layout = () => {
  const [space, setSpace] = useState(270);
  const { logOut } = useAuth();
  const location = useLocation();
  const accountMenu = [
    {
      label: <Link to="/admin/dashboard">Dashboard</Link>,
      Key: "dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: <Link to="/admin/settings">Settings</Link>,
      Key: "settings",
      icon: <Settings2 className="w-4 h-4" />,
    },
    {
      label: (
        <Popconfirm
          title="Do you want to logout from account?"
          onConfirm={logOut}
        >
          LogOut
        </Popconfirm>
      ),
      Key: "logout",
      icon: <LogOut className="w-4 h-4" />,
    },
  ];

  const menus = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <Axis3D className="w-4 h-4 " />,
    },
    {
      label: "Customers",
      href: "/admin/customers",
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: <ListOrdered className="w-4 h-4" />,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-[#F8F7F4] min-h-screen">
      <aside
        style={{ width: `${space}px` }}
        className=" overflow-hidden fixed border-r border-r-gray-200 top-0 left-0 bg-white h-full transition-all duration-300 flex flex-col justify-between"
      >
        <div className="flex items-center px-6 gap-2 py-6">
          <button className="bg-amber-500  w-10 h-10 text-white! rounded-full flex items-center justify-center  ">
            <ShoppingCart className="w-5 h-5" />
          </button>

          <h1 className="text-xl font-bold pt-3">Ecommerce</h1>
        </div>
        <div className="flex flex-col w-full p-6 flex-1 gap-1">
          {menus.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`flex items-center gap-3 w-full py-2 px-3 rounded-lg text-gray-400 font-medium
             hover:text-gray-800 hover:bg-gray-100 transition ${item.href === location.pathname ? "bg-gray-200 " : "bg-white"}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-center py-5.5 px-6">
          <Popconfirm
            title="Do you want to logout from account?"
            onConfirm={logOut}
          >
            <button className="bg-rose-500 w-full text-white! font-medium hover:scale-105 duration-300 active:scale-80 rounded-lg flex items-center justify-center gap-2 p-1.5">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </Popconfirm>
        </div>
      </aside>
      <section
        style={{ marginLeft: `${space}px` }}
        className="transition-all duration-300"
      >
        <nav className="bg-white border-b border-b-gray-200 sticky top-0 left-0 px-12 py-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSpace(space === 0 ? 270 : 0)}
              className="hover:bg-gray-300 duration-200 p-2 rounded bg-gray-100 active:scale-80"
            >
              <AlignRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Badge count={10}>
              <Bell className="w-5 h-5 text-gray-500" />
            </Badge>

            <Dropdown menu={{ items: accountMenu }}>
              <Avatar
                src="https://randomuser.me/api/portraits/women/71.jpg"
                size="large"
              />
            </Dropdown>
          </div>
        </nav>
        <div className="px-12 py-8 space-y-8">
          <div className="flex gap-4">
            <button className="w-10 h-10 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white! rounded-full flex items-center justify-center">
              {menus.find((menu) => menu.href === location.pathname).icon}
            </button>
            <h1 className="text-3xl font-bold capitalize ">
              {location.pathname.split("/").pop()}
            </h1>
          </div>

          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default Layout;
