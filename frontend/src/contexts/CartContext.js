import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = async (productId) => {
    try {
      const response = await axios.post(`http://localhost:5023/api/Product/Buy/${productId}`);
      if (response.status === 200) {
        setCartCount(prev => prev + 1);
        alert("Товар добавлен в корзину");
      }
    } catch (e) {
      alert("Ошибка при добавлении товара");
    }
  };

  const resetCart = () => setCartCount(0);

  return (
    <CartContext.Provider value={{ cartCount, addToCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};
