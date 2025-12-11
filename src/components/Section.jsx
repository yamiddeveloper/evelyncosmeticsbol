import React from 'react';
import { motion } from 'framer-motion';
import Carrousel from './Carrousel.jsx';

const Section = ({ id, titulo, products }) => {
    return (
        <motion.section 
            id={id} 
            className='w-full max-w-[2000px] mx-auto !px-4 md:!px-8 lg:!px-12 !py-8 lg:!py-12 flex justify-center flex-col items-center'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <motion.h2 
                className='watch:text-2xl 4xs:text-3xl 3xs:text-3xl 2xs:text-3xl xs:text-3xl sm:text-3xl md:text-[2.5rem] lg:text-[2.5rem] font-bold text-center !mb-6 lg:!mb-8 watch:max-w-[200px] md:max-w-[400px] lg:max-w-[600px]'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
            >
                {titulo}
            </motion.h2>
            <Carrousel products={products} id={id} />
            <motion.div 
                className='flex justify-center !mt-6'
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
            >
                <button className='bg-gray-800 hover:bg-gray-900 text-white !px-8 !py-3 rounded-full transition-colors !cursor-pointer' onClick={() => window.location.href = `/${id}`}>
                    Ver todos
                </button>
            </motion.div>
        </motion.section>
    );
};

export default Section;