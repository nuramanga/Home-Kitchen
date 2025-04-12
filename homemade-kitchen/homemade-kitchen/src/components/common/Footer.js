import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-logo">Домашняя Кухня</h3>
            <p className="footer-description">
              Платформа, объединяющая самозанятых поваров и любителей домашней еды
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Для клиентов</h4>
              <ul>
                <li><a href="/how-to-order">Как сделать заказ</a></li>
                <li><a href="/payment">Способы оплаты</a></li>
                <li><a href="/delivery">Доставка</a></li>
                <li><a href="/faq">Вопросы и ответы</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Для поваров</h4>
              <ul>
                <li><a href="/become-chef">Как начать готовить</a></li>
                <li><a href="/rules">Правила площадки</a></li>
                <li><a href="/fees">Тарифы и комиссии</a></li>
                <li><a href="/chef-help">Помощь поварам</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Компания</h4>
              <ul>
                <li><a href="/about">О нас</a></li>
                <li><a href="/blog">Блог</a></li>
                <li><a href="/contacts">Контакты</a></li>
                <li><a href="/careers">Карьера</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© 2025 Домашняя Кухня. Все права защищены.</p>
          <div className="legal-links">
            <a href="/privacy">Политика конфиденциальности</a>
            <a href="/terms">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;