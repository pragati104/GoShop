import { Button, Card, Form, Input, InputNumber } from "antd";
import { Edit, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { useForm } from "antd/es/form/Form";
import Loader from "../shared/Loader";
import Error from "../shared/Error";
import { httpRequest } from "../../lib/http-request";

const UserSettings = () => {
  const [isEditable, setEditable] = useState(false);
  const [form] = useForm();
  const { data, error, isLoading } = useSWR("/auth/session", fetcher);

  const handleEditable = () => {
    setEditable(true);
    toast.success("The form in now editable");
  };

  const updateUser = async (values) => {
    try {
      const { data } = await httpRequest.put("/auth/update", values);
      toast.success(data.message, { position: "top-center" });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="animate__animated animate__fadeIn p-2 sm:p-4 md:p-6">
      <Card
        title={
          <h1 className="text-base sm:text-lg font-medium">
            Profile Information
          </h1>
        }
        extra={
          <Edit
            className="w-4 h-4 hover:scale-110 active:scale-90 duration-300 cursor-pointer"
            onClick={handleEditable}
          />
        }
        className="shadow"
      >
        <Form form={form} className="flex flex-col gap-4" onFinish={updateUser}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Form.Item
              name="fullname"
              label={
                <label className="text-sm sm:text-base font-semibold">
                  Full Name
                </label>
              }
              rules={[{ required: true, message: "Fullname is required" }]}
            >
              <Input
                size="large"
                placeholder="Full Name"
                disabled={!isEditable}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <label className="text-sm sm:text-base font-semibold">
                  Email
                </label>
              }
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input size="large" placeholder="Email" disabled />
            </Form.Item>

            <Form.Item
              name="mobile"
              label={
                <label className=" text-sm sm:text-base font-semibold">
                  Mobile no
                </label>
              }
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber
                size="large"
                placeholder="Mobile No."
                disabled={!isEditable}
                className="w-full!"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label={
              <label className="text-sm sm:text-base font-semibold">
                Address
              </label>
            }
            rules={[{ required: true }]}
          >
            <Input
              size="large"
              placeholder="House No., Street, Area"
              disabled={!isEditable}
            />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Form.Item
              name="city"
              label={
                <label className="text-sm sm:text-base font-semibold">
                  City
                </label>
              }
              rules={[{ required: true, message: "City is required" }]}
            >
              <Input placeholder="City" size="large" disabled={!isEditable} />
            </Form.Item>

            <Form.Item
              name="state"
              label={
                <label className="text-sm sm:text-base font-semibold">
                  State
                </label>
              }
              rules={[{ required: true, message: "State is required" }]}
            >
              <Input placeholder="State" size="large" disabled={!isEditable} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Form.Item
              name="pincode"
              label={
                <label className="text-sm sm:text-base font-semibold">
                  Pincode
                </label>
              }
              rules={[{ required: true, message: "Pincode is required" }]}
            >
              <Input
                placeholder="Pincode"
                size="large"
                disabled={!isEditable}
              />
            </Form.Item>

            <Form.Item
              name="country"
              label={
                <label className="text-sm sm:text-base font-semibold">
                  Country
                </label>
              }
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Input
                placeholder="Country"
                size="large"
                disabled={!isEditable}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-end">
            <Form.Item
              name="password"
              label={
                <label className="text-sm sm:text-base font-semibold">
                  Password
                </label>
              }
            >
              <Input.Password placeholder="**********" disabled={!isEditable} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                danger
                size="large"
                icon={<Save className="w-4 h-4" />}
                disabled={!isEditable}
                className="w-full sm:w-auto"
              >
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UserSettings;
