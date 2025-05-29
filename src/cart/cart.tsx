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
} from "react-bootstrap";
// import axios from 'axios';/

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

const products: Product[] = [
  { id: 1, name: "T-Shirt", price: 20, image: "🧥" },
  { id: 2, name: "Running Shoe", price: 50, image: "👟" },
  { id: 3, name: "Analog-Watch", price: 50, image: "⌚" },
  { id: 4, name: "Backpack", price: 40, image: "🎒" },
  { id: 5, name: "T-Shirttt", price: 20, image: "🧥" },
  { id: 6, name: "Running Shoe", price: 50, image: "👟" },
  { id: 7, name: "Analog-Watch", price: 50, image: "⌚" },
  { id: 8, name: "Backpack", price: 40, image: "🎒" },
];

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchCart = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.id;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/cart/load-all?userId=${userId}`
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

    fetchCart();
  }, []);

  const addToCart = async (product: Product) => {
    try {
      //  const   userId = JSON.parse(localStorage.getItem("user"));
      let user: any = localStorage.getItem("user"); // No need for JSON.parse
      let userId = JSON.parse(user);

      let priceData = product.price;
      const response: any = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/cart/create-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId.id,
            productId: product.id,
            quantity: 1,
            price: priceData,
          }),
        }
      );
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
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

  // const removeItem = (id: number) => {
  //   setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  // };
  const removeItem = async (id: number) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/delete/${id}`, {
        method: "DELETE",
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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

          {filteredProducts.length === 0 && <p>No products found.</p>}

          {filteredProducts.map((product) => (
            <Card key={product.id} className="mb-3">
              <Card.Body className="d-flex align-items-center">
                <div style={{ fontSize: "2rem" }}>{product.image}</div>
                <div className="ms-3">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>${product.price.toFixed(2)}</Card.Text>
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
              <InputGroup size="sm" className="mt-2" style={{ width: "140px" }}>
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
            </div>
          ))}
          <div className="mt-3 fw-bold">Total: ${total.toFixed(2)}</div>
        </Col>

        <Col md={3} className="mb-4">
          <h4>Checkout</h4>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control type="text" placeholder="Address" required />
            </Form.Group>
            <Button variant="dark" type="submit" disabled={cart.length === 0}>
              Place Order
            </Button>
          </Form>
        </Col>
        <Col md={2} className="mb-4 d-flex align-items-start justify-content-end">
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
  );
};

export default Cart;
