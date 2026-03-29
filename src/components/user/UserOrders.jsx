import { Card, Tag } from "antd";
import React from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import Loader from "../../components/shared/Loader";
import Error from "../../components/shared/Error";
import { priceCalculator } from "../../lib/priceCalculator";
import moment from "moment/moment";

const UserOrders = () => {
  const { data, error, isLoading } = useSWR("/orders", fetcher);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">Your orders</h1>
      {data.map((item, index) => (
        <Card
          key={index}
          title={`Order Id - ${item._id}`}
          hoverable
          extra={moment(item.createdAt).format("DD MM, YYYY hh:mmA")}
        >
          {item.products.map((itemData, itemDataIndex) => (
            <div
              key={itemDataIndex}
              className="flex items-start justify-between mb-6 border-b border-b-gray-100 pb-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.image || "/images/product-placeholder.png"}
                  className="w-34 rounded-lg"
                />
                <div>
                  <h1 className="capitalize font-semibold text-lg">
                    {itemData.id.title}
                  </h1>
                  <p className="text-gray-500">
                    {itemData.id.description.slice(0, 100)}...
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="font-medium text-gray-600">
                      ₹{" "}
                      {priceCalculator(itemData.id.price, itemData.id.discount)}
                    </label>
                    <del className="text-rose-500">
                      ₹ {itemData.id.price.toLocaleString()}
                    </del>
                    <label className="text-black">
                      ({itemData.id.discount}% off)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            {item.status === "pending" && (
              <Tag className="capitalize!" color="blue">
                {item.status}
              </Tag>
            )}
            {item.status === "canceled" && (
              <Tag className="capitalize!" color="magenta">
                {item.status}
              </Tag>
            )}
            {item.status === "dispatched" && (
              <Tag className="capitalize!" color="green">
                {item.status}
              </Tag>
            )}

            <h1 className="text-2xl font-bold">
              ₹{item?.amount?.toLocaleString()}
            </h1>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserOrders;
