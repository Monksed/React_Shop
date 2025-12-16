import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.scss';  // Твой файл со стилями

const CartLoader = () => {
  return (
    <div className="cart-loader-container">
      <div className="loader-title loader-animate"></div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="loader-item">
          <div className="loader-image loader-animate"></div>
          <div className="loader-info">
            <div className="loader-line long loader-animate"></div>
            <div className="loader-line medium loader-animate"></div>
            <div className="loader-line short loader-animate"></div>
            <div className="loader-quantity">
              <div className="loader-btn loader-animate"></div>
              <div className="loader-qty loader-animate"></div>
              <div className="loader-btn loader-animate"></div>
            </div>
            <div className="loader-price loader-animate"></div>
          </div>
          <div className="loader-remove loader-animate"></div>
        </div>
      ))}

      <div className="loader-summary">
        <div className="loader-total loader-animate"></div>
        <div className="loader-checkout-btn loader-animate"></div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();

  // Состояния
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  // Имитация загрузки (удалишь, когда подключишь реальные данные из контекста/API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setCartItems([
        {
          id: 1,
          image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Товар+1',
          name: 'Стильная футболка',
          description: 'Мягкая, удобная, 100% хлопок',
          price: 2490,
          quantity: 1,
        },
        {
          id: 2,
          image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Товар+2',
          name: 'Крутая кепка',
          description: 'Летний хит, регулируемый размер',
          price: 1290,
          quantity: 2,
        },
        {
          id: 3,
          image: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Товар+3',
          name: 'Рюкзак',
          description: 'Вместительный, водостойкий',
          price: 4990,
          quantity: 1,
        },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // === ВСТРОЕННАЯ КНОПКА "НАЗАД" В TELEGRAM — 100% РАБОТАЕТ ПО КЛИКУ ===
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (!webApp) {
      console.log('Telegram WebApp не найден — открыто не в TG');
      return;
    }

    webApp.ready();
    webApp.expand();

    // Принудительно показываем кнопку
    webApp.BackButton.show();

    const handleBack = () => {
      navigate(-1);  // Возврат назад по истории роутера
      webApp.HapticFeedback.impactOccurred('medium');
    };

    // Чистим старые обработчики и вешаем новый
    webApp.BackButton.offClick();
    webApp.BackButton.onClick(handleBack);

    return () => {
      webApp.BackButton.offClick(handleBack);
      // webApp.BackButton.hide();  // Раскомменти, если хочешь прятать при выходе
    };
  }, [navigate]);

  // Подсчёт итого
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Пустая корзина
  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Корзина</h1>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p className="empty-cart-title">Корзина пуста</p>
          <p className="empty-cart-subtitle">Добавьте товары, чтобы оформить заказ</p>
          <button onClick={() => navigate("/")} className="back-to-shop-btn">
            Вернуться к покупкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>

      {isLoading ? (
        <CartLoader />
      ) : (
        <div className="cart-content">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />

              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-desc">{item.description}</p>

                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => {
                    if (item.quantity > 1) {
                      setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
                    }
                  }}>-</button>
                  <span className="quantity">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => {
                    setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
                  }}>+</button>
                </div>

                <p className="cart-item-price">{item.price * item.quantity} ₽</p>
              </div>

              <button className="remove-item" onClick={() => {
                setCartItems(prev => prev.filter(i => i.id !== item.id));
              }}>×</button>
            </div>
          ))}

          <div className="cart-summary">
            <div className="total">
              <span>Итого:</span>
              <strong>{totalPrice} ₽</strong>
            </div>
            <button className="checkout-btn">Оформить заказ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;