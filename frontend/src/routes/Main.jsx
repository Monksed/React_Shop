import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import './Main.scss';
import { FaShoppingCart } from "react-icons/fa";
import axios from 'axios';

const CartIcon = () => {
  const { cartCount, resetCart } = useCart();

  return (
    <div className="cart-icon" onClick={resetCart}>
      <FaShoppingCart className="cart-icon__icon" />
      {cartCount > 0 && <span className="cart-icon__count">{cartCount}</span>}
    </div>
  );
};

const MainPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoad, setIsLoad] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5023/api/Product/All');
        setProducts(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      } finally {
        setIsLoad(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoad) {
    return <div className="product-card loading"><p>Загрузка...</p></div>;
  }

  return (
    <div className="main">
      <CartIcon />
      <div className="main__container">
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
            quantity={product.quantity}
            bonus={Math.floor(product.price * 0.1)}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};
export default MainPage;