import React, { useEffect, useState } from "react";
import { useAuth } from "../../zustand/useAuth";
import { Loader2 } from "lucide-react";
import { Select, Table } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import { httpRequest } from "../../lib/http-request";

const Customers = () => {
  const { user, token, isHydrated } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const { data } = await httpRequest.get("/auth/users");

      setCustomers(data);
    } catch (err) {
      console.log(err.response?.data?.message);

      if (err.response?.status === 401) {
        toast.error("Unauthorized - please login again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const changeRole = async (role, id) => {
    try {
      const { data } = await httpRequest.put(`/auth/users/${id}`, { role });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  useEffect(() => {
    // wait for hydration + token
    if (!isHydrated || !token) return;

    fetchUsers();
  }, [isHydrated, token]);

  const columns = [
    {
      key: "sn",
      title: "SN",
      width: 70,
      render: (item1, item2, index) => index + 1,
    },
    {
      key: "name",
      title: "Customer",
      responsive: ["xs"],
      render: (item) => (
        <div className="min-w-40">
          <p className="capitalize font-medium">{item.fullname}</p>
          <p className="text-xs text-gray-500 break-all sm:hidden">
            {item.email}
          </p>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      responsive: ["sm"],
      render: (email) => <span className="break-all">{email}</span>,
    },
    {
      key: "role",
      title: "Role",
      render: (item) => (
        <Select
          value={item.role}
          className="w-full min-w-30"
          onChange={(role) => changeRole(role, item._id)}
        >
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
        </Select>
      ),
    },
    {
      key: "joinedAt",
      title: "Joined",
      responsive: ["md"],
      render: (item) => moment(item.createdAt).format("DD MMM YYYY, hh:mm A"),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center pt-20 sm:pt-32 min-h-[60vh]">
        <Loader2 className="animate-spin w-12 h-12 sm:w-16 sm:h-16 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto px-2 sm:px-4">
      <Table
        columns={columns}
        dataSource={customers}
        rowKey="email"
        scroll={{ x: 600 }}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default Customers;
