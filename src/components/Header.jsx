import React from 'react';
import {FiMenu, FiShoppingCart, FiSearch} from "react-icons/fi";

const Header = () => {
    return (
        <header className="bg-white w-full h-auto !py-2 !px-3 border-b-2 border-gray-200 flex flex-col">
        <div className="flex items-center justify-between w-full items-center">
            <div id="logo" onClick={() => window.location.href = "/"} className="cursor-pointer order-2 md:order-1">
            <img src="/evelyncosmetics.png" className="w-15 h-15" alt="" />
            </div>
            <div id="menu" className="order-1 md:order-2">
                <FiMenu className='h-8 w-8'/>
            </div>
            <div id="cart" className="order-3 md:order-3">
                <FiShoppingCart className='h-8 w-8'/>
            </div>
        </div>
        <div id="search" className="order-4 md:order-4 !mt-2 relative">
            <input 
                type="text" 
                placeholder="Buscar" 
                className="w-full h-10 border-2 border-gray-200 rounded-full !pl-4 !pr-12 outline-none focus:border-gray-400 transition-colors"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 !p-2 text-gray-500 hover:text-gray-700">
                <FiSearch className="h-5 w-5"/>
            </button>
        </div>
        </header>
    );
};

export default Header;