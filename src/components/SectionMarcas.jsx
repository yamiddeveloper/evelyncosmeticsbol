import React from 'react';
import { motion } from 'framer-motion';

const marcas = [
    { id: 1, name: 'Avene' },
    { id: 2, name: 'Bioderma' },
    { id: 3, name: 'Cerave' },
    { id: 4, name: 'Cetaphil' },
    { id: 5, name: 'Cosrx' },
    { id: 6, name: 'Dove' },
    { id: 7, name: 'Eucerin' },
    { id: 8, name: 'Garnier' },
    { id: 9, name: 'Isdin' },
    { id: 10, name: 'La Roche Posay' },
    { id: 11, name: "L'Oréal" },
    { id: 12, name: 'Neutrogena' },
    { id: 13, name: 'Nivea' },
    { id: 14, name: 'The Ordinary' },
    { id: 15, name: 'Vichy' },
];

const SectionMarcas = () => {
    // Duplicamos las marcas para el efecto infinito
    const duplicatedMarcas = [...marcas, ...marcas];

    return (
        <section 
            className='w-full max-w-[2000px] mx-auto !py-12 lg:!py-20 overflow-hidden'
        >
            <h2 
                className='text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-center !mb-6 lg:!mb-8 !px-4'
            >
                Marcas
            </h2>
            
            <div 
                className="relative w-full overflow-hidden"
            >
                <motion.div 
                    className="flex gap-8 md:gap-12 lg:gap-16 !py-5"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 15,
                            ease: 'linear',
                        },
                    }}
                >
                    {duplicatedMarcas.map((marca, index) => (
                        <a
                            href={`/marca/${marca.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                            key={`${marca.id}-${index}`}
                            className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-100 shadow-md flex items-center justify-center overflow-hidden cursor-pointer hover:scale-110 hover:shadow-lg transition-all !p-2"
                        >
                            <span className="text-gray-700 font-bold text-[10px] md:text-xs text-center leading-tight">{marca.name}</span>
                        </a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default SectionMarcas;
