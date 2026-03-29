import React from "react";

const Error = ({ message = "Something went wrong!" }) => {
  return (
    <div className="w-full h-50 mt-20 pt-20 bg-rose-50 border border-rose-500 rounded-xl  text-center text-rose-600 font-medium animate__animated animate__fadeIn">
      {message}
    </div>
  );
};

export default Error;
