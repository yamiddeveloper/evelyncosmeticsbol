import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiShoppingCart, FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";
import HamburguerMenu from './HamburguerMenu.jsx';
import { mainCategories, extraCategories } from '../data/categories.js';

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: isVisible ? 0 : -200 }}
        transition={{ duration: 0.3 }}
    
        className="bg-white w-full !px-2 !py-2 lg:!px-6 lg:!py-3 border-b-2 border-gray-200 flex flex-wrap lg:flex-nowrap items-center justify-between fixed top-0 left-0 right-0 z-50">
            {/* Logo */}
            <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="logo" onClick={() => window.location.href = "/"} className="order-2 lg:order-1 w-auto flex items-center justify-center absolute top-2 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 cursor-pointer">
                <img src="/evelyncosmetics.png" className="w-15 h-15 lg:w-16 lg:h-16" alt="Evelyn Cosmetics" />
            </motion.div>

            {/* Hamburger menu - mobile only */}
            <motion.div 
                whileHover={{ scale: 1.05 }}
                id="menu" 
                className="order-1 rounded-full !p-2 duration-300 flex lg:hidden justify-center cursor-pointer" 
                onClick={() => setOpenMenu(!openMenu)}
            >
                <FiMenu className='h-10 w-10'/>
            </motion.div>

            {/* Search bar */}
            <motion.div 
            whileHover={{ scale: 1.02 }}
            id="search" className="order-4 lg:order-2 !mt-2 lg:!mt-0 relative w-full lg:w-[100vh] lg:flex-1 lg:max-w-lg lg:!mx-8">
                <input 
                    type="text" 
                    placeholder="Buscar productos..." 
                    className="w-full h-12 border-2 border-gray-200 rounded-full !pl-4 !pr-10 outline-none focus:border-gray-400 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    <FiSearch className="h-6 w-6 cursor-pointer"/>
                </button>
            </motion.div>

            {/* Navigation - desktop only */}
            <nav id="nav" className="hidden lg:flex items-center !gap-6 order-3 text-gray-700">
                <motion.a 
                whileHover={{ scale: 1.05 }}
                href="/tienda" className="hover:text-gray-900 transition-colors font-medium">Tienda</motion.a>
                
                {/* Dropdown Categorías */}
                <div
                    className="relative"
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => { setShowCategories(false); setOpenCategory(null); setShowMore(false); }}
                >
                    <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors font-medium py-2">
                        Categorías
                        <FiChevronDown className={`h-4 w-4 transition-transform ${showCategories ? 'rotate-180 transform ease-in-out duration-200' : ''}`}/>
                    </motion.button>
                    
                    {/* Dropdown menu */}
                    {showCategories && (
                        <div className="absolute top-full left-0 !pt-2 w-56 z-50">
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-96 overflow-y-auto">
                                {/* Categorías principales */}
                                {mainCategories.map((category, index) => (
                                    <div key={`main-${index}`}>
                                        {category.subcategories && category.subcategories.length > 0 ? (
                                            <div className="flex items-center justify-between !px-4 !py-3 border-b border-gray-100">
                                                <a 
                                                    href={`/categoria/${category.id}`}
                                                    className="flex-1 font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                                >
                                                    {category.label}
                                                </a>
                                                <div 
                                                    onClick={() => setOpenCategory(openCategory === `main-${index}` ? null : `main-${index}`)}
                                                    className="cursor-pointer pl-4"
                                                >
                                                    {openCategory === `main-${index}` 
                                                        ? <FiChevronUp className="h-4 w-4 text-gray-600"/>
                                                        : <FiChevronDown className="h-4 w-4 text-gray-600"/>
                                                    }
                                                </div>
                                            </div>
                                        ) : (
                                            <a 
                                                href={`/categoria/${category.id}`}
                                                className="flex items-center justify-between !px-4 !py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer border-b border-gray-100"
                                            >
                                                <span className="font-medium">{category.label}</span>
                                            </a>
                                        )}
                                        
                                        {/* Subcategorías */}
                                        {category.subcategories && category.subcategories.length > 0 && openCategory === `main-${index}` && (
                                            <div className="bg-gray-50">
                                                {category.subcategories.map((sub, subIndex) => (
                                                    <a 
                                                        key={sub.id}
                                                        href={`/categoria/${category.id}/${sub.id}`}
                                                        className="block !px-6 !py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors border-b border-gray-100"
                                                    >
                                                        {sub.label}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Categorías extra (visibles solo si showMore es true) */}
                                {showMore && extraCategories.map((category, index) => (
                                    <div key={`extra-${index}`}>
                                        {category.subcategories && category.subcategories.length > 0 ? (
                                            <div className="flex items-center justify-between !px-4 !py-3 border-b border-gray-100">
                                                <a 
                                                    href={`/categoria/${category.id}`}
                                                    className="flex-1 font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                                >
                                                    {category.label}
                                                </a>
                                                <div 
                                                    onClick={() => setOpenCategory(openCategory === `extra-${index}` ? null : `extra-${index}`)}
                                                    className="cursor-pointer pl-4"
                                                >
                                                    {openCategory === `extra-${index}` 
                                                        ? <FiChevronUp className="h-4 w-4 text-gray-600"/>
                                                        : <FiChevronDown className="h-4 w-4 text-gray-600"/>
                                                    }
                                                </div>
                                            </div>
                                        ) : (
                                            <a 
                                                href={`/categoria/${category.id}`}
                                                className="flex items-center justify-between !px-4 !py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer border-b border-gray-100"
                                            >
                                                <span className="font-medium">{category.label}</span>
                                            </a>
                                        )}
                                        
                                        {/* Subcategorías */}
                                        {category.subcategories && category.subcategories.length > 0 && openCategory === `extra-${index}` && (
                                            <div className="bg-gray-50">
                                                {category.subcategories.map((sub, subIndex) => (
                                                    <a 
                                                        key={sub.id}
                                                        href={`/categoria/${category.id}/${sub.id}`}
                                                        className="block !px-6 !py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors border-b border-gray-100"
                                                    >
                                                        {sub.label}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Botón Ver más / Ver menos */}
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center !px-4 !py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                                    onClick={() => setShowMore(!showMore)}
                                >
                                    <span className="font-medium">
                                        {showMore ? 'Ver menos' : 'Ver más'}
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
                
                <motion.a 
                    whileHover={{ scale: 1.05 }}
                    href="/blog" 
                    className="hover:text-gray-900 transition-colors font-medium"
                >
                    Blog
                </motion.a>
            </nav>
            {/* Cart - único para todas las pantallas */}
            <motion.div 
                whileHover={{ scale: 1.05 }}
                id="cart" 
                className="order-3 flex items-center justify-center gap-1 !mr-2 lg:!mr-0 lg:!ml-6 cursor-pointer !p-2 rounded-full hover:shadow-lg transition-all duration-300" 
                onClick={() => abrirCarrito()}
            >
                <FiShoppingCart className='h-8 w-8 lg:h-6 lg:w-6'/>
            </motion.div>

            {/* Mobile menu */}
            {openMenu && (
                <HamburguerMenu onClose={() => setOpenMenu(false)}/>
            )}
        </motion.header>
    );
};

export default Header;