import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

// Импорт компонентов
import SearchBar from './common/SearchBar';
import ChefCard from './common/ChefCard';
import DishCard from './common/DishCard';
import CategoryFilter from './common/CategoryFilter';
import Banner from './common/Banner';
import Footer from './common/Footer';
import Loader from './common/Loader';

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popularChefs, setPopularChefs] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState(null);

  // Запрос геолокации пользователя
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Ошибка получения геолокации:', error);
        }
      );
    }
  }, []);

  // Загрузка данных с сервера
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Запрос категорий
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories([{ id: 'all', name: 'Все кухни' }, ...categoriesData]);

        // Запрос популярных поваров
        const chefsResponse = await fetch('/api/chefs/popular');
        const chefsData = await chefsResponse.json();
        setPopularChefs(chefsData);

        // Запрос популярных блюд
        const dishesResponse = await fetch('/api/dishes/popular');
        const dishesData = await dishesResponse.json();
        setPopularDishes(dishesData);

        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Обработчик поиска
  const handleSearch = (searchTerm, filters) => {
    // Перенаправление на страницу результатов поиска с параметрами
    navigate(`/search?query=${searchTerm}&category=${filters.category || ''}&diet=${filters.diet || ''}`);
  };

  // Обработчик выбора категории
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Отображение состояния загрузки
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="home-page">
      {/* Герой-секция с поиском */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Настоящая домашняя еда от поваров рядом с вами</h1>
          <p>Откройте для себя разнообразие вкусов домашней кухни</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Фильтры категорий */}
      <section className="category-section">
        <div className="container">
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onCategoryChange={handleCategoryChange} 
          />
        </div>
      </section>

      {/* Баннеры с акциями */}
      <section className="banners-section">
        <div className="container">
          <Banner 
            title="Особенности узбекской кухни" 
            description="Откройте для себя аутентичные вкусы Средней Азии" 
            image="/images/banners/uzbek-cuisine.jpg" 
            link="/collections/uzbek"
          />
        </div>
      </section>

      {/* Популярные блюда */}
      <section className="popular-dishes-section">
        <div className="container">
          <div className="section-header">
            <h2>Популярные блюда</h2>
            <a href="/dishes" className="see-all-link">Смотреть все</a>
          </div>
          <div className="dishes-grid">
            {popularDishes.map(dish => (
              <DishCard 
                key={dish.id} 
                dish={dish} 
                onClick={() => navigate(`/chefs/${dish.chef.id}/dishes/${dish.id}`)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Повара поблизости */}
      <section className="nearby-chefs-section">
        <div className="container">
          <div className="section-header">
            <h2>Повара поблизости</h2>
            <a href="/chefs" className="see-all-link">Смотреть все</a>
          </div>
          <div className="chefs-grid">
            {popularChefs.map(chef => (
              <ChefCard 
                key={chef.id} 
                chef={chef} 
                distance={location ? calculateDistance(location, chef.location) : null}
                onClick={() => navigate(`/chefs/${chef.id}`)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="how-it-works-section">
        <div className="container">
          <h2>Как это работает</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">1</div>
              <h3>Найдите повара</h3>
              <p>Выберите из множества домашних поваров рядом с вами</p>
            </div>
            <div className="step">
              <div className="step-icon">2</div>
              <h3>Выберите блюда</h3>
              <p>Просмотрите меню и добавьте понравившиеся блюда в корзину</p>
            </div>
            <div className="step">
              <div className="step-icon">3</div>
              <h3>Оформите заказ</h3>
              <p>Укажите адрес доставки и выберите способ оплаты</p>
            </div>
            <div className="step">
              <div className="step-icon">4</div>
              <h3>Наслаждайтесь едой</h3>
              <p>Курьер доставит вашу еду прямо к вашей двери</p>
            </div>
          </div>
        </div>
      </section>

      {/* Присоединяйтесь как повар */}
      <section className="become-chef-section">
        <div className="container">
          <div className="become-chef-content">
            <div className="text-content">
              <h2>Вы готовите вкусно?</h2>
              <p>Присоединяйтесь к нам в качестве повара и начните зарабатывать на своем кулинарном таланте</p>
              <button 
                className="primary-button" 
                onClick={() => navigate('/become-chef')}
              >
                Стать поваром
              </button>
            </div>
            <div className="image-content">
              <img src="/images/become-chef.jpg" alt="Стать поваром" />
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <Footer />
    </div>
  );
};

// Вспомогательная функция для расчета расстояния между двумя точками
const calculateDistance = (point1, point2) => {
  // Haversine formula для расчета расстояния между двумя точками на сфере (Земле)
  const R = 6371; // Радиус Земли в км
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLng = deg2rad(point2.lng - point1.lng);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Расстояние в км
  
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

export default HomePage;