import React from 'react';
import { motion } from 'framer-motion';
import CategoryCarrousel from './CategoryCarrousel.jsx';

const SectionCategories = ({ id, titulo }) => {
    return (
        <section 
            id={id} 
            className='w-full max-w-[2000px] mx-auto !px-2 md:!px-8 lg:!px-12 !py-4 md:!py-6 lg:!py-12'
        >
            <h2 
                className='text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-center !mb-3 md:!mb-5 lg:!mb-8'
            >
                {titulo}
            </h2>
            <CategoryCarrousel />
        </section>
    );
};

export default SectionCategories;
