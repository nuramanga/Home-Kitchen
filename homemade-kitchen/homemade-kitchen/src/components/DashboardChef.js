import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Menu, Clock, Package, Truck, CreditCard, PieChart, Calendar, Bell, Settings, LogOut, Edit, Trash2, Plus, Eye, Check, X, MoreHorizontal, Filter, Search, Star } from 'lucide-react';
import './DashboardChef.css';

// Импорт компонентов
import Loader from './common/Loader';
import StatCard from './common/StatCard';
import Chart from './common/Chart';

const DashboardChef = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chef, setChef] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [stats, setStats] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Запрос данных повара
        const chefResponse = await fetch('/api/chef/profile');
        const chefData = await chefResponse.json();
        setChef(chefData);
        
        // Запрос заказов
        const ordersResponse = await fetch('/api/chef/orders');
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        
        // Запрос блюд
        const dishesResponse = await fetch('/api/chef/dishes');
        const dishesData = await dishesResponse.json();
        setDishes(dishesData);
        
        // Запрос статистики
        const statsResponse = await fetch('/api/chef/stats');
        const statsData = await statsResponse.json();
        setStats(statsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Обработчик изменения статуса заказа
  const handleOrderStatusChange = async (orderId, status) => {
    try {
      const response = await fetch(`/api/chef/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        // Обновление статуса заказа в списке заказов
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status } : order
          )
        );
      } else {
        alert('Ошибка при изменении статуса заказа');
      }
    } catch (error) {
      console.error('Ошибка при изменении статуса заказа:', error);
      alert('Произошла ошибка при изменении статуса заказа');
    }
  };
  
  // Обработчик изменения доступности блюда
  const handleDishAvailabilityChange = async (dishId, isAvailable) => {
    try {
      const response = await fetch(`/api/chef/dishes/${dishId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable }),
      });
      
      if (response.ok) {
        // Обновление доступности блюда в списке блюд
        setDishes(prevDishes => 
          prevDishes.map(dish => 
            dish.id === dishId ? { ...dish, isAvailable } : dish
          )
        );
      } else {
        alert('Ошибка при изменении доступности блюда');
      }
    } catch (error) {
      console.error('Ошибка при изменении доступности блюда:', error);
      alert('Произошла ошибка при изменении доступности блюда');
    }
  };
  
  // Обработчик удаления блюда
  const handleDeleteDish = async (dishId) => {
    if (window.confirm('Вы уверены, что хотите удалить это блюдо?')) {
      try {
        const response = await fetch(`/api/chef/dishes/${dishId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Удаление блюда из списка блюд
          setDishes(prevDishes => prevDishes.filter(dish => dish.id !== dishId));
        } else {
          alert('Ошибка при удалении блюда');
        }
      } catch (error) {
        console.error('Ошибка при удалении блюда:', error);
        alert('Произошла ошибка при удалении блюда');
      }
    }
  };
  
  // Получение текстового представления статуса заказа
  const getOrderStatusText = (status) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'confirmed': return 'Подтвержден';
      case 'cooking': return 'Готовится';
      case 'ready': return 'Готов';
      case 'delivering': return 'Доставляется';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return 'Неизвестно';
    }
  };
  
  // Получение класса для отображения статуса заказа
  const getOrderStatusClass = (status) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'confirmed': return 'status-confirmed';
      case 'cooking': return 'status-cooking';
      case 'ready': return 'status-ready';
      case 'delivering': return 'status-delivering';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };
  
  // Получение иконки для статуса заказа
  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Bell size={16} />;
      case 'confirmed': return <Check size={16} />;
      case 'cooking': return <ChefHat size={16} />;
      case 'ready': return <Package size={16} />;
      case 'delivering': return <Truck size={16} />;
      case 'delivered': return <Check size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return null;
    }
  };
  
  // Фильтрация заказов по статусу
  const getFilteredOrders = (status) => {
    if (status === 'active') {
      return orders.filter(order => 
        ['new', 'confirmed', 'cooking', 'ready'].includes(order.status)
      );
    }
    
    if (status === 'completed') {
      return orders.filter(order => 
        ['delivered', 'cancelled'].includes(order.status)
      );
    }
    
    return orders;
  };
  
  // Отображение меню для мобильных устройств
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="dashboard-page">
      {/* Боковое меню */}
      <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">Домашняя Кухня</h1>
          <span className="sidebar-subtitle">Панель повара</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <PieChart size={20} className="nav-icon" />
            <span>Дашборд</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Clock size={20} className="nav-icon" />
            <span>Заказы</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <Menu size={20} className="nav-icon" />
            <span>Меню</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={20} className="nav-icon" />
            <span>Расписание</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            <CreditCard size={20} className="nav-icon" />
            <span>Доход</span>
          </button>
          
          <div className="nav-divider"></div>
          
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} className="nav-icon" />
            <span>Настройки</span>
          </button>
          
          <button className="nav-item">
            <LogOut size={20} className="nav-icon" />
            <span>Выход</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="chef-profile">
            <img src={chef?.avatar} alt={chef?.name} className="chef-avatar" />
            <div>
              <div className="chef-name">{chef?.name}</div>
              <div className="chef-status online">Онлайн</div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Основное содержимое */}
      <main className="main-content">
        {/* Верхняя панель */}
        <header className="dashboard-header">
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
          
          <h1 className="page-title">
            {activeTab === 'dashboard' && 'Дашборд'}
            {activeTab === 'orders' && 'Управление заказами'}
            {activeTab === 'menu' && 'Управление меню'}
            {activeTab === 'schedule' && 'Расписание работы'}
            {activeTab === 'earnings' && 'Доход и финансы'}
            {activeTab === 'settings' && 'Настройки профиля'}
          </h1>
          
          <div className="header-actions">
            <button className="header-button">
              <Bell size={20} />
            </button>
            <div className="online-status-toggle">
              <span>Статус:</span>
              <span className="status-badge online">Онлайн</span>
            </div>
          </div>
        </header>
        
        {/* Содержимое дашборда */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <StatCard 
                title="Заказов сегодня" 
                value={stats.ordersToday || 0} 
                icon={<Clock size={24} />} 
                color="blue"
              />
              <StatCard 
                title="Активных заказов" 
                value={stats.activeOrders || 0} 
                icon={<ChefHat size={24} />} 
                color="orange"
              />
              <StatCard 
                title="Выручка сегодня" 
                value={`${stats.revenueToday || 0} ₽`} 
                icon={<CreditCard size={24} />} 
                color="green"
              />
              <StatCard 
                title="Рейтинг" 
                value={stats.rating?.toFixed(1) || 0} 
                icon={<Star size={24} />} 
                color="yellow"
              />
            </div>
            
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <h2 className="card-title">Новые заказы</h2>
                  <Link to="#" className="card-link">Все заказы</Link>
                </div>
                <div className="card-content">
                  {getFilteredOrders('active').length > 0 ? (
                    <div className="orders-list">
                      {getFilteredOrders('active').slice(0, 5).map(order => (
                        <div key={order.id} className="order-item">
                          <div className="order-main-info">
                            <div className="order-number">#{order.number}</div>
                            <div className={`order-status ${getOrderStatusClass(order.status)}`}>
                              {getOrderStatusIcon(order.status)}
                              {getOrderStatusText(order.status)}
                            </div>
                          </div>
                          <div className="order-details">
                            <div className="order-customer">{order.customer?.name}</div>
                            <div className="order-time">{order.createdAt}</div>
                            <div className="order-items-preview">
                              {order.items.map(item => item.name).join(', ')}
                            </div>
                          </div>
                          <div className="order-actions">
                            <span className="order-price">{order.total} ₽</span>
                            <button className="action-button primary">
                              {order.status === 'new' && 'Принять'}
                              {order.status === 'confirmed' && 'Начать готовить'}
                              {order.status === 'cooking' && 'Готово'}
                              {order.status === 'ready' && 'Передать курьеру'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <Package size={48} />
                      </div>
                      <h3>Нет активных заказов</h3>
                      <p>У вас пока нет новых заказов</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="dashboard-card">
                <div className="card-header">
                  <h2 className="card-title">Аналитика продаж</h2>
                  <div className="time-filter">
                    <button className="time-option active">Неделя</button>
                    <button className="time-option">Месяц</button>
                    <button className="time-option">Год</button>
                  </div>
                </div>
                <div className="card-content">
                  <Chart 
                    type="line"
                    data={stats.salesChart}
                    height={250}
                  />
                </div>
              </div>
              
              <div className="dashboard-card">
                <div className="card-header">
                  <h2 className="card-title">Популярные блюда</h2>
                </div>
                <div className="card-content">
                  {dishes.length > 0 ? (
                    <div className="popular-dishes">
                      {dishes
                        .sort((a, b) => b.orderCount - a.orderCount)
                        .slice(0, 5)
                        .map(dish => (
                          <div key={dish.id} className="popular-dish">
                            <img src={dish.image} alt={dish.name} className="dish-image" />
                            <div className="dish-info">
                              <div className="dish-name">{dish.name}</div>
                              <div className="dish-price">{dish.price} ₽</div>
                            </div>
                            <div className="dish-stats">
                              <div className="dish-orders">{dish.orderCount} заказов</div>
                              <div className="dish-rating">
                                <Star size={14} className="rating-star" />
                                {dish.rating?.toFixed(1) || 0}
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <Menu size={48} />
                      </div>
                      <h3>Нет блюд</h3>
                      <p>Добавьте блюда в ваше меню</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="dashboard-card">
                <div className="card-header">
                  <h2 className="card-title">Последние отзывы</h2>
                  <Link to="#" className="card-link">Все отзывы</Link>
                </div>
                <div className="card-content">
                  {stats.recentReviews && stats.recentReviews.length > 0 ? (
                    <div className="reviews-list">
                      {stats.recentReviews.slice(0, 3).map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <div className="reviewer-name">{review.customer?.name}</div>
                              <div className="review-date">{review.createdAt}</div>
                            </div>
                            <div className="review-rating">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i}
                                  size={16}
                                  className={`rating-star ${i < review.rating ? 'filled' : ''}`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="review-content">
                            <p>{review.comment}</p>
                          </div>
                          <div className="review-dishes">
                            <span className="dishes-label">Заказанные блюда:</span>
                            <span className="dishes-list">{review.dishes.join(', ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <Star size={48} />
                      </div>
                      <h3>Нет отзывов</h3>
                      <p>У вас пока нет отзывов</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Содержимое страницы заказов */}
        {activeTab === 'orders' && (
          <div className="orders-content">
            <div className="orders-filters">
              <div className="filters-group">
                <button className="filter-button active">Все</button>
                <button className="filter-button">Новые</button>
                <button className="filter-button">Готовятся</button>
                <button className="filter-button">Готовы</button>
                <button className="filter-button">Доставляются</button>
                <button className="filter-button">Доставлены</button>
                <button className="filter-button">Отменены</button>
              </div>
              
              <div className="search-container">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Поиск заказов..." 
                />
              </div>
            </div>
            
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>№ заказа</th>
                    <th>Клиент</th>
                    <th>Детали заказа</th>
                    <th>Стоимость</th>
                    <th>Дата и время</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.number}</td>
                        <td>{order.customer?.name}</td>
                        <td>
                          <div className="order-items-cell">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="order-item-row">
                                {item.quantity}× {item.name}
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="more-items">И еще {order.items.length - 2} блюда</div>
                            )}
                          </div>
                        </td>
                        <td>{order.total} ₽</td>
                        <td>
                          <div>{order.createdAt.split(' ')[0]}</div>
                          <div className="time-small">{order.createdAt.split(' ')[1]}</div>
                        </td>
                        <td>
                          <div className={`table-status ${getOrderStatusClass(order.status)}`}>
                            {getOrderStatusText(order.status)}
                          </div>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="table-action-button">
                              <Eye size={16} />
                            </button>
                            
                            {order.status === 'new' && (
                              <>
                                <button 
                                  className="table-action-button accept"
                                  onClick={() => handleOrderStatusChange(order.id, 'confirmed')}
                                >
                                  <Check size={16} />
                                </button>
                                <button 
                                  className="table-action-button reject"
                                  onClick={() => handleOrderStatusChange(order.id, 'cancelled')}
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                            
                            {order.status === 'confirmed' && (
                              <button 
                                className="table-action-button accept"
                                onClick={() => handleOrderStatusChange(order.id, 'cooking')}
                              >
                                <ChefHat size={16} />
                              </button>
                            )}
                            
                            {order.status === 'cooking' && (
                              <button 
                                className="table-action-button accept"
                                onClick={() => handleOrderStatusChange(order.id, 'ready')}
                              >
                                <Package size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-table-message">
                        Нет заказов для отображения
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Содержимое страницы меню */}
        {activeTab === 'menu' && (
          <div className="menu-content">
            <div className="menu-actions">
              <div className="left-actions">
                <div className="search-container">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Поиск блюд..." 
                  />
                </div>
                <button className="filter-btn">
                  <Filter size={18} />
                  Фильтры
                </button>
              </div>
              
              <button className="add-dish-button" onClick={() => navigate('/chef/dishes/new')}>
                <Plus size={18} />
                Добавить блюдо
              </button>
            </div>
            
            <div className="dishes-grid">
              {dishes.length > 0 ? (
                dishes.map(dish => (
                  <div key={dish.id} className="dish-card">
                    <div className="dish-header">
                      <div className="dish-status">
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={dish.isAvailable} 
                            onChange={() => handleDishAvailabilityChange(dish.id, !dish.isAvailable)}
                          />
                          <span className="slider"></span>
                        </label>
                        <span className={`status-text ${dish.isAvailable ? 'available' : 'unavailable'}`}>
                          {dish.isAvailable ? 'Доступно' : 'Недоступно'}
                        </span>
                      </div>
                      <div className="dish-actions">
                        <button className="dish-action-btn" onClick={() => navigate(`/chef/dishes/${dish.id}/edit`)}>
                          <Edit size={16} />
                        </button>
                        <button className="dish-action-btn" onClick={() => handleDeleteDish(dish.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="dish-image-container">
                      <img src={dish.image} alt={dish.name} className="dish-image" />
                    </div>
                    
                    <div className="dish-content">
                      <h3 className="dish-name">{dish.name}</h3>
                      <div className="dish-category">{dish.category}</div>
                      <div className="dish-meta">
                        <div className="dish-price">{dish.price} ₽</div>
                        <div className="dish-rating">
                          <Star size={14} className="rating-star filled" />
                          {dish.rating?.toFixed(1) || 0}
                        </div>
                      </div>
                      <div className="dish-description">{dish.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-dishes">
                  <div className="empty-icon">
                    <Menu size={64} />
                  </div>
                  <h3>Ваше меню пусто</h3>
                  <p>Добавьте блюда, чтобы начать принимать заказы</p>
                  <button className="add-dish-button" onClick={() => navigate('/chef/dishes/new')}>
                    <Plus size={18} />
                    Добавить блюдо
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Содержимое остальных вкладок */}
        {(activeTab === 'schedule' || activeTab === 'earnings' || activeTab === 'settings') && (
          <div className="placeholder-content">
            <div className="placeholder-icon">
              {activeTab === 'schedule' && <Calendar size={64} />}
              {activeTab === 'earnings' && <CreditCard size={64} />}
              {activeTab === 'settings' && <Settings size={64} />}
            </div>
            <h2>Раздел находится в разработке</h2>
            <p>Этот функционал будет доступен в ближайшее время</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardChef;