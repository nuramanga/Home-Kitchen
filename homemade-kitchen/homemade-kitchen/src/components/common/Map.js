import React from 'react';
import './Map.css';

const Map = ({ center, zoom = 13, radius, deliveryLocation, courierLocation, chefLocation }) => {
  // В реальном приложении здесь будет интеграция с Google Maps или другим API карт
  // Поскольку мы не можем подключить настоящие карты, создадим простое представление
  
  return (
    <div className="map-container">
      <div className="mock-map">
        <div className="map-info">
          <h3>Карта</h3>
          <p>Центр карты: {center.lat.toFixed(6)}, {center.lng.toFixed(6)}</p>
          <p>Масштаб: {zoom}</p>
          
          {radius && <p>Радиус доставки: {radius} км</p>}
          
          {chefLocation && (
            <div className="map-marker chef-marker">
              <span>🏠 Повар</span>
              <span className="marker-coords">
                ({chefLocation.lat.toFixed(4)}, {chefLocation.lng.toFixed(4)})
              </span>
            </div>
          )}
          
          {deliveryLocation && (
            <div className="map-marker delivery-marker">
              <span>📍 Адрес доставки</span>
              <span className="marker-coords">
                ({deliveryLocation.lat.toFixed(4)}, {deliveryLocation.lng.toFixed(4)})
              </span>
            </div>
          )}
          
          {courierLocation && (
            <div className="map-marker courier-marker">
              <span>🚚 Курьер</span>
              <span className="marker-coords">
                ({courierLocation.lat.toFixed(4)}, {courierLocation.lng.toFixed(4)})
              </span>
            </div>
          )}
        </div>
        
        <div className="map-note">
          В реальном приложении здесь будет интерактивная карта
        </div>
      </div>
    </div>
  );
};

export default Map;