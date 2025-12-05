import React from 'react';
import Carrousel from './Carrousel.jsx';

const Section = ({ id, titulo, products }) => {
    return (
        <section id={id} className='w-full !px-4 !py-8'>
            <h2 className='text-3xl md:text-4xl font-bold text-center !mb-8'>{titulo}</h2>
            <Carrousel products={products} />
            <div className='flex justify-center !mt-6'>
                <button className='bg-gray-800 hover:bg-gray-900 text-white !px-8 !py-3 rounded-full transition-colors'>
                    Ver todos
                </button>
            </div>
        </section>
    );
};

export default Section;