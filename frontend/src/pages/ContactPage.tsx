// frontend/src/pages/ContactPage.tsx
import React from 'react';
import Header from '../components/Header';
import { FiMail, FiSend } from 'react-icons/fi';

const ContactPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header title="Контакты" showBackButton={true} />

            <div className="p-6">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-brand-dark mb-2">Свяжитесь с нами</h1>
                    <p className="text-lg text-brand-green-light">
                        Мы всегда открыты для вопросов, предложений и сотрудничества.
                    </p>
                </div>

                <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6">
                    {/* Контакт 1: Email */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                            <FiMail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-brand-dark">Электронная почта</h3>
                            <p className="text-gray-600">Для деловых предложений и общих вопросов.</p>
                            <a 
                                href="mailto:revengernick079@gmail.com"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                revengernick079@gmail.com
                            </a>
                        </div>
                    </div>
                    
                    {/* Разделитель */}
                    <div className="border-t border-gray-200"></div>

                    {/* Контакт 2: Telegram */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-sky-100 p-3 rounded-full">
                            <FiSend className="w-6 h-6 text-sky-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-brand-dark">Telegram</h3>
                            <p className="text-gray-600">Для быстрой связи и обсуждения идей.</p>
                            <a 
                                href="https://t.me/revengerNick" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sky-600 font-semibold hover:underline"
                            >
                                @revengerNick
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;