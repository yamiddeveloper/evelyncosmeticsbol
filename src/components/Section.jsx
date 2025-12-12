import React from 'react';
import { motion } from 'framer-motion';
import Carrousel from './Carrousel.jsx';

const Section = ({ id, titulo, products }) => {
    return (
        <section 
            id={id} 
            className='w-full max-w-[2000px] mx-auto !px-4 md:!px-8 lg:!px-12 !py-8 lg:!py-12 flex justify-center flex-col items-center'
        >
            <h2 
                className='watch:text-2xl 4xs:text-3xl 3xs:text-3xl 2xs:text-3xl xs:text-3xl sm:text-3xl md:text-[2.5rem] lg:text-[2.5rem] font-bold text-center !mb-6 lg:!mb-8 watch:max-w-[200px] md:max-w-[400px] lg:max-w-[600px]'
            >
                {titulo}
            </h2>
            <Carrousel products={products} id={id} />
            <div 
                className='flex justify-center !mt-6'
            >
                <button className='bg-gray-800 hover:bg-gray-900 text-white !px-8 !py-3 rounded-full transition-colors !cursor-pointer' onClick={() => window.location.href = `/${id}`}>
                    Ver todos
                </button>
            </div>
        </section>
    );
};

export default Section;