import { Button, Card, Empty, Popconfirm, Space } from "antd";
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "../../lib/fetcher";
import Loader from "../shared/Loader";
import Error from "../shared/Error";
import { priceCalculator } from "../../lib/priceCalculator";
import { toast } from "react-toastify";
import { httpRequest } from "../../lib/http-request";

const calculateTotalAmount = (item) => {
  let totalAmount = 0;
  item.forEach((data) => {
    const qnt = data.qnt;
    const price = data.product.price;
    const discount = data.product.discount;
    const discountAmount = (price * discount) / 100;
    const realPriceAfterDisconut = price - discountAmount;
    const actualAmount = realPriceAfterDisconut * qnt;
    totalAmount = totalAmount + actualAmount;
  });
  return totalAmount;
};

const UserCarts = () => {
  const { data, error, isLoading } = useSWR("/cart", fetcher);
  const [loading, setLoading] = useState(false);

  let timer;
  const increaseDecreaseCart = (id, qnt) => {
    clearTimeout(timer);

    mutate(
      "/cart",
      (data) => data.map((item) => (item._id === id ? { ...item, qnt } : item)),
      false,
    );

    timer = setTimeout(async () => {
      try {
        await httpRequest.put(`/cart/${id}`, { qnt });
        mutate("/cart");
      } catch (err) {
        mutate("/cart");
      }
    }, 300);
  };

  const deletCart = async (id) => {
    try {
      await httpRequest.delete(`/cart/${id}`);
      mutate("/cart");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const checkoutNow = async (data) => {
    try {
      setLoading(true);
      const products = data.map((item) => ({
        id: item.product._id,
        qnt: item.qnt,
      }));

      const payload = { products };
      const res = await httpRequest.post("/checkout", payload);
      window.location.href = res.data.paymentLink;
      console.log(res.data.paymentLink);
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data.message);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <Card className="shadow-lg">
        <Card.Meta
          title={
            <div className="flex items-center gap-2">
              <ShoppingCart />
              <h1 className="text-base sm:text-lg">Shopping carts</h1>
            </div>
          }
        />

        {data.length > 0 ? (
          <div className="mt-6 flex flex-col gap-4 sm:gap-6">
            {data.map((item, index) => (
              <Card hoverable key={index}>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.image || "/images/product-placeholder.png"}
                      className="w-full sm:w-40 h-40 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h1 className="capitalize font-semibold text-base sm:text-lg">
                        {item.product.title}
                      </h1>

                      <p className="text-gray-500 text-sm sm:text-base">
                        {item.product.description.slice(0, 100)}...
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <label className="font-medium text-gray-600">
                          ₹
                          {priceCalculator(
                            item.product.price,
                            item.product.discount,
                          )}
                        </label>
                        <del className="text-rose-500 text-sm">
                          ₹ {item.product.price.toLocaleString()}
                        </del>
                        <label className="text-black text-sm">
                          ({item.product.discount}% off)
                        </label>
                      </div>

                      <Popconfirm
                        title="Do you want to remove this product?"
                        onConfirm={() => deletCart(item._id)}
                      >
                        <Button
                          icon={<Trash2 className="w-4 h-4" />}
                          danger
                          type="primary"
                          className="mt-3"
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Card title="Quantity" className="w-full sm:w-auto">
                      <Space.Compact className="w-full justify-center">
                        <Button
                          icon={<Minus className="w-4 h-4" />}
                          onClick={() => {
                            if (item.qnt > 1) {
                              increaseDecreaseCart(item._id, item.qnt - 1);
                            }
                          }}
                        />
                        <Button className="min-w-10">{item.qnt}</Button>
                        <Button
                          icon={<Plus className="w-4 h-4" />}
                          onClick={() =>
                            increaseDecreaseCart(item._id, item.qnt + 1)
                          }
                        />
                      </Space.Compact>
                    </Card>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 sm:gap-8 mt-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left">
                Total: ₹{calculateTotalAmount(data)}
              </h1>

              <button
                disabled={loading}
                onClick={() => checkoutNow(data)}
                className="bg-green-500 flex items-center justify-center text-white px-6 sm:px-8 py-2 rounded font-medium hover:scale-105 transition duration-300 w-full sm:w-auto"
              >
                {loading && <Loader2 className="animate-spin mr-1" />}
                Checkout
              </button>
            </div>
          </div>
        ) : (
          <Empty description="Cart is empty" />
        )}
      </Card>
    </div>
  );
};

export default UserCarts;
