import React from "react";
import { Card } from "react-bootstrap";

interface OrderCardProps {
  itemName: string;
  itemImage: string;
  quantity: number;
  price: number;
}

const OrderCard: React.FC<OrderCardProps> = ({ itemName, itemImage, quantity, price }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Img
        variant="top"
        src={itemImage}
        alt={itemName}
        style={{ height: "150px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{itemName}</Card.Title>
        <Card.Text>
          Quantity: <strong>{quantity}</strong>
        </Card.Text>
        <Card.Text>
          Price: ₹{price} <br />
          Total: ₹{quantity * price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default OrderCard;
