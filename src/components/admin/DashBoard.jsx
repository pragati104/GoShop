import React, { useEffect, useState } from "react";
import { Card, Table } from "antd";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { httpRequest } from "../../lib/http-request";
import moment from "moment";

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });

  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        httpRequest.get("/orders"),
        httpRequest.get("/auth/users"),
        httpRequest.get("/products"),
      ]);

      const ordersData = ordersRes.data;
      const usersData = usersRes.data;
      const productsData = productsRes.data;

      const revenue = ordersData.reduce((acc, item) => acc + item.amount, 0);

      setStats({
        revenue,
        orders: ordersData.length,
        customers: usersData.length,
        products: productsData.length,
      });

      setOrders(ordersData.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Customer",
      render: (item) => (
        <div>
          <h1 className="font-medium capitalize">{item.user.fullname}</h1>
          <p className="text-gray-500 text-sm">{item.user.email}</p>
        </div>
      ),
    },
    {
      title: "Items",
      render: (item) => `${item.products.length} items`,
    },
    {
      title: "Amount",
      render: (item) => `₹ ${item.amount.toLocaleString("en-IN")}`,
    },
    {
      title: "Date",
      render: (item) => moment(item.createdAt).format("DD MMM YYYY hh:mm A"),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Revenue</p>
              <h1 className="text-xl font-bold">
                ₹ {stats.revenue.toLocaleString("en-IN")}
              </h1>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Orders</p>
              <h1 className="text-xl font-bold">{stats.orders}</h1>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Customers</p>
              <h1 className="text-xl font-bold">{stats.customers}</h1>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500">Products</p>
              <h1 className="text-xl font-bold">{stats.products}</h1>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Orders">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
