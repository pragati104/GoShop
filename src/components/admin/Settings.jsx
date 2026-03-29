import React, { useState } from "react";
import { Card, Form, Input, Button, Divider } from "antd";
import { toast } from "react-toastify";
import { httpRequest } from "../../lib/http-request";

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = async (values) => {
    try {
      setLoading(true);
      await httpRequest.put("/admin/settings", values);
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <Card title="Admin Settings">
        <Form layout="vertical" onFinish={handleSave}>
          <Divider titlePlacement="left">Store Information</Divider>

          <Form.Item
            label="Store Name"
            name="storeName"
            rules={[{ required: true, message: "Store name is required" }]}
          >
            <Input placeholder="GoShoap" />
          </Form.Item>

          <Form.Item label="Client URL" name="clientUrl">
            <Input placeholder="http://localhost:5173" />
          </Form.Item>

          <Divider titlePlacement="left">Email Settings</Divider>

          <Form.Item label="SMTP Email" name="smtpEmail">
            <Input placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item label="SMTP Password" name="smtpPassword">
            <Input.Password placeholder="Enter SMTP password" />
          </Form.Item>

          <Divider titlePlacement="left">Admin Profile</Divider>

          <Form.Item label="Admin Name" name="adminName">
            <Input placeholder="Admin Name" />
          </Form.Item>

          <Form.Item label="Admin Email" name="adminEmail">
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Save Settings
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSettings;
