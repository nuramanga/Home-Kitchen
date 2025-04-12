// src/mockData.js

// Моковые данные для поваров
export const chefs = [
    {
      id: 1,
      name: 'Мария К.',
      cuisine: 'Итальянская',
      rating: 4.9,
      reviewsCount: 42,
      address: 'ул. Пушкина, 10',
      deliveryTime: 45,
      description: 'Готовлю блюда итальянской кухни по семейным рецептам',
      avatar: '/images/chefs/maria.jpg',
      coverImage: '/images/covers/italian.jpg',
      location: { lat: 55.751244, lng: 37.618423 },
      deliveryRadius: 5,
      deliveryFee: 200,
      phone: '+7 (900) 123-45-67',
      workingHours: [
        { day: 'Пн-Пт', hours: '10:00 - 20:00' },
        { day: 'Сб-Вс', hours: '11:00 - 19:00' }
      ]
    },
    // Добавьте больше поваров...
  ];
  
  // Моковые данные для блюд
  export const dishes = [
    {
      id: 1,
      name: 'Домашняя паста карбонара',
      description: 'Классическая итальянская паста с беконом, яйцом и сыром',
      price: 450,
      image: '/images/dishes/carbonara.jpg',
      category: 'Основные блюда',
      chefId: 1,
      isAvailable: true,
      rating: 4.8,
      orderCount: 123
    },
    // Добавьте больше блюд...
  ];
  
  // Моковые данные для заказов
  export const orders = [
    {
      id: 1,
      number: '10045',
      customer: { id: 1, name: 'Анна М.' },
      items: [
        { id: 1, name: 'Домашняя паста карбонара', quantity: 2, price: 450 },
        { id: 2, name: 'Тирамису', quantity: 1, price: 350 }
      ],
      status: 'cooking',
      total: 1250,
      subtotal: 1050,
      deliveryFee: 200,
      createdAt: '10 апр 2025 14:30',
      // Дополнительные данные для отслеживания заказа
      confirmedAt: '10 апр 14:35',
      cookingStartedAt: '10 апр 14:40',
      readyAt: null,
      deliveryStartedAt: null,
      deliveredAt: null,
      estimatedDeliveryTime: '2025-04-10T15:30:00',
      chef: chefs[0],
      deliveryAddress: {
        street: 'ул. Ленина, 25, кв. 42',
        details: 'Код от подъезда: 1234',
        city: 'Москва',
        location: { lat: 55.755826, lng: 37.617300 }
      },
      paymentMethod: 'card'
    },
    // Добавьте больше заказов...
  ];
  
  // Моковые статистические данные для повара
  export const chefStats = {
    ordersToday: 8,
    activeOrders: 3,
    revenueToday: 5200,
    rating: 4.7,
    salesChart: [
      { name: 'Пн', sales: 2400 },
      { name: 'Вт', sales: 1398 },
      { name: 'Ср', sales: 9800 },
      { name: 'Чт', sales: 3908 },
      { name: 'Пт', sales: 4800 },
      { name: 'Сб', sales: 3800 },
      { name: 'Вс', sales: 4300 }
    ],
    recentReviews: [
      {
        id: 1,
        customer: { name: 'Иван С.' },
        rating: 5,
        comment: 'Очень вкусно! Доставка была быстрой, еда горячей.',
        createdAt: '09 апр 2025',
        dishes: ['Паста карбонара', 'Тирамису']
      },
      // Добавьте больше отзывов...
    ]
  };
  
  // Имитация API-запросов
  export const fetchData = (endpoint) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (endpoint) {
          case '/api/chefs/popular':
            resolve(chefs.slice(0, 3));
            break;
          case '/api/dishes/popular':
            resolve(dishes.slice(0, 6));
            break;
          case '/api/categories':
            resolve(['Итальянская', 'Русская', 'Азиатская', 'Вегетарианская']);
            break;
          default:
            if (endpoint.startsWith('/api/chefs/')) {
              const id = parseInt(endpoint.split('/').pop());
              resolve(chefs.find(chef => chef.id === id));
            } else if (endpoint.startsWith('/api/chefs/') && endpoint.includes('/dishes')) {
              const chefId = parseInt(endpoint.split('/')[3]);
              resolve(dishes.filter(dish => dish.chefId === chefId));
            } else if (endpoint.startsWith('/api/orders/')) {
              const id = parseInt(endpoint.split('/').pop());
              resolve(orders.find(order => order.id === id));
            } else if (endpoint === '/api/chef/profile') {
              resolve(chefs[0]); // Используем первого повара как текущего
            } else if (endpoint === '/api/chef/orders') {
              resolve(orders);
            } else if (endpoint === '/api/chef/dishes') {
              resolve(dishes.filter(dish => dish.chefId === chefs[0].id));
            } else if (endpoint === '/api/chef/stats') {
              resolve(chefStats);
            }
            break;
        }
      }, 500); // Имитация задержки сети
    });
  };