import { useState, useEffect } from 'react';

const banners = [
    {
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&h=600&fit=crop&q=90',
        title: 'NUEVA COLECCIÓN',
        subtitle: 'Descubre lo último en belleza',
        accent: '2026'
    },
    {
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1920&h=600&fit=crop&q=90',
        title: '20% OFF',
        subtitle: 'En productos seleccionados',
        accent: 'Oferta'
    }
];

const Banner = () => {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % banners.length);
                setIsTransitioning(false);
            }, 300);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const banner = banners[current];

    const goTo = (index) => {
        if (index === current) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrent(index);
            setIsTransitioning(false);
        }, 300);
    };

    return (
        <div className="!mt-[28%] lg:!mt-[10%] !px-3 sm:!px-4 md:!px-6 lg:!px-8 xl:!px-12">
            <div className="relative w-full max-w-7xl !mx-auto overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl">
                {/* Banner Image */}
                <div className="relative group">
                    <img 
                        src={banner.image} 
                        alt={banner.title} 
                        className={`w-full h-[200px] sm:h-[220px] md:h-[280px] lg:h-[320px] xl:h-[380px] 2xl:h-[420px] object-cover transition-all duration-300 ${
                            isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                        }`}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                    
                    {/* Content - Left aligned */}
                    <div className={`absolute inset-0 flex flex-col justify-center !pl-5 sm:!pl-8 md:!pl-12 lg:!pl-16 xl:!pl-20 !pr-4 transition-all duration-300 ${
                        isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                    }`}>
                        {/* Accent tag */}
                        <span className="inline-block w-fit text-[10px] sm:text-xs md:text-sm tracking-widest text-white/80 uppercase !mb-1.5 sm:!mb-2 !px-2 sm:!px-3 !py-0.5 sm:!py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                            {banner.accent}
                        </span>
                        
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-white drop-shadow-lg !mb-1 sm:!mb-2">
                            {banner.title}
                        </h2>
                        
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl tracking-wide text-white/80 max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md">
                            {banner.subtitle}
                        </p>
                    </div>

                    {/* Navigation arrows - visible on hover for md+ */}
                    
                </div>

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