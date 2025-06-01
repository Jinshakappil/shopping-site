import React, { useEffect, useState } from "react";
// import { Col } from "react-bootstrap";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
// import OrderCard from "./OrderCard"; // adjust path as needed
import OrderCard from "./ordercard";
interface order {
  id: number;
  price: number;
  itemImage: string;
  itemName: string;
  productId: any;
  quantity: number;
}
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<order[]>([]);
  const authToken = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchCart();
  }, []);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  });
  const fetchCart = async () => {
    const userId = user?.id;
    try {
      const response = await fetch(
        `${API_BASE}/cart/order-list?userId=${userId}`,
        {
          headers: getHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };
  return (
    <Col md={3} className="mb-4">
      <h4>Orders</h4>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <>
            <Card 
            key={order.id} 
            className="mb-3">
              <Card.Body className="d-flex align-items-center">
                <div style={{ fontSize: "2rem" }}>{order.itemImage}</div>
                <div className="ms-3">
                  <Card.Title>{order.itemName}</Card.Title>
                  <Card.Text>${order.price}</Card.Text>
                  {/* <Card.Text>quantity :{order.quantity}</Card.Text> */}
                </div>
              </Card.Body>
            </Card>
          </>
        ))
      )}
    </Col>
  );
};

export default Orders;
