import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import ProfilePage from '../pages/ProfilePage'; // <-- ПЕРЕИСПОЛЬЗУЕМ ЦЕЛУЮ СТРАНИЦУ!

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-50 h-full w-full max-w-md shadow-2xl relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
              <FiX size={24} />
            </button>
            {/* Рендерим нашу существующую страницу профиля внутри модального окна */}
            <div className="h-full overflow-y-auto">
                <ProfilePage />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ProfileModal;