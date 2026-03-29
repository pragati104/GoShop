import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAuth } from "../zustand/useAuth";

const schema = Yup.object({
  fullname: Yup.string().required("fullname is required"),
  email: Yup.string()
    .required("Email field is required")
    .email("Please enter a valid email.")
    .test("is-gmail", "only gmail id allowed", (value) => {
      return value && value.toLowerCase().endsWith("gmail.com");
    }),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&#]/, "Must contain at least one special character"),
});

const SignUp = () => {
  const { signUp } = useAuth();

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: signUp,
  });

  return (
    <div className="overflow-hidden bg-[#F7F8F4] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl shadow-lg rounded-lg grid md:grid-cols-2 animate__animated animate__slideInUp">
        <img
          src="/images/admin.png"
          className="hidden md:block rounded-l-lg h-full object-cover"
        />

        <div className="flex flex-col justify-center p-6 md:p-10 gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Create an account
          </h1>

          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-700 font-medium">Full name</label>
              <input
                name="fullname"
                type="text"
                className="border border-gray-200 rounded p-2"
                placeholder="John doe"
                onChange={formik.handleChange}
              />
              {formik.touched.fullname && formik.errors.fullname && (
                <small className="text-rose-500 font-semibold">
                  {formik.errors.fullname}
                </small>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-zinc-700 font-medium">Email</label>
              <input
                name="email"
                type="email"
                className="border border-gray-200 rounded p-2"
                placeholder="Example@mail.com"
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email && (
                <small className="text-rose-500 font-semibold">
                  {formik.errors.email}
                </small>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-zinc-700 font-medium">Password</label>
              <input
                name="password"
                type="password"
                className="border border-gray-200 rounded p-2"
                placeholder="********"
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password && (
                <small className="text-rose-500 font-semibold">
                  {formik.errors.password}
                </small>
              )}
            </div>

            <button
              type="submit"
              className="p-2.5 rounded bg-[#27BE8C] text-white font-medium hover:bg-[#27be8cc2] active:scale-90 duration-300"
            >
              Sign Up
            </button>
          </form>

          <div className="flex flex-col gap-2">
            <Link to="#" className="text-[#27BE8C] font-medium hover:underline">
              Forgot Password ?
            </Link>

            <Link
              to="/login"
              className="text-[#27BE8C] font-medium hover:underline"
            >
              Sign in now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
