// frontend/src/pages/AddressSelectorPage.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressMap, { type AddressMapRef } from '../components/AddressMap';
import { FiCheck, FiCrosshair } from 'react-icons/fi';
import { useCheckoutStore } from '../store/checkoutStore';

const AddressSelectorPage: React.FC = () => {
    const [currentAddress, setCurrentAddress] = useState('Переместите карту...');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const setSelectedAddress = useCheckoutStore((state) => state.setSelectedAddress);
    const navigate = useNavigate();
    
    // Создаем ref для доступа к методам дочернего компонента AddressMap
    const mapRef = useRef<AddressMapRef>(null);

    const handleLocationChange = async (lat: number, lng: number) => {
        setIsGeocoding(true);
        try {
            const address = `Координаты: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setCurrentAddress(address);
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleConfirmLocation = () => {
        setSelectedAddress(currentAddress);
        navigate(-1);
    };

    // --- НОВАЯ ФУНКЦИЯ ---
    // Вызывает метод дочернего компонента через ref
    const handleGoToMyLocation = () => {
        mapRef.current?.panToCurrentUserLocation();
    };

    return (
        <div className="relative w-full h-full">
            {/* Верхний блок с адресом */}
            <div className="absolute top-4 left-4 right-4 z-10 bg-white p-3 rounded-lg shadow-lg text-center">
                <p className="font-semibold text-brand-dark truncate">
                    {isGeocoding ? 'Определение адреса...' : currentAddress}
                </p>
            </div>

            {/* Карта */}
            <div className="w-full h-full">
                <AddressMap ref={mapRef} onLocationChange={handleLocationChange} />
            </div>

            {/* --- НОВЫЙ ИНТЕРФЕЙС УПРАВЛЕНИЯ --- */}
            {/* Контейнер для кнопок внизу */}
            <div className="absolute bottom-6 right-4 left-4 z-10 flex flex-col items-end gap-3">
                
                {/* Кнопка "Мое местоположение" */}
                <button 
                    onClick={handleGoToMyLocation}
                    className="bg-white p-3 rounded-full shadow-lg mb-10 text-brand-dark"
                >
                    <FiCrosshair size={24}/>
                </button>

                {/* Кнопка "Подтвердить" стала компактнее */}
                <button 
                    onClick={handleConfirmLocation}
                    className="w-11/12 bg-brand-green mx-auto text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg"
                >
                    <FiCheck />
                    Подтвердить
                </button>
            </div>
        </div>
    );
};

export default AddressSelectorPage;