import { useParams,useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useCart } from '../contexts/CartContext';
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ProductPage.scss";
import { useBackButtonManager } from "../contexts/BackButtonContext";
import { miniApp } from "@telegram-apps/sdk-react";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qaOpen, setQaOpen] = useState({
  insurance: false,
  delivery: false
});

  const [product, setProduct] = useState(null);
  const [isLoad, setIsLoad] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  const sizes = [36, 36.5, 37, 38, 39, 40, 41];
  const touchStartX = useRef(0);
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

  const images = product.images || [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
    touchStartX.current = 0;
  };

  return (
    <div className="product-page">
      <div className="product-page__card">


        <button className="product-page__back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>


        <div
          className="product-page__gallery"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="product-page__slider"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={`/images/${img}`}
                alt={`${product.title} ${index + 1}`}
                className="product-page__slide"
              />
            ))}
          </div>
        </div>


        <div className="product-page__price-row">
          <div className="product-page__price-big">
            {product.price.toLocaleString()} ₽
          </div>
        </div>


        <h1 className="product-page__title">{product.title}</h1>


        <div className="product-page__sizes">
          {sizes.map((size) => (
            <button
              key={size}
              className={`product-page__size-btn ${selectedSize === size ? "selected" : ""}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>


        <p className={`product-page__stock ${product.quantity > 0 ? "in" : "out"}`}>
          {product.quantity > 0 ? "В наличии" : "Распродано"}
        </p>


        <div className="product-page__description">
          <h3>Описание</h3>
          <p>{product.description}</p>
        </div>

<section className="product-tips">

  <div className="product-tips__track">
    {[
      "Как почистить белую подошву",
      "С чем носить эти кроссы",
      "Как отличить оригинал",
      "ТОП-5 похожих моделей",
      "Гайд по размерам",
      "Можно ли стирать",
      "Лайфхаки от реселлеров",
      "История модели",
    ].map((tip, i) => (
      <div key={i} className="product-tip-card">
        <img
          src={`https://via.placeholder.com/300x200/0a0a0a/ffffff?text=Совет+${i+1}`}
          alt=""
        />
        <div className="product-tip-title">{tip}</div>
      </div>
    ))}
  </div>
</section>

<div className="product-page__qa">


          <div className="qa-item">
            <button 
              className="qa-question"
              onClick={() => setQaOpen(prev => ({ ...prev, insurance: !prev.insurance }))}
            >
              <span>Страховка и безопасность</span>
              <div className={`qa-chevron ${qaOpen.insurance ? 'open' : ''}`}>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path d="M7 10L12 15L17 10" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            {qaOpen.insurance && (
              <div className="qa-answer">
                <p>
                  100% оригинал — проверка перед отправкой.<br/>
                  Подделка = возврат ×3.<br/>
                  Фирменный бокс + все пломбы и бирки.<br/>
                  Страховка Poizon/Dewu (если через нас).<br/>
                  Возврат 14 дней.
                </p>
              </div>
            )}
          </div>

 
          <div className="qa-item">
            <button 
              className="qa-question"
              onClick={() => setQaOpen(prev => ({ ...prev, delivery: !prev.delivery }))}
            >
              <span>Доставка и оплата</span>
              <div className={`qa-chevron ${qaOpen.delivery ? 'open' : ''}`}>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path d="M7 10L12 15L17 10" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            {qaOpen.delivery && (
              <div className="qa-answer">
                <p>
                  СДЭК / Boxberry / Почта — выбирай любой.<br/>
                  Бесплатно от 15 000 ₽.<br/>
                  Москва-СПб: 1–2 дня · Регионы: 3–7 дней.<br/>
                  Трек сразу после отправки.<br/>
                  Оплата онлайн или при получении.
                </p>
              </div>
            )}
          </div>
        </div>


        <div className="product-page__buy-wrapper">
          <button
            className={`product-page__buy-btn ${product.quantity <= 0 ? 'disabled' : ''}`}
            onClick={() => {
              if (product.quantity <= 0) {
                alert('Товара нет в наличии');
                return;
              }
              addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image || product.images?.[0],
                selectedSize: selectedSize || 'Не выбран'
              });
              alert('Добавлено в корзину!');
            }}
            disabled={product.quantity <= 0}
          >
            <span>
              {product.quantity > 0 ? 'В корзину' : 'Нет в наличии'}
            </span>
          </button>
        </div>


      </div>
    </div>
  );
};

export default ProductPage;