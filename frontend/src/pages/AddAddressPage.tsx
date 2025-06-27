import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AddressMap, { type AddressMapRef } from '../components/AddressMap';
import { useAddressStore } from '../store/addressStore';
import { FiCheck, FiCrosshair } from 'react-icons/fi';

const AddAddressPage: React.FC = () => {
    const navigate = useNavigate();
    const addAddress = useAddressStore(state => state.addAddress);
    const mapRef = useRef<AddressMapRef>(null);

    const [addressName, setAddressName] = useState('');
    const [fullAddress, setFullAddress] = useState('Переместите карту...');
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLocationChange = (lat: number, lng: number) => {
        setCoords({ lat, lng });
        setFullAddress(`Координаты: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    };

    const handleSave = async () => {
        if (!addressName || !coords) {
            alert('Пожалуйста, укажите название адреса и выберите точку на карте.');
            return;
        }
        setLoading(true);
        await addAddress({
            name: addressName,
            fullAddress: fullAddress,
            latitude: coords.lat,
            longitude: coords.lng,
        });
        setLoading(false);
        navigate(-1);
    };
    
    const handleGoToMyLocation = () => {
        mapRef.current?.panToCurrentUserLocation();
    };

    return (
        // Главный контейнер, который занимает весь экран
        <div className="flex flex-col h-screen bg-gray-50 relative">
            
            <Header title="Новый адрес" showBackButton={true} />
            
            <div className="p-4 bg-white border-b z-10"> {/* z-10 чтобы было над картой */}
                <label className="text-sm font-medium">Название адреса</label>
                <input 
                    value={addressName}
                    onChange={e => setAddressName(e.target.value)}
                    placeholder="Например: Дом или Работа"
                    className="w-full mt-1 p-2 border rounded-md"
                />
            </div>

            {/* Контейнер для карты, который занимает все оставшееся место */}
            <div className="flex-grow relative max-h-120">
                    <AddressMap ref={mapRef} onLocationChange={handleLocationChange} />
                
                
                {/* --- НОВЫЙ БЛОК УПРАВЛЕНИЯ --- */}
                {/* Он позиционирован абсолютно внутри контейнера карты */}
                <div className="absolute top-4 right-4 z-10">
                    <button 
                        onClick={handleGoToMyLocation}
                        className="bg-white p-3 rounded-full shadow-lg text-brand-dark"
                    >
                        <FiCrosshair size={24}/>
                    </button>
                </div>
                
                {/* Адрес, который показывается сверху */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8/12 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow text-center text-sm">
                    {fullAddress}
                </div>

                {/* Кнопка сохранения внизу */}
                <div className="absolute bottom-6 left-4 right-4 z-10">
                    <button onClick={handleSave} disabled={loading} className="w-full bg-brand-green text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center text-lg gap-2">
                        <FiCheck />
                        {loading ? 'Сохранение...' : 'Сохранить этот адрес'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAddressPage;