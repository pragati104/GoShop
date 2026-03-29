import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Tag,
  Tooltip,
} from "antd";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { httpRequest } from "../../lib/http-request";
import { priceCalculator } from "../../lib/priceCalculator";
import { Categories } from "./constant";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [productForm] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const handleClose = () => {
    setEditId(null);
    productForm.resetFields();
    setOpen(false);
  };

  const createProduct = async (values) => {
    try {
      await httpRequest.post("/products", values);
      setUpdateCount(updateCount + 1);
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await httpRequest.get("/products");
      setProducts(data);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await httpRequest.delete(`/products/${id}`);
      setUpdateCount(updateCount + 1);
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const editProduct = (item) => {
    setEditId(item._id);
    productForm.setFieldsValue(item);
    setOpen(true);
  };

  const saveProduct = async (values) => {
    try {
      await httpRequest.put(`/products/${editId}`, values);
      handleClose();
      setUpdateCount(updateCount + 1);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [updateCount]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
        <Input
          size="large"
          placeholder="Search your product here.."
          className="w-full sm:max-w-md"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={() => setOpen(true)}
          size="large"
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products
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
              className="h-full flex flex-col justify-between"
              cover={
                <img
                  src="/images/product-placeholder.png"
                  alt="product-image"
                  className="h-48 sm:h-52 object-cover"
                />
              }
            >
              <Card.Meta
                title={item.title}
                description={
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-600">
                      ₹ {priceCalculator(item.price, item.discount)}
                    </span>
                    <del className="text-rose-500">
                      ₹ {item.price.toLocaleString()}
                    </del>
                    <span>({item.discount}% off)</span>
                  </div>
                }
              />

              <Tag className="mt-3">Men's clothing</Tag>

              <div className="flex gap-3 mt-4">
                <Tooltip title="Edit product">
                  <Button
                    icon={<Edit2 className="w-4 h-4" />}
                    type="primary"
                    className="bg-indigo-500"
                    onClick={() => editProduct(item)}
                  />
                </Tooltip>

                <Tooltip title="Delete product">
                  <Popconfirm
                    title="Are you sure you want to delete this product!"
                    onConfirm={() => deleteProduct(item._id)}
                  >
                    <Button
                      icon={<Trash2 className="w-4 h-4" />}
                      type="primary"
                      danger
                    />
                  </Popconfirm>
                </Tooltip>
              </div>
            </Card>
          ))}
      </div>

      <Modal
        width={600}
        centered
        open={open}
        footer={null}
        title={<h1 className="text-lg">New product</h1>}
        onCancel={handleClose}
      >
        <Form
          form={productForm}
          onFinish={editId ? saveProduct : createProduct}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            label={
              <span className="text-base text-gray-500">Product name</span>
            }
            rules={[{ required: true, message: "Name is required" }]}
            name="title"
          >
            <Input placeholder="Product name" size="large" />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="text-base text-gray-500">Price</span>}
              rules={[{ required: true, message: "Price is required" }]}
              name="price"
            >
              <Input placeholder="Price" size="large" />
            </Form.Item>

            <Form.Item
              label={<span className="text-base text-gray-500">Discount</span>}
              name="discount"
            >
              <Input placeholder="min. 40% off" size="large" />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="text-base text-gray-500">Category</span>}
            rules={[{ required: true, message: "Category is required" }]}
            name="category"
          >
            <Select size="large" placeholder="Choose category" showSearch>
              {Categories.map((item, index) => (
                <Select.Option key={index} value={item}>
                  {item}
                </Select.Option>
              ))}
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-base text-gray-500">Description</span>}
            rules={[{ required: true, message: "Field is required" }]}
            name="description"
          >
            <Input.TextArea
              placeholder="description goes here.."
              size="large"
              rows={4}
            />
          </Form.Item>

          <Form.Item>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                htmlType="submit"
                size="large"
                type="primary"
                danger={!!editId}
                className="w-full sm:w-auto"
              >
                {editId ? "Save" : "Submit"}
              </Button>

              <Button
                onClick={handleClose}
                size="large"
                className="w-full sm:w-auto bg-gray-100 text-black hover:bg-gray-200"
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
