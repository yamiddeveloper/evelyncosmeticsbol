import React from 'react';
import { FaFacebook, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className='bg-gray-200 !py-10 flex flex-col justify-center items-center gap-6'>
            <div className="text-center text-gray-600">
                <p className="text-lg font-medium">Evelyn Cosmetics | Bolivia</p>
                <p className="text-sm mt-1">Copyright @{new Date().getFullYear()}</p>
            </div>
            <div className="flex items-center gap-6 text-gray-400">
                <a href="#" className="hover:text-gray-600 transition-colors"><FaFacebook className="w-6 h-6" /></a>
                <a href="#" className="hover:text-gray-600 transition-colors"><FaLinkedin className="w-6 h-6" /></a>
                <a href="#" className="hover:text-gray-600 transition-colors"><FaYoutube className="w-6 h-6" /></a>
                <a href="#" className="hover:text-gray-600 transition-colors"><FaInstagram className="w-6 h-6" /></a>
            </div>
        </footer>
    );
};

export default Footer;