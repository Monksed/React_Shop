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

  const formattedPrice = price.toLocaleString('ru-RU') + ' ₽';
  const formattedBonus = bonus.toLocaleString('ru-RU');

  return (
    <div className="product-card">
      <div className="product-image" onClick={handleOpenProduct}>
        <img src={`https://localhost:5023/images/${image}`} alt={name} />
        
        <div className="bonus-count">
          <span className="bonus-value">{formattedBonus}</span>
          <img src="/images/bonus.svg" alt="bonus" className="bonus-icon" />
        </div>
      </div>

      <div className="product-details">
        <p>{formattedPrice}</p>
        <h2 onClick={handleOpenProduct}>{name}</h2>
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