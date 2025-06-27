// frontend/src/pages/AddressListPage.tsx
import React, { useEffect } from 'react';
import Header from '../components/Header';
import { useAddressStore } from '../store/addressStore';
import { FiPlus, FiTrash2, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AddressListPage: React.FC = () => {
    const { addresses, fetchAddresses, deleteAddress } = useAddressStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <Header title="Мои адреса" showBackButton={true} />
                <div className="p-4 space-y-3">
                    {addresses.length > 0 ? (
                        addresses.map(addr => (
                            <div key={addr.id} className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <FiHome className="text-brand-green-light" />
                                    <span>{addr.full_address}</span>
                                </div>
                                <button 
                                    onClick={() => deleteAddress(addr.id)} 
                                    className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">У вас пока нет сохраненных адресов.</p>
                    )}
                    <button 
                        onClick={() => navigate('/add-address')}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-brand-green hover:bg-green-50 transition-colors"
                    >
                        <FiPlus /> Добавить новый адрес
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddressListPage;