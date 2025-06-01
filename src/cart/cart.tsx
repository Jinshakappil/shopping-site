// export default Cart;
import React, { useEffect, useState } from "react";
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
// import axios from 'axios';/
import { useNavigate } from "react-router-dom"; 
import Orders from "../order/order";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

interface CartItem extends Product {
  productId: any;
  quantity: number;
}
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const authToken = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  });

  const fetchProducts = async () => {
    const userId = user?.id;
    try {
      const response = await fetch(`${API_BASE}/items/list-all-items`, {
        headers: getHeaders(),

        // method: "GET",
        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${authToken}`,
        // },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };
  const fetchCart = async () => {
    const userId = user?.id;
    try {
      const response = await fetch(
        `${API_BASE}/cart/load-all?userId=${userId}`,
        {
          headers: getHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      //  const   userId = JSON.parse(localStorage.getItem("user"));
      // let user: any = localStorage.getItem("user"); // No need for JSON.parse
      let userId = user;

      let priceData = product.price;
      const response: any = await fetch(`${API_BASE}/cart/create-cart`, {
        method: "POST",
        headers: getHeaders(),

        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${authToken}`,
        // },
        body: JSON.stringify({
          userId: userId.id,
          productId: product.id,
          quantity: 1,
          price: priceData,
        }),
      });
      const updatedCartItem = await response.json(); // contains productId, userId, quantity, etc.

      setCart((prevCart) => {
        const existing = prevCart.find(
          (item) => item.productId === updatedCartItem.productId
        );
        if (existing) {
          return prevCart.map((item) =>
            item.productId === updatedCartItem.productId
              ? { ...item, quantity: updatedCartItem.quantity }
              : item
          );
        } else {
          return [...prevCart, updatedCartItem];
        }
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const updateQty = async (id: number, delta: number, productId: any) => {
    try {
      // 1. Make API call to update quantity in backend
      const response = await fetch(`${API_BASE}/cart/update/${id}`, {
        method: "PATCH",
        headers: getHeaders(),

        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${authToken}`,
        // },
        body: JSON.stringify({ delta, productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart item");
      }

      const updatedItem = await response.json();

      // 2. Update local state only after backend is updated
      setCart((prevCart) =>
        prevCart
          .map((item) =>
            item.id === id ? { ...item, quantity: updatedItem.quantity } : item
          )
          .filter((item) => item.quantity > 0)
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      // You can show a message to the user if needed
    }
  };

  const removeItem = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/cart/delete/${id}`, {
        method: "DELETE",
        headers: getHeaders(),

        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${authToken}`,
        // },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Order placed!");
  };

  const placeOrder = async () => {
    try {
      const response = await fetch(`${API_BASE}/order/place-order`, {
        method: "POST",
        headers: getHeaders(),

        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${authToken}`,
        // },
        body: JSON.stringify({
          ...selectedItem,
          shippingAddress: shippingAddress,
        }),
      });
      if (!response.ok) throw new Error("Order failed");
      const data = await response.json();
      navigate(`/payment/${data.order.id}`);
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };
  return (
    <>
      <Container className="py-4">
        <Row>
          <Col md={4} className="mb-4">
            <h4>Featured Products</h4>

            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />

            {products.length === 0 && <p>No products found.</p>}

            {products.map((product) => (
              <Card key={product.id} className="mb-3">
                <Card.Body className="d-flex align-items-center">
                  <div style={{ fontSize: "2rem" }}>{product.image}</div>
                  <div className="ms-3">
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>${product.price}</Card.Text>
                    <Button onClick={() => addToCart(product)} size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>

          <Col md={3} className="mb-4">
            <h4>Cart</h4>
            {cart.length === 0 && <p>Your cart is empty.</p>}
            {cart.map((item) => (
              <div key={item.id} className="border p-2 mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    {item.name} (${item.price})
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
                <InputGroup
                  size="sm"
                  className="mt-2"
                  style={{ width: "140px" }}
                >
                  <Button
                    variant="outline-secondary"
                    onClick={() => updateQty(item.id, -1, item.productId)}
                  >
                    -
                  </Button>
                  <Form.Control
                    value={item.quantity}
                    readOnly
                    className="text-center"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => updateQty(item.id, 1, item.productId)}
                  >
                    +
                  </Button>
                </InputGroup>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    console.log("itemmmmmmmmmmm", item);
                    setSelectedItem(item);
                    setShowModal(true);
                  }}
                >
                  Place Order
                </Button>
              </div>
            ))}
            <div className="mt-3 fw-bold">Total: ${total.toFixed(2)}</div>
          </Col>

          {/* <Col md={3} className="mb-4"> */}
            <Orders></Orders>
          {/* </Col> */}
          <Col
            md={2}
            className="mb-4 d-flex align-items-start justify-content-end"
          >
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/login"; // or "/"
              }}
            >
              Logout
            </Button>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Place Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={async () => {
              placeOrder();
            }}
          >
            Confirm Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Cart;
