import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, Phone, Calendar, ShoppingCart } from 'lucide-react';
import './Restaurant.css';

// Импорт компонентов
import Loader from './common/Loader';
import DishCard from './common/DishCard';
import ReviewCard from './common/ReviewCard';
import Map from './common/Map';
import Footer from './common/Footer';

const Restaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [chef, setChef] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Загрузка данных повара и блюд
  useEffect(() => {
    const fetchChefData = async () => {
      try {
        // Запрос данных о поваре
        const chefResponse = await fetch(`/api/chefs/${id}`);
        const chefData = await chefResponse.json();
        setChef(chefData);
        
        // Запрос блюд повара
        const dishesResponse = await fetch(`/api/chefs/${id}/dishes`);
        const dishesData = await dishesResponse.json();
        setDishes(dishesData);
        
        // Запрос отзывов о поваре
        const reviewsResponse = await fetch(`/api/chefs/${id}/reviews`);
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      }
    };
    
    fetchChefData();
  }, [id]);
  
  // Получение уникальных категорий блюд
  const getCategories = () => {
    if (!dishes.length) return [];
    
    const categories = [...new Set(dishes.map(dish => dish.category))];
    return [{ id: 'all', name: 'Все блюда' }, ...categories.map(cat => ({ id: cat, name: cat }))];
  };
  
  // Фильтрация блюд по категории
  const filteredDishes = activeCategory === 'all' 
    ? dishes 
    : dishes.filter(dish => dish.category === activeCategory);
  
  // Добавление блюда в корзину
  const addToCart = (dish) => {
    // Получаем текущую корзину из localStorage или создаем новую
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], chefId: null };
    
    // Проверяем, есть ли уже блюда от другого повара
    if (cart.chefId && cart.chefId !== id && cart.items.length > 0) {
      if (window.confirm('В корзине уже есть блюда от другого повара. Очистить корзину?')) {
        cart.items = [];
      } else {
        return; // Пользователь отказался очистить корзину
      }
    }
    
    // Устанавливаем ID повара
    cart.chefId = id;
    
    // Проверяем, есть ли уже это блюдо в корзине
    const existingItemIndex = cart.items.findIndex(item => item.id === dish.id);
    
    if (existingItemIndex >= 0) {
      // Увеличиваем количество
      cart.items[existingItemIndex].quantity += 1;
    } else {
      // Добавляем новое блюдо
      cart.items.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        quantity: 1
      });
    }
    
    // Сохраняем корзину
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Показываем уведомление
    alert('Блюдо добавлено в корзину');
  };
  
  if (loading) {
    return <Loader />;
  }
  
  if (!chef) {
    return <div className="error-message">Повар не найден</div>;
  }
  
  return (
    <div className="restaurant-page">
      {/* Hero-секция с информацией о поваре */}
      <section className="chef-hero">
        <div className="chef-cover-image" style={{ backgroundImage: `url(${chef.coverImage})` }}></div>
        <div className="container">
          <div className="chef-profile">
            <div className="chef-avatar">
              <img src={chef.avatar} alt={chef.name} />
            </div>
            <div className="chef-info">
              <h1>{chef.name}</h1>
              <p className="chef-cuisine">{chef.cuisine}</p>
              
              <div className="chef-stats">
                <div className="stat">
                  <Star className="stat-icon" />
                  <span>{chef.rating} ({chef.reviewsCount} отзывов)</span>
                </div>
                <div className="stat">
                  <MapPin className="stat-icon" />
                  <span>{chef.address}</span>
                </div>
                <div className="stat">
                  <Clock className="stat-icon" />
                  <span>Время доставки: {chef.deliveryTime} мин</span>
                </div>
              </div>
              
              <div className="chef-description">
                <p>{chef.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Табы для переключения между меню и информацией */}
      <section className="tabs-section">
        <div className="container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              Меню
            </button>
            <button 
              className={`tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Информация
            </button>
            <button 
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Отзывы ({reviews.length})
            </button>
          </div>
        </div>
      </section>
      
      {/* Содержимое вкладки "Меню" */}
      {activeTab === 'menu' && (
        <section className="menu-section">
          <div className="container">
            <div className="menu-container">
              {/* Боковая панель с категориями */}
              <div className="categories-sidebar">
                <h3>Категории</h3>
                <ul className="category-list">
                  {getCategories().map(category => (
                    <li 
                      key={category.id}
                      className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Список блюд */}
              <div className="dishes-container">
                {activeCategory !== 'all' && (
                  <h2 className="category-title">{
                    getCategories().find(cat => cat.id === activeCategory)?.name
                  }</h2>
                )}
                
                <div className="dishes-grid">
                  {filteredDishes.length > 0 ? (
                    filteredDishes.map(dish => (
                      <div key={dish.id} className="dish-card-container">
                        <DishCard dish={dish} />
                        <button 
                          className="add-to-cart-button"
                          onClick={() => addToCart(dish)}
                        >
                          <ShoppingCart size={16} />
                          Добавить в корзину
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-dishes-message">
                      Нет доступных блюд в этой категории
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Содержимое вкладки "Информация" */}
      {activeTab === 'info' && (
        <section className="info-section">
          <div className="container">
            <div className="info-grid">
              <div className="info-card">
                <h3>Контактная информация</h3>
                <div className="info-item">
                  <Phone className="info-icon" />
                  <span>{chef.phone}</span>
                </div>
                <div className="info-item">
                  <MapPin className="info-icon" />
                  <span>{chef.address}</span>
                </div>
              </div>
              
              <div className="info-card">
                <h3>Время работы</h3>
                <div className="working-hours">
                  {chef.workingHours.map((day, index) => (
                    <div key={index} className="day-hours">
                      <span className="day">{day.day}:</span>
                      <span className="hours">{day.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="info-card">
                <h3>Зона доставки</h3>
                <div className="delivery-map">
                  <Map 
                    center={{ lat: chef.location.lat, lng: chef.location.lng }}
                    radius={chef.deliveryRadius}
                    zoom={13}
                  />
                </div>
                <div className="delivery-info">
                  <p>Радиус доставки: {chef.deliveryRadius} км</p>
                  <p>Стоимость доставки: {chef.deliveryFee} ₽</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Содержимое вкладки "Отзывы" */}
      {activeTab === 'reviews' && (
        <section className="reviews-section">
          <div className="container">
            <div className="reviews-header">
              <h2>Отзывы о поваре</h2>
              <div className="overall-rating">
                <Star className="rating-icon" />
                <span className="rating-value">{chef.rating}</span>
                <span className="reviews-count">На основе {chef.reviewsCount} отзывов</span>
              </div>
            </div>
            
            <div className="reviews-container">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="no-reviews-message">
                  У этого повара пока нет отзывов
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Плавающая кнопка корзины */}
      <div className="floating-cart-button" onClick={() => navigate('/cart')}>
        <ShoppingCart size={24} />
        <span>Корзина</span>
      </div>
      
      <Footer />
    </div>
  );
};

export default Restaurant;