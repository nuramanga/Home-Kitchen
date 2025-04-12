import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Home, Building, Edit, Trash2 } from 'lucide-react';
import './AddressSelector.css';

const AddressSelector = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: '',
    street: '',
    house: '',
    apartment: '',
    entrance: '',
    floor: '',
    comment: ''
  });

  // Загрузка сохраненных адресов (имитация)
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    const savedAddresses = [
      {
        id: 1,
        title: 'Дом',
        street: 'ул. Ленина',
        house: '25',
        apartment: '42',
        entrance: '3',
        floor: '5',
        comment: 'Код от подъезда: 1234'
      },
      {
        id: 2,
        title: 'Работа',
        street: 'пр. Мира',
        house: '10',
        apartment: '',
        entrance: '',
        floor: '2',
        comment: 'БЦ "Горизонт", офис 210'
      }
    ];
    
    setAddresses(savedAddresses);
    
    // Выбираем первый адрес по умолчанию
    if (savedAddresses.length > 0) {
      setSelectedAddress(savedAddresses[0]);
      onSelect && onSelect(savedAddresses[0]);
    }
  }, [onSelect]);

  // Выбор адреса
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    onSelect && onSelect(address);
  };

  // Добавление нового адреса
  const handleAddAddress = (e) => {
    e.preventDefault();
    
    const newAddrWithId = {
      ...newAddress,
      id: addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1
    };
    
    const updatedAddresses = [...addresses, newAddrWithId];
    setAddresses(updatedAddresses);
    setSelectedAddress(newAddrWithId);
    onSelect && onSelect(newAddrWithId);
    setShowAddForm(false);
    setNewAddress({ title: '', street: '', house: '', apartment: '', entrance: '', floor: '', comment: '' });
  };

  // Удаление адреса
  const handleRemoveAddress = (addressId) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    setAddresses(updatedAddresses);
    
    if (selectedAddress && selectedAddress.id === addressId) {
      if (updatedAddresses.length > 0) {
        setSelectedAddress(updatedAddresses[0]);
        onSelect && onSelect(updatedAddresses[0]);
      } else {
        setSelectedAddress(null);
        onSelect && onSelect(null);
      }
    }
  };

  // Обновление полей нового адреса
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  return (
    <div className="address-selector">
      {/* Список сохраненных адресов */}
      {addresses.length > 0 && (
        <div className="saved-addresses">
          {addresses.map(address => (
            <div 
              key={address.id} 
              className={`address-item ${selectedAddress && selectedAddress.id === address.id ? 'selected' : ''}`}
              onClick={() => handleSelectAddress(address)}
            >
              <div className="address-item-icon">
                {address.title === 'Дом' ? <Home size={18} /> : <Building size={18} />}
              </div>
              <div className="address-item-details">
                <div className="address-item-title">{address.title}</div>
                <div className="address-item-text">
                  {address.street}, д. {address.house}
                  {address.apartment && `, кв. ${address.apartment}`}
                </div>
              </div>
              <div className="address-item-actions">
                <button className="address-action-btn edit">
                  <Edit size={16} />
                </button>
                <button 
                  className="address-action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAddress(address.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Кнопка добавления нового адреса */}
      {!showAddForm && (
        <button 
          className="add-address-button"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={18} />
          Добавить новый адрес
        </button>
      )}
      
      {/* Форма добавления нового адреса */}
      {showAddForm && (
        <form className="address-form" onSubmit={handleAddAddress}>
          <div className="form-title">Добавление нового адреса</div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Название адреса</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Например: Дом, Работа"
                value={newAddress.title}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="street">Улица</label>
              <input
                type="text"
                id="street"
                name="street"
                placeholder="Введите название улицы"
                value={newAddress.street}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="house">Дом</label>
              <input
                type="text"
                id="house"
                name="house"
                placeholder="Номер дома"
                value={newAddress.house}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="apartment">Квартира/Офис</label>
              <input
                type="text"
                id="apartment"
                name="apartment"
                placeholder="Номер квартиры"
                value={newAddress.apartment}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="entrance">Подъезд</label>
              <input
                type="text"
                id="entrance"
                name="entrance"
                placeholder="Номер подъезда"
                value={newAddress.entrance}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="floor">Этаж</label>
              <input
                type="text"
                id="floor"
                name="floor"
                placeholder="Этаж"
                value={newAddress.floor}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="comment">Комментарий</label>
              <textarea
                id="comment"
                name="comment"
                placeholder="Код домофона, ориентиры и т.д."
                value={newAddress.comment}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setShowAddForm(false)}
            >
              Отмена
            </button>
            <button type="submit" className="save-button">Сохранить адрес</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressSelector;