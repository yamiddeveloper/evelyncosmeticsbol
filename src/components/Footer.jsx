import React from 'react';
import { FaFacebook, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className='bg-gray-200 !py-4 sm:!py-6 flex flex-col justify-center items-center gap-3'>
            <div className="text-center text-gray-600">
                <p className="text-sm font-medium">Evelyn Cosmetics | Bolivia</p>
                <p className="text-xs !mt-0.5">© {new Date().getFullYear()}</p>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
                <a href="#" className="hover:text-gray-600 transition-colors"><FaFacebook className="w-4 h-4 sm:w-5 sm:h-5" /></a>
                <a href="#" className="hover:text-gray-600 transition-colors"><FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5" /></a>
                <a href="#" className="hover:text-gray-600 transition-colors"><FaYoutube className="w-4 h-4 sm:w-5 sm:h-5" /></a>
                <a href="#" className="hover:text-gray-600 transition-colors"><FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" /></a>
            </div>
        </footer>
    );
};

export default Footer;