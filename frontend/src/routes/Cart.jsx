import { useNavigate } from "react-router-dom";
import "./Cart.scss";

const CartPage = () => {
  const navigate = useNavigate();

  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
  // ЗДЕСЬ В БУДУЩЕМ ПОДКЛЮЧИШЬ КОНТЕКСТ КОРЗИНЫ
  // const { cartItems, removeFromCart, updateQuantity } = useCart();
  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

  // Заглушка — в будущем заменишь на реальные cartItems
  const cartItems = [];

  // Заглушка итого
  const totalPrice = 0;

  return (
    <div className="cart-page">


      <div className="cart-page__header">
        <h1>Корзина</h1>
      </div>

      <div className="cart-page__list">
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Корзина пуста</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={`/images/${item.image}`} alt={item.title} className="cart-item__image" />

              <div className="cart-item__info">
                <h3 className="cart-item__title">{item.title}</h3>
                <p className="cart-item__size">Размер: {item.selectedSize || '—'}</p>

                <div className="cart-item__actions">
                  <div className="quantity-control">
                    <button>-</button>
                    <span>{item.quantity || 1}</span>
                    <button>+</button>
                  </div>

                  <p className="cart-item__price">
                    {item.price ? `${item.price.toLocaleString()} ₽` : '—'}
                  </p>

                  <button className="cart-item__delete">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-page__total">
        <div className="total-row">
          <span>Итого:</span>
          <span className="total-price">{totalPrice.toLocaleString()} ₽</span>
        </div>
      </div>

      <div className="cart-page__checkout">
        <button className="checkout-btn" disabled={cartItems.length === 0}>
          Перейти к оформлению
        </button>
      </div>

    </div>
  );
};

export default CartPage;
