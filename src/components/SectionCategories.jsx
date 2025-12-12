import React from 'react';
import { motion } from 'framer-motion';
import CategoryCarrousel from './CategoryCarrousel.jsx';

const SectionCategories = ({ id, titulo }) => {
    return (
        <section 
            id={id} 
            className='w-full max-w-[2000px] mx-auto !px-4 md:!px-8 lg:!px-12 !py-8 lg:!py-12'
        >
            <h2 
                className='text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-center !mb-6 lg:!mb-8'
            >
                {titulo}
            </h2>
            <CategoryCarrousel />
        </section>
    );
};

export default SectionCategories;
