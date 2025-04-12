import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Clock, ChefHat, Truck, Package, Home, Phone, MessageCircle } from 'lucide-react';
import './OrderTracking.css';

// Импорт компонентов
import Loader from './common/Loader';
import Map from './common/Map';
import Footer from './common/Footer';

const OrderTracking = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [courierLocation, setCourierLocation] = useState(null);
  
  // Загрузка данных заказа
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных заказа:', error);
        setLoading(false);
      }
    };
    
    fetchOrderData();
  }, [id]);
  
  // Обновление статуса заказа через WebSocket (имитация)
  useEffect(() => {
    if (!order) return;
    
    // Создаем имитацию WebSocket для демонстрационных целей
    const orderUpdatesInterval = setInterval(() => {
      // Имитация движения курьера, если заказ доставляется
      if (order.status === 'delivering' && courierLocation) {
        // Двигаем курьера ближе к адресу доставки
        const deliveryLocation = order.deliveryAddress.location;
        const currentLocation = courierLocation;
        
        // Вычисляем новую позицию, приближая к месту доставки
        const newLat = currentLocation.lat + (deliveryLocation.lat - currentLocation.lat) * 0.1;
        const newLng = currentLocation.lng + (deliveryLocation.lng - currentLocation.lng) * 0.1;
        
        setCourierLocation({
          lat: newLat,
          lng: newLng
        });
      }
    }, 3000);
    
    return () => {
      clearInterval(orderUpdatesInterval);
    };
  }, [order, courierLocation]);
  
  // Имитация изменения статуса заказа при первой загрузке
  useEffect(() => {
    if (!order) return;
    
    // Устанавливаем начальную позицию курьера, если заказ находится в статусе "доставляется"
    if (order.status === 'delivering' && !courierLocation && order.courier) {
      setCourierLocation(order.courier.startLocation);
    }
  }, [order]);
  
  // Получение текущего шага доставки
  const getCurrentStep = () => {
    switch (order.status) {
      case 'confirmed':
        return 1;
      case 'cooking':
        return 2;
      case 'ready':
        return 3;
      case 'delivering':
        return 4;
      case 'delivered':
        return 5;
      default:
        return 1;
    }
  };
  
  // Расчет ожидаемого времени доставки
  const calculateETA = () => {
    if (order.status === 'delivered') {
      return 'Заказ доставлен';
    }
    
    if (order.estimatedDeliveryTime) {
      const estimatedTime = new Date(order.estimatedDeliveryTime);
      const hours = estimatedTime.getHours().toString().padStart(2, '0');
      const minutes = estimatedTime.getMinutes().toString().padStart(2, '0');
      return `Ожидаемое время доставки: ${hours}:${minutes}`;
    }
    
    return 'Время доставки уточняется';
  };
  
  if (loading) {
    return <Loader />;
  }
  
  if (!order) {
    return <div className="error-message">Заказ не найден</div>;
  }
  
  const currentStep = getCurrentStep();
  
  return (
    <div className="tracking-page">
      <div className="container">
        <h1 className="tracking-title">Отслеживание заказа #{order.orderNumber}</h1>
        
        {/* Уведомление о статусе */}
        <div className="order-status-notification">
          <div className="status-icon">
            {order.status === 'confirmed' && <Check />}
            {order.status === 'cooking' && <ChefHat />}
            {order.status === 'ready' && <Package />}
            {order.status === 'delivering' && <Truck />}
            {order.status === 'delivered' && <Home />}
          </div>
          <div className="status-message">
            {order.status === 'confirmed' && 'Заказ подтвержден и принят рестораном'}
            {order.status === 'cooking' && 'Повар готовит ваш заказ'}
            {order.status === 'ready' && 'Заказ готов и ожидает курьера'}
            {order.status === 'delivering' && 'Курьер доставляет ваш заказ'}
            {order.status === 'delivered' && 'Заказ успешно доставлен'}
          </div>
        </div>
        
        {/* Основное содержимое страницы */}
        <div className="tracking-content">
          {/* Шаги отслеживания заказа */}
          <div className="tracking-progress">
            <h2>Статус заказа</h2>
            
            <div className="progress-steps">
              <div className={`progress-step ${currentStep >= 1 ? 'completed' : ''}`}>
                <div className="step-icon">
                  <Check />
                </div>
                <div className="step-info">
                  <div className="step-title">Заказ подтвержден</div>
                  <div className="step-time">{order.confirmedAt}</div>
                </div>
              </div>
              
              <div className={`progress-step ${currentStep >= 2 ? 'completed' : ''}`}>
                <div className="step-icon">
                  <ChefHat />
                </div>
                <div className="step-info">
                  <div className="step-title">Готовится</div>
                  <div className="step-time">{order.cookingStartedAt || 'В ожидании'}</div>
                </div>
              </div>
              
              <div className={`progress-step ${currentStep >= 3 ? 'completed' : ''}`}>
                <div className="step-icon">
                  <Package />
                </div>
                <div className="step-info">
                  <div className="step-title">Готов к отправке</div>
                  <div className="step-time">{order.readyAt || 'В ожидании'}</div>
                </div>
              </div>
              
              <div className={`progress-step ${currentStep >= 4 ? 'completed' : ''}`}>
                <div className="step-icon">
                  <Truck />
                </div>
                <div className="step-info">
                  <div className="step-title">В пути</div>
                  <div className="step-time">{order.deliveryStartedAt || 'В ожидании'}</div>
                </div>
              </div>
              
              <div className={`progress-step ${currentStep >= 5 ? 'completed' : ''}`}>
                <div className="step-icon">
                  <Home />
                </div>
                <div className="step-info">
                  <div className="step-title">Доставлен</div>
                  <div className="step-time">{order.deliveredAt || 'В ожидании'}</div>
                </div>
              </div>
            </div>
            
            <div className="delivery-eta">
              <Clock className="eta-icon" />
              <span>{calculateETA()}</span>
            </div>
          </div>
          
          {/* Карта с местоположением доставки */}
          <div className="tracking-map-section">
            <h2>Местоположение доставки</h2>
            
            <div className="tracking-map">
              <Map 
                center={courierLocation || order.deliveryAddress.location}
                deliveryLocation={order.deliveryAddress.location}
                courierLocation={courierLocation}
                chefLocation={order.chef.location}
                zoom={14}
              />
            </div>
            
            {currentStep >= 4 && order.courier && (
              <div className="courier-info">
                <div className="courier-profile">
                  <img src={order.courier.avatar} alt={order.courier.name} />
                  <div>
                    <h3>{order.courier.name}</h3>
                    <div className="courier-transport">{order.courier.transport}</div>
                  </div>
                </div>
                
                <div className="courier-actions">
                  <a href={`tel:${order.courier.phone}`} className="action-button">
                    <Phone />
                    Позвонить
                  </a>
                  <button className="action-button">
                    <MessageCircle />
                    Сообщение
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Информация о заказе */}
        <div className="order-details">
          <h2>Информация о заказе</h2>
          
          <div className="order-details-grid">
            <div className="order-info-card">
              <h3>Детали заказа</h3>
              <div className="order-number">Заказ #{order.orderNumber}</div>
              <div className="order-date">Размещен {order.createdAt}</div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-quantity">{item.quantity}×</div>
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">{item.price} ₽</div>
                  </div>
                ))}
              </div>
              
              <div className="order-summary">
                <div className="summary-row">
                  <span>Стоимость блюд</span>
                  <span>{order.subtotal} ₽</span>
                </div>
                <div className="summary-row">
                  <span>Стоимость доставки</span>
                  <span>{order.deliveryFee} ₽</span>
                </div>
                <div className="summary-total">
                  <span>Итого</span>
                  <span>{order.total} ₽</span>
                </div>
              </div>
            </div>
            
            <div className="order-info-card">
              <h3>Повар</h3>
              <div className="chef-info">
                <img src={order.chef.avatar} alt={order.chef.name} className="chef-avatar" />
                <div>
                  <div className="chef-name">{order.chef.name}</div>
                  <div className="chef-cuisine">{order.chef.cuisine}</div>
                  <Link to={`/chefs/${order.chef.id}`} className="view-restaurant-link">
                    Перейти к повару
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="order-info-card">
              <h3>Адрес доставки</h3>
              <div className="delivery-address">
                <div className="address-line">{order.deliveryAddress.street}</div>
                <div className="address-details">{order.deliveryAddress.details}</div>
                <div className="address-city">{order.deliveryAddress.city}</div>
              </div>
              
              <h3 className="payment-title">Способ оплаты</h3>
              <div className="payment-method">
                {order.paymentMethod === 'card' && 'Банковская карта'}
                {order.paymentMethod === 'cash' && 'Наличные при получении'}
              </div>
            </div>
          </div>
          
          <div className="order-help">
            <h3>Нужна помощь с заказом?</h3>
            <p>Если у вас возникли вопросы или проблемы с заказом, свяжитесь с нашей службой поддержки</p>
            <a href="/support" className="support-link">Связаться с поддержкой</a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderTracking;