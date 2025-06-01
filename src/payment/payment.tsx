import React from "react";
import { Card, Typography, Input, Button, Form, notification } from "antd";
import { useParams } from "react-router-dom";
// import { message, App as AntdApp } from 'antd';
import { useNavigate } from "react-router-dom"; 

const { Title } = Typography;
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Payment: React.FC = () => {
  //   const { message } = AntdApp.useApp();
const navigate = useNavigate();
  //   const { id } = useParams();/
  const { id } = useParams();

  const onFinish = async (values: any) => {
    const res = await fetch(`${API_BASE}/order/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 500, id: id }), // amount in INR
    });

    const data = await res.json();
    if (data.success) {
    //   alert("Order placed successfully");
      navigate(`/cart`);
    } else {
        alert("Failed to place order");
    }
  };
  // const onFinish = () => {
  //   const handlePayment = async () => {
  //     const res = await fetch("http://localhost:5000/create-order", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ amount: 500 }), // amount in INR
  //     });

  //     const data = await res.json();

  //     const options = {
  //       key: "YOUR_TEST_KEY_ID", // from Razorpay Test mode
  //       amount: data.amount,
  //       currency: "INR",
  //       name: "Demo Shop",
  //       description: "Test Transaction",
  //       order_id: data.id, // order_id from backend
  //       handler: (response: any) => {
  //         alert("Payment Successful!");
  //         console.log(response);
  //         // send response.razorpay_payment_id to backend to verify
  //       },
  //       prefill: {
  //         name: "Test User",
  //         email: "test@example.com",
  //         contact: "9876543210",
  //       },
  //       theme: { color: "#3399cc" },
  //     };

  //     const rzp = new (window as any).Razorpay(options);
  //     rzp.open();
  //   };
  // };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <Card
        bordered
        style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          Payment Details
        </Title>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            // src="https://upload.wikimedia.org/wikipedia/commons/7/72/Razorpay_logo.svg"
            //   src="https://upload.wikimedia.org/wikipedia/commons/7/72/Razorpay_logo.svg"
            src="https://razorpay.com/build/browser/static/razorpay-logo.5cdb58df.svg"
            alt="Razorpay"
            style={{ height: 32 }}
          />
        </div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Amount" name="amount" initialValue={25.0}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Card Number"
            name="cardNumber"
            rules={[{ required: true, message: "Enter card number" }]}
          >
            <Input placeholder="1234 **** **** 5678" />
          </Form.Item>
          <Form.Item
            label="Expiry Date"
            name="expiry"
            rules={[{ required: true, message: "Enter expiry date" }]}
          >
            <Input placeholder="MM/YY" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Pay
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Payment;
