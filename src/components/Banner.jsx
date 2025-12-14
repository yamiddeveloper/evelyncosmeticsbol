import { useState, useEffect } from 'react';

const banners = [
    'https://wallpapers.com/images/featured/cosmetico-tfhv43aiapir7c3u.jpg',
    'https://images.unsplash.com/photo-1600634999623-864991678406?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvc20lQzMlQTl0aWNhfGVufDB8fDB8fHww',
    'https://static.vecteezy.com/system/resources/previews/013/104/157/large_2x/set-of-natutal-cosmetics-for-face-and-body-unbranded-dark-glass-pipette-droppers-with-serum-and-cream-jars-in-a-cosy-lifestyle-atmosphere-natutal-eco-trend-photo.jpg',
    'https://www.distribucionactualidad.com/wp-content/uploads/2024/06/INFORME-MERCADO-PERFUMERIA-Y-COSMETICA-2024.jpg'
];

const Banner = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const goTo = (index) => {
        if (index !== current) setCurrent(index);
    };

    return (
        <div className="!mt-[18%] lg:!mt-[5%] w-full">
            <div className="relative w-full overflow-hidden h-[180px] sm:h-[260px] md:h-[340px] lg:h-[420px] xl:h-[430px]">
                {banners.map((banner, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 bg-center bg-cover bg-no-repeat transition-all duration-700 ease-in-out ${
                            current === index 
                                ? 'opacity-100 scale-100' 
                                : 'opacity-0 scale-105'
                        }`}
                        style={{ backgroundImage: `url(${banner})` }}
                        role="img"
                        aria-label={`Banner ${index + 1}`}
                    />
                ))}

                {/* Progress bar dots */}
                <div className="absolute !bottom-3 sm:!bottom-4 !right-3 sm:!right-4 md:!right-6 flex items-center gap-1 sm:gap-1.5">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                                current === i 
                                    ? 'bg-white w-5 sm:w-6' 
                                    : 'bg-white/40 w-1.5 sm:w-2 hover:bg-white/60'
                            }`}
                            aria-label={`Ir al banner ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Banner;