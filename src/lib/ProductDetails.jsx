import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "./fetcher";

const ProductDetails = () => {
  const { slug } = useParams();

  const { data, error, isLoading } = useSWR(`/products/${slug}`, fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading product</p>;
  if (!data) return <p>No product found</p>;

  console.log(slug);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8 m-4">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src="/images/product-placeholder.png"
            alt="product"
            className="w-full h-64 sm:h-80 md:h-[400px] object-cover rounded-xl"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
              {data.title}
            </h1>

            <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed">
              {data.description}
            </p>

            {/* Pricing */}
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <span className="text-lg sm:text-xl font-bold text-black">
                ₹ {data.price}
              </span>

              <span className="text-green-600 font-medium">
                {data.discount}% OFF
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
              Add to Cart
            </button>

            <button className="w-full sm:w-auto border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
