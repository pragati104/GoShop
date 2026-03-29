import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "../lib/fetcher";
import Loader from "../components/shared/Loader";
import Error from "../components/shared/Error";
import { Button, Card, Input, Tag } from "antd";
import { priceCalculator } from "../lib/priceCalculator";
import { Search, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { httpRequest } from "../lib/http-request";
import { useAuth } from "../zustand/useAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR("/products", fetcher);
  const [search, setSearch] = useState("");

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  const addToCart = async (id) => {
    try {
      if (!user || user.role !== "user") {
        navigate("/login");
        return;
      }

      const { data } = await httpRequest.post("/cart", { product: id });

      mutate("/cart");

      toast.success(data.message, { position: "top-center" });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
      <div className="mb-6 flex justify-between items-center">
        <Input
          size="large"
          placeholder="Search your product here.."
          className="w-md!"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data
          .filter((item) =>
            [item.title, item.category, item.description]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .map((item) => (
            <Card
              key={item._id}
              hoverable
              className="w-full"
              cover={
                <img
                  src="/images/product-placeholder.png"
                  alt="product-image"
                  className="h-48 md:h-52 object-cover"
                />
              }
            >
              <Card.Meta
                title={item.title}
                description={
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="font-medium text-gray-600">
                      ₹ {priceCalculator(item.price, item.discount)}
                    </label>

                    <del className="text-rose-500">
                      ₹ {item.price.toLocaleString()}
                    </del>

                    <label className="text-black">({item.discount}% off)</label>
                  </div>
                }
              />

              <Tag className="mt-3">Men's clothing</Tag>

              <div className="mt-4">
                <Button
                  onClick={() => addToCart(item._id)}
                  size="large"
                  type="primary"
                  block
                  icon={<ShoppingCart className="w-4 h-4" />}
                >
                  Add to cart
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Home;
