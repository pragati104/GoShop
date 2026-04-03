import React from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "../../lib/fetcher";
import Loader from "../shared/Loader";
import Error from "../shared/Error";
import { Select, Table } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import { priceCalculator } from "../../lib/priceCalculator";
import { toast } from "react-toastify";
import { httpRequest } from "../../lib/http-request";

const Orders = () => {
  const { data, error, isLoading } = useSWR("/orders", fetcher);

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  const updateOrder = async (value, id) => {
    try {
      await httpRequest.put(`/orders/${id}`, { status: value });

      toast.success(`Order status updated to ${value}`);

      mutate("/orders"); // ✅ REFRESH DATA
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const columns = [
    {
      key: "customer",
      title: "Customer",
      responsive: ["md"],
      render: (item) => (
        <div className="min-w-45">
          <h1 className="capitalize text-black font-medium">
            {item.user.fullname}
          </h1>
          <span className="text-gray-500 break-all">{item.user.email}</span>
        </div>
      ),
    },
    {
      key: "items",
      title: "Items",
      render: (item) => (
        <div className="min-w-35">
          <Link to="#">{item.products.length} items</Link>
          <p className="text-gray-500">
            ₹{item.amount.toLocaleString("en-IN")}
          </p>
        </div>
      ),
    },
    {
      key: "address",
      title: "Address",
      responsive: ["lg"],
      render: (item) => {
        const address = item.shippingAddress || item.user; // fallback

        return (
          <div className="min-w-55 text-sm">
            {address?.address}, {address?.city}, {address?.state},{" "}
            {address?.country}, {address?.pincode}
          </div>
        );
      },
    },
    {
      key: "date",
      title: "Date",
      responsive: ["sm"],
      render: (item) => moment(item.createdAt).format("DD MMM YYYY, hh:mm A"),
    },
    {
      key: "status",
      title: "Status",
      render: (item) => (
        <Select
          className="w-full min-w-35"
          value={item.status}
          onChange={(value) => updateOrder(value, item._id)}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="dispatched">Dispatched</Select.Option>
          <Select.Option value="canceled">Canceled</Select.Option>
        </Select>
      ),
    },
  ];

  const viewProducts = (item) => {
    return (
      <div className="flex flex-col gap-4">
        {item.products.map((itemData, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-4"
          >
            <img
              src={itemData.id.image || "/images/product-placeholder.png"}
              className="w-full sm:w-28 h-28 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="capitalize font-semibold text-base sm:text-lg">
                {itemData.id.title}
              </h1>
              <p className="text-gray-500 text-sm line-clamp-2">
                {itemData.id.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="font-medium text-gray-600">
                  ₹ {priceCalculator(itemData.id.price, itemData.id.discount)}
                </span>
                <del className="text-rose-500">
                  ₹ {itemData.id.price.toLocaleString()}
                </del>
                <span>({itemData.id.discount}% off)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto px-2 sm:px-4">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        expandable={{ expandedRowRender: viewProducts }}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default Orders;
