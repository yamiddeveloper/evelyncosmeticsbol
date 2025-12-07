import React from 'react';
import { motion } from 'framer-motion';
import Carrousel from './Carrousel.jsx';

const Section = ({ id, titulo, products }) => {
    return (
        <motion.section 
            id={id} 
            className='w-full !px-4 !py-8'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <motion.h2 
                className='text-3xl md:text-4xl font-bold text-center !mb-8'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
            >
                {titulo}
            </motion.h2>
            <Carrousel products={products} />
            <motion.div 
                className='flex justify-center !mt-6'
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
            >
                <button className='bg-gray-800 hover:bg-gray-900 text-white !px-8 !py-3 rounded-full transition-colors'>
                    Ver todos
                </button>
            </motion.div>
        </motion.section>
    );
};

export default Section;