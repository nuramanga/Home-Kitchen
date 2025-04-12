import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, MapPin, CreditCard, Truck } from 'lucide-react';
import './Cart.css';

// Импорт компонентов
import Loader from './common/Loader';
import AddressSelector from './common/AddressSelector';
import PaymentMethod from './common/PaymentMethod';
import Footer from './common/Footer';

const Cart = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({ items: [], chefId: null });
  const [chef, setChef] = useState(null);
  const [step, setStep] = useState(1); // 1 - корзина, 2 - доставка, 3 - оплата
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [orderNote, setOrderNote] = useState('');
  
  // Загрузка корзины из localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || { items: [], chefId: null };
    setCart(savedCart);
    
    if (savedCart.chefId) {
      fetchChefData(savedCart.chefId);
    } else {
      setLoading(false);
    }
  }, []);
  
  // Загрузка данных о поваре
  const fetchChefData = async (chefId) => {
    try {
      const response = await fetch(`/api/chefs/${chefId}`);
      const data = await response.json();
      setChef(data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных о поваре:', error);
      setLoading(false);
    }
  };
  
  // Подсчет общей стоимости
  const calculateSubtotal = () => {
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const calculateDeliveryFee = () => {
    return chef ? chef.deliveryFee : 0;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };
  
  // Изменение количества товара
  const updateQuantity = (itemId, change) => {
    const updatedItems = cart.items.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return null; // Удаляем товар, если количество <= 0
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean); // Удаляем null из массива
    
    const updatedCart = { 
      ...cart, 
      items: updatedItems,
      chefId: updatedItems.length > 0 ? cart.chefId : null 
    };
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  // Удаление товара из корзины
  const removeItem = (itemId) => {
    const updatedItems = cart.items.filter(item => item.id !== itemId);
    
    const updatedCart = { 
      ...cart, 
      items: updatedItems,
      chefId: updatedItems.length > 0 ? cart.chefId : null 
    };
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  // Очистка корзины
  const clearCart = () => {
    const emptyCart = { items: [], chefId: null };
    setCart(emptyCart);
    localStorage.setItem('cart', JSON.stringify(emptyCart));
  };
  
  // Обработчик перехода к оформлению заказа
  const proceedToCheckout = () => {
    if (cart.items.length === 0) {
      alert('Корзина пуста');
      return;
    }
    
    setStep(2);
  };
  
  // Обработчик выбора адреса доставки
  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
  };
  
  // Обработчик перехода к оплате
  const proceedToPayment = () => {
    if (!address) {
      alert('Пожалуйста, выберите адрес доставки');
      return;
    }
    
    setStep(3);
  };
  
  // Обработчик выбора метода оплаты
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };
  
  // Обработчик оформления заказа
  const placeOrder = async () => {
    try {
      setLoading(true);
      
      // Формируем данные заказа
      const orderData = {
        chefId: cart.chefId,
        items: cart.items.map(item => ({
          dishId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        address,
        deliveryTime,
        paymentMethod,
        note: orderNote,
        total: calculateTotal()
      };
      
      // Отправляем заказ на сервер
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Очищаем корзину
        clearCart();
        
        // Переходим на страницу отслеживания заказа
        navigate(`/orders/${result.orderId}/tracking`);
      } else {
        alert('Ошибка при оформлении заказа: ' + result.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      alert('Произошла ошибка при оформлении заказа');
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="cart-page">
      <div className="container">
        {/* Шаги оформления заказа */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Корзина</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Доставка</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Оплата</div>
          </div>
        </div>
        
        {/* Шаг 1: Корзина */}
        {step === 1 && (
          <div className="cart-container">
            <h1 className="page-title">Корзина</h1>
            
            {cart.items.length > 0 ? (
              <div className="cart-content">
                <div className="cart-items">
                  {chef && (
                    <div className="cart-chef-info">
                      <img src={chef.avatar} alt={chef.name} className="chef-thumbnail" />
                      <div className="chef-details">
                        <h3>{chef.name}</h3>
                        <p>{chef.cuisine}</p>
                      </div>
                    </div>
                  )}
                
                  {cart.items.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <div className="item-price">{item.price} ₽</div>
                      </div>
                      <div className="item-actions">
                        <div className="quantity-control">
                          <button 
                            className="quantity-button"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-button"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          className="remove-button"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="order-summary">
                  <h2>Сводка заказа</h2>
                  <div className="summary-content">
                    <div className="summary-row">
                      <span>Стоимость блюд</span>
                      <span>{calculateSubtotal()} ₽</span>
                    </div>
                    <div className="summary-row">
                      <span>Стоимость доставки</span>
                      <span>{calculateDeliveryFee()} ₽</span>
                    </div>
                    <div className="summary-total">
                      <span>Итого</span>
                      <span>{calculateTotal()} ₽</span>
                    </div>
                    
                    <button 
                      className="checkout-button"
                      onClick={proceedToCheckout}
                    >
                      Перейти к оформлению
                    </button>
                    
                    <button 
                      className="continue-shopping-button"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft size={16} />
                      Продолжить покупки
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-cart">
                <div className="empty-cart-icon">
                  <Truck size={64} />
                </div>
                <h2>Корзина пуста</h2>
                <p>Добавьте блюда в корзину, чтобы оформить заказ</p>
                <button 
                  className="continue-shopping-button"
                  onClick={() => navigate('/')}
                >
                  Перейти к выбору блюд
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Шаг 2: Доставка */}
        {step === 2 && (
          <div className="delivery-container">
            <button 
              className="back-button"
              onClick={() => setStep(1)}
            >
              <ArrowLeft size={16} />
              Вернуться в корзину
            </button>
            
            <h1 className="page-title">Доставка</h1>
            
            <div className="delivery-content">
              <div className="delivery-form">
                <div className="form-section">
                  <h3>
                    <MapPin size={18} className="section-icon" />
                    Адрес доставки
                  </h3>
                  <AddressSelector onSelect={handleAddressSelect} />
                </div>
                
                <div className="form-section">
                  <h3>
                    <Truck size={18} className="section-icon" />
                    Время доставки
                  </h3>
                  <div className="delivery-time-options">
                    <button 
                      className={`time-option ${deliveryTime === 'asap' ? 'active' : ''}`}
                      onClick={() => setDeliveryTime('asap')}
                    >
                      Как можно скорее
                    </button>
                    <button 
                      className={`time-option ${deliveryTime === 'scheduled' ? 'active' : ''}`}
                      onClick={() => setDeliveryTime('scheduled')}
                    >
                      Запланировать
                    </button>
                    
                    {deliveryTime === 'scheduled' && (
                      <div className="scheduled-time-selector">
                        {/* Здесь будет компонент выбора времени доставки */}
                        <select className="time-select">
                          <option>Сегодня, 14:00 - 14:30</option>
                          <option>Сегодня, 14:30 - 15:00</option>
                          <option>Сегодня, 15:00 - 15:30</option>
                          <option>Сегодня, 15:30 - 16:00</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-section">
                  <h3>Примечание к заказу</h3>
                  <textarea 
                    className="order-note" 
                    placeholder="Напишите, если у вас есть особые пожелания"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              <div className="order-summary">
                <h2>Сводка заказа</h2>
                <div className="summary-content">
                  {cart.items.map(item => (
                    <div key={item.id} className="summary-item">
                      <div className="summary-item-quantity">{item.quantity}×</div>
                      <div className="summary-item-name">{item.name}</div>
                      <div className="summary-item-price">{item.price * item.quantity} ₽</div>
                    </div>
                  ))}
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row">
                    <span>Стоимость блюд</span>
                    <span>{calculateSubtotal()} ₽</span>
                  </div>
                  <div className="summary-row">
                    <span>Стоимость доставки</span>
                    <span>{calculateDeliveryFee()} ₽</span>
                  </div>
                  <div className="summary-total">
                    <span>Итого</span>
                    <span>{calculateTotal()} ₽</span>
                  </div>
                  
                  <button 
                    className="checkout-button"
                    onClick={proceedToPayment}
                  >
                    Перейти к оплате
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Шаг 3: Оплата */}
        {step === 3 && (
          <div className="payment-container">
            <button 
              className="back-button"
              onClick={() => setStep(2)}
            >
              <ArrowLeft size={16} />
              Вернуться к доставке
            </button>
            
            <h1 className="page-title">Оплата</h1>
            
            <div className="payment-content">
              <div className="payment-form">
                <div className="form-section">
                  <h3>
                    <CreditCard size={18} className="section-icon" />
                    Способ оплаты
                  </h3>
                  <PaymentMethod onSelect={handlePaymentMethodSelect} />
                </div>
              </div>
              
              <div className="order-summary">
                <h2>Сводка заказа</h2>
                <div className="summary-content">
                  {cart.items.map(item => (
                    <div key={item.id} className="summary-item">
                      <div className="summary-item-quantity">{item.quantity}×</div>
                      <div className="summary-item-name">{item.name}</div>
                      <div className="summary-item-price">{item.price * item.quantity} ₽</div>
                    </div>
                  ))}
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row">
                    <span>Стоимость блюд</span>
                    <span>{calculateSubtotal()} ₽</span>
                  </div>
                  <div className="summary-row">
                    <span>Стоимость доставки</span>
                    <span>{calculateDeliveryFee()} ₽</span>
                  </div>
                  <div className="summary-total">
                    <span>Итого</span>
                    <span>{calculateTotal()} ₽</span>
                  </div>
                  
                  <button 
                    className="place-order-button"
                    onClick={placeOrder}
                  >
                    Оформить заказ
                  </button>
                  
                  <div className="terms-agreement">
                    Нажимая кнопку "Оформить заказ", вы соглашаетесь с 
                    <a href="/terms" className="terms-link">Условиями использования</a> и
                    <a href="/privacy" className="terms-link">Политикой конфиденциальности</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;