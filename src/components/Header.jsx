import React, { useState } from 'react';
import { FaHamburger } from 'react-icons/fa';
import {FiMenu, FiShoppingCart, FiSearch} from "react-icons/fi";
import HamburguerMenu from './HamburguerMenu.jsx';
const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <header className="bg-white w-full !px-1 !pb-2 md:!px-2 border-b-2 border-gray-200 flex flex-col">
        <div className="flex items-center justify-between w-full items-center !py-2">
            <div id="logo" onClick={() => window.location.href = "/"} className="order-2 md:order-1 w-auto flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <img src="/evelyncosmetics.png" className="w-15 h-15 cursor-pointer"  alt="" />
            </div>
            <div id="menu" className="order-1 md:order-2 !ml-2 rounded-full !p-2 duration-300 flex justify-center cursor-pointer" onClick={() => setOpenMenu(!openMenu)}>
                <FiMenu className='h-10 w-10 '/>
            </div>
            <div id="cart" className="flex items-center justify-center !gap-1 order-3 md:order-3 !mr-2 cursor-pointer !p-2 rounded-full hover:shadow-lg transition-all duration-300" onClick={() => abrirCarrito()}>
                <h6 className="!text-sm">$0.00</h6>
                <FiShoppingCart className='h-8 w-8'/>
            </div>
        </div>
        {openMenu && (
            <HamburguerMenu onClose={() => setOpenMenu(false)}/>
        )}
        <div id="search" className="order-4 md:order-4 !mt-1 relative">
            <input 
                type="text" 
                placeholder="Buscar" 
                className="w-full h-10 border-2 border-gray-200 rounded-full !pl-4 !pr-12 outline-none focus:border-gray-400 transition-colors"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 !py-2 !px-0 text-gray-500 hover:text-gray-700">
                <FiSearch className="h-8 w-8 cursor-pointer rounded-full !p-1"/>
            </button>
        </div>
        </header>
    );
};

export default Header;