import React, { useState, useEffect } from 'react';
import './ProductCard.scss';
import { FaShoppingBasket } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, image, name, price, quantity, bonus, onAddToCart }) => {
  const [isLoad, setIsLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoad(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoad) {
    return <div className="product-card loading">Загрузка...</div>;
  }

  const handleOpenProduct = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card">
      <div className="product-image" onClick={handleOpenProduct}>
        <img src={`https://localhost:5023/images/${image}`} alt={name} />
        <span className="bonus-count">{bonus} ₽</span>
      </div>
      <div className="product-details">
        <h2 onClick={handleOpenProduct}>{name}</h2>
        <p>{price} ₽</p>
        <button
          className="btn-outline"
          onClick={() => onAddToCart(id)}
          disabled={quantity === 0}
        >
          {quantity === 0 ? "Нет в наличии" : "В корзину"}
          <FaShoppingBasket className="basket-icon" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
