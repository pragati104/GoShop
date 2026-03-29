import {
  BadgeIndianRupee,
  Home,
  LogIn,
  Settings2,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../zustand/useAuth";
import { Avatar, Badge, Dropdown, Popconfirm } from "antd";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

const menus = [
  {
    label: "Home",
    link: "/",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "Checkout",
    link: "/user/checkout",
    icon: <BadgeIndianRupee className="w-5 h-5" />,
  },
];

const MainLayout = () => {
  const { logOut, user } = useAuth();
  const { data } = useSWR("/cart", fetcher, {
    revalidateOnFocus: false,
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const accountMenu = [
    {
      label: <Link to="/user/settings">Settings</Link>,
      key: "settings",
      icon: <Settings2 className="w-4 h-4" />,
    },
    {
      label: (
        <Popconfirm
          title="Do you want to logout from account?"
          onConfirm={logOut}
        >
          Logout
        </Popconfirm>
      ),
      key: "logout",
    },
  ];

  return (
    <div>
      {/* NAVBAR */}
      <nav className="bg-white shadow-lg px-4 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src="/images/logo.png" className="w-28" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          {menus.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="flex items-center gap-1 text-gray-700 py-6 hover:bg-sky-400 hover:text-white px-6"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <Link
            to="/user/carts"
            className="flex items-center gap-1 text-gray-700 py-6 hover:bg-sky-400 hover:text-white px-6"
          >
            <Badge count={data?.length}>
              <ShoppingBag className="w-5 h-5" />
            </Badge>
            Carts
          </Link>

          <div className="ml-6">
            {user ? (
              <Dropdown menu={{ items: accountMenu }}>
                <Avatar
                  src="https://randomuser.me/api/portraits/women/71.jpg"
                  size="large"
                />
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className="bg-linear-to-r from-amber-500 to-rose-500 text-white font-medium px-6 py-2 rounded flex items-center"
              >
                <LogIn className="w-4 h-4 mr-2" /> Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col">
          {menus.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="flex items-center gap-2 px-6 py-4 border-b"
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <Link
            to="/user/carts"
            className="flex items-center gap-2 px-6 py-4 border-b"
            onClick={() => setMobileOpen(false)}
          >
            <Badge count={data?.length}>
              <ShoppingBag className="w-5 h-5" />
            </Badge>
            Carts
          </Link>

          {user ? (
            <button
              onClick={logOut}
              className="text-left px-6 py-4 text-red-500"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-6 py-4"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* Page Content */}
      <section className="min-h-[80vh]">
        <Outlet />
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 mt-10">
        © {new Date().getFullYear()} GoShoap
      </footer>
    </div>
  );
};

export default MainLayout;
