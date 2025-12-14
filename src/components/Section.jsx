import React from 'react';
import { motion } from 'framer-motion';
import Carrousel from './Carrousel.jsx';

const Section = ({ id, titulo, products }) => {
    return (
        <section 
            id={id} 
            className='w-full max-w-[2000px] mx-auto !px-2 md:!px-6 lg:!px-12 !py-3 md:!py-6 lg:!py-10 flex justify-center flex-col items-center'
        >
            <h2 
                className='text-[1.34rem] md:text-2xl lg:text-[1.75rem] font-semibold text-center !mb-2 md:!mb-5 lg:!mb-8 max-w-[180px] sm:max-w-[250px] md:max-w-[400px] lg:max-w-[600px]'
            >
                {titulo}
            </h2>
            <Carrousel products={products} id={id} />
            <div 
                className='flex justify-center !mt-2 md:!mt-5 lg:!mt-6'
            >
                <button className='bg-gray-800 hover:bg-gray-900 text-white text-xs md:text-base !px-4 md:!px-8 !py-1.5 md:!py-3 rounded-full transition-colors !cursor-pointer' onClick={() => window.location.href = `/${id}`}>
                    Ver todos
                </button>
            </div>
        </section>
    );
};

export default Section;