import  { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useBackButtonManager } from '../contexts/BackButtonContext';
import './Main.scss';
import { FaShoppingCart } from "react-icons/fa";
import axios from 'axios';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <div className="cart-icon">
      <FaShoppingCart className="cart-icon__icon" />
      {cartCount > 0 && <span className="cart-icon__count">{cartCount}</span>}
    </div>
  );
};

const MainPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoad, setIsLoad] = useState(true);
  const { clear } = useBackButtonManager();


  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);


  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const q = searchQuery.toLowerCase().trim();

    return products
      .filter(p => {
        const title = p.title?.toLowerCase() || '';
        return title.split(' ').some(word => word.startsWith(q));
      })
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (aTitle.startsWith(q) && !bTitle.startsWith(q)) return -1;
        if (!aTitle.startsWith(q) && bTitle.startsWith(q)) return 1;
        return 0;
      });
  }, [products, searchQuery]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get('https://localhost:5023/api/Product/All');
        const productsWithQuantity = response.data.map(p => ({
          ...p,
          quantity: 1
        }));
        setProducts(productsWithQuantity);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      } finally {
        setIsLoad(false);
      }
    };
    loadProducts();
    clear();
  }, );

  if (isLoad) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="main">
      <CartIcon />

 
      <section className="news-slider">
        <div className="news-track">
          {[
            "Travis Scott × Jordan уже здесь",
            "Как почистить белые за 5 минут",
            "ТОП-5 инвестиций января 2025",
            "Редкие пары недели",
            "−70% только 48 часов",
            "Yeezy Restock 2025",
            "Dunk Panda 2.0 в наличии",
            "Новое поступление Off-White",
          ].map((text, i) => (
            <div key={i} className="news-card">
              <img src={`https://via.placeholder.com/320x180/0a0a0a/ffffff?text=${i+1}`} alt="" />
              <div className="news-title">{text}</div>
            </div>
          ))}
        </div>
      </section>


      <section className="search-section">
        <div
          className={`search-bar ${isSearchFocused || searchQuery ? 'search-bar--active' : ''}`}
          onClick={() => document.getElementById('searchInput')?.focus()}
        >

          <input
            id="searchInput"
            type="text"
            placeholder="Найти кроссовки..."
            className="search-bar__input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />

          {searchQuery && (
            <button
              className="search-bar__clear"
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('');
                document.getElementById('searchInput')?.focus();
              }}
            >
              ×
            </button>
          )}
        </div>
      </section>

      <div className="main__container">
        {filteredProducts.length === 0 ? (
          <div className="no-results">Ничего не найдено</div>
        ) : (
          filteredProducts.map(product => (
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
          ))
        )}
      </div>

<section className="brands-big">
  <h2 className="brands-big__title">Бренды кроссовок</h2>

  <div className="brands-big__grid">
    {[
      "Nike", "Jordan", "Adidas", "Yeezy",
      "New Balance", "Puma", "Asics", "Vans",
      "Off-White", "Balenciaga", "Gucci", "Versace"
    ].map((brand) => (
      <button
        key={brand}
        className="brand-big"
        onClick={() => console.log(`Выбран бренд: ${brand}`)}
      >
        <img
          src={`https://via.placeholder.com/200/ffffff/000000?text=${brand}`}
          alt={brand}
          className="brand-big__logo"
        />
      </button>
    ))}
  </div>
</section>

    </div>
  );
};

export default MainPage;