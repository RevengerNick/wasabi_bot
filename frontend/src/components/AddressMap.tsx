// src/components/AddressMap.tsx
import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useDebouncedCallback } from 'use-debounce';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Начальные координаты (например, центр Ташкента)
const initialCenter = {
  lat: 41.2995,
  lng: 69.2401
};

interface AddressMapProps {
  onLocationChange: (lat: number, lng: number) => void;
}

export interface AddressMapRef {
  panToCurrentUserLocation: () => void;
}

const AddressMap = forwardRef<AddressMapRef, AddressMapProps>(({ onLocationChange }, ref) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!, // Ключ из .env файла
  });

  const [center, setCenter] = useState(initialCenter);

  // Debounced-функция для вызова onLocationChange
  const debouncedLocationChange = useDebouncedCallback((lat, lng) => {
    onLocationChange(lat, lng);
  }, 1000); // Задержка в 1 секунду

  const handleCenterChanged = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter()?.toJSON();
      if (newCenter) {
        setCenter(newCenter);
        debouncedLocationChange(newCenter.lat, newCenter.lng);
      }
    }
  };

  const mapRef = React.useRef<google.maps.Map | null>(null);
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

const panToCurrentUserLocation = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapRef.current?.panTo(pos); // panTo - плавно перемещает карту
          setCenter(pos);
          onLocationChange(pos.lat, pos.lng); // Сразу определяем адрес
        },
        () => {
          alert('Не удалось получить вашу геолокацию. Проверьте разрешения в браузере.');
        }
      );
    }
  };
  
  // "Пробрасываем" эту функцию наружу через ref
  useImperativeHandle(ref, () => ({
    panToCurrentUserLocation,
  }));

  if (loadError) return <div>Ошибка загрузки карты</div>;
  if (!isLoaded) return <div>Загрузка карты...</div>;

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDragEnd={handleCenterChanged} // Вызывается после окончания перетаскивания
        options={{
          disableDefaultUI: true, // Убираем стандартные кнопки Google
          zoomControl: true,
        }}
      >
      </GoogleMap>
      {/* Маркер, прибитый к центру экрана */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-12 h-12 flex items-center justify-center">
            {/* Можно использовать кастомную иконку маркера */}
            <span className="text-4xl">📍</span>
        </div>
      </div>
    </div>
  );
});

export default AddressMap;