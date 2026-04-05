import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "./fetcher";

const ProductDetails = () => {
  const { slug } = useParams();

  const { data, error, isLoading } = useSWR(`/products/${slug}`, fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading product</p>;
  if (!data) return <p>No product found</p>;

  console.log(id);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <img
        src="/images/product-placeholder.png"
        className="w-full h-96 object-cover rounded"
      />

      <h1 className="text-2xl font-bold mt-4">{data.title}</h1>

      <p className="text-gray-600 mt-2">{data.description}</p>

      <h2 className="text-xl mt-4">₹ {data.price}</h2>

      <p className="text-green-600">{data.discount}% OFF</p>
    </div>
  );
};

export default ProductDetails;
