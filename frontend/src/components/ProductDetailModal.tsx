// frontend/src/components/ProductDetailModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useModalStore } from '../store/modalStore';
import QuantityControl from './QuantityControl';

const ProductDetailModal: React.FC = () => {
    const { isProductModalOpen, selectedProduct, closeProductModal } = useModalStore();

    if (!selectedProduct) return null;
    
    const fullImageUrl = `https://api.revenger.dev/${selectedProduct.image_url}`;

    return (
        <AnimatePresence>
            {isProductModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeProductModal}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md relative"
                    >
                        <button onClick={closeProductModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10">
                            <FiX size={24} />
                        </button>
                        
                        <img src={fullImageUrl} alt={selectedProduct.name} className="w-full max-h-100 object-cover rounded-t-2xl" />
                        
                        <div className="p-6">
                            <h2 className="text-3xl font-bold text-brand-dark">{selectedProduct.name}</h2>
                            <p className="text-gray-600 mt-2 mb-4">{selectedProduct.description || 'Подробное описание скоро появится.'}</p>
                            
                            <QuantityControl product={selectedProduct} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default ProductDetailModal;