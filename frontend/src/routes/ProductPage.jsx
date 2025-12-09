import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ProductPage.scss";
import { useBackButtonManager } from "../contexts/BackButtonContext";
import { miniApp } from "@telegram-apps/sdk-react";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoad, setIsLoad] = useState(true);
  const navigate = useNavigate();
  const { action, clear } = useBackButtonManager();


  useEffect(() => {
    window.scrollTo(0,0);
    miniApp.setBackgroundColor('#FFFFFF');
    miniApp.setHeaderColor('#FFFFFF');
    action(() => navigate("/"));
    return () => {
      clear();
    };
  }, );

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await axios.get(`https://localhost:5023/api/Product/One/${id}`);
        setProduct({
          ...response.data,
          quantity: 1
        });
      } catch (error) {
        console.error("Ошибка при загрузке товара:", error);
      } finally {
        setIsLoad(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoad) return <div className="product-page">Загрузка...</div>;
  if (!product) return <div className="product-page">Товар не найден</div>;

  return (
    <div className="product-page">
      <div className="product-page__card">
        <img
          src={`https://localhost:5023/images/${product.image}`}
          alt={product.name}
          className="product-page__image"
        />
        <div className="product-page__info">
          <h2>{product.name}</h2>
          <p className="product-page__desc">{product.description}</p>
          <p className="product-page__price">Цена: {product.price} ₽</p>
          <p className={`product-page__stock ${product.quantity > 0 ? 'in' : 'out'}`}>
            {product.quantity > 0 ? 'В наличии' : 'Распродано'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;