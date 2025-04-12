import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle } from 'lucide-react';
import './PaymentMethod.css';

const PaymentMethod = ({ onSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  
  const handleSelect = (method) => {
    setSelectedMethod(method);
    onSelect && onSelect(method);
  };
  
  return (
    <div className="payment-method">
      <div 
        className={`payment-option ${selectedMethod === 'card' ? 'selected' : ''}`}
        onClick={() => handleSelect('card')}
      >
        <div className="payment-option-icon">
          <CreditCard size={24} />
        </div>
        <div className="payment-option-details">
          <div className="payment-option-title">Банковская карта</div>
          <div className="payment-option-description">Visa, Mastercard, МИР</div>
        </div>
        {selectedMethod === 'card' && (
          <div className="payment-selected-indicator">
            <CheckCircle size={20} />
          </div>
        )}
      </div>
      
      <div 
        className={`payment-option ${selectedMethod === 'cash' ? 'selected' : ''}`}
        onClick={() => handleSelect('cash')}
      >
        <div className="payment-option-icon">
          <DollarSign size={24} />
        </div>
        <div className="payment-option-details">
          <div className="payment-option-title">Наличными при получении</div>
          <div className="payment-option-description">Оплата курьеру</div>
        </div>
        {selectedMethod === 'cash' && (
          <div className="payment-selected-indicator">
            <CheckCircle size={20} />
          </div>
        )}
      </div>
      
      {selectedMethod === 'card' && (
        <div className="card-details">
          <div className="card-input-group">
            <label>Номер карты</label>
            <input 
              type="text" 
              placeholder="0000 0000 0000 0000" 
              maxLength="19"
              className="card-number-input"
            />
          </div>
          
          <div className="card-row">
            <div className="card-input-group">
              <label>Срок действия</label>
              <input 
                type="text" 
                placeholder="ММ/ГГ" 
                maxLength="5"
                className="card-expiry-input"
              />
            </div>
            
            <div className="card-input-group">
              <label>CVV</label>
              <input 
                type="password" 
                placeholder="***" 
                maxLength="3"
                className="card-cvv-input"
              />
            </div>
          </div>
          
          <div className="card-input-group">
            <label>Имя владельца</label>
            <input 
              type="text" 
              placeholder="IVAN IVANOV" 
              className="card-name-input"
            />
          </div>
          
          <div className="save-card-option">
            <input type="checkbox" id="save-card" />
            <label htmlFor="save-card">Сохранить карту для будущих оплат</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;