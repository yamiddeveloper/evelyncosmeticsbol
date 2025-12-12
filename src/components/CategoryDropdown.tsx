import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { mainCategories, extraCategories } from '../data/categories.js';

interface Subcategory {
    id: string;
    label: string;
}

interface Category {
    id: string;
    label: string;
    subcategories: Subcategory[];
}

interface CategoryDropdownProps {
    className?: string;
}

// Number of main categories to show initially
const INITIAL_CATEGORIES_COUNT = 3;

export default function CategoryDropdown({ className = '' }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Categories to display based on showMore state
    const visibleMainCategories = showMore 
        ? (mainCategories as Category[]) 
        : (mainCategories as Category[]).slice(0, INITIAL_CATEGORIES_COUNT);
    const visibleExtraCategories = showMore ? (extraCategories as Category[]) : [];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setExpandedCategory(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleCategoryExpand = (categoryId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
        window.location.href = `/categoria/${categoryId}?sub=${subcategoryId}`;
    };

    const renderCategory = (category: Category) => {
        const hasSubcategories = category.subcategories && category.subcategories.length > 0;
        const isExpanded = expandedCategory === category.id;

        return (
            <div key={category.id}>
                <div className="flex items-center border-b border-gray-100">
                    {/* Category name - clickable link */}
                    <a
                        href={`/categoria/${category.id}`}
                        className="flex-1 !px-4 !py-3 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <span className="text-sm">{category.label}</span>
                    </a>
                    
                    {/* Expand button - only if has subcategories */}
                    {hasSubcategories && (
                        <div
                            onClick={(e) => toggleCategoryExpand(category.id, e)}
                            className="!px-4 !py-3 text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            {isExpanded ? (
                                <FiChevronUp className="text-lg" />
                            ) : (
                                <FiChevronDown className="text-lg" />
                            )}
                        </div>
                    )}
                </div>

                {/* Subcategories - shown when expanded */}
                {hasSubcategories && isExpanded && (
                    <div className="bg-gray-50">
                        {category.subcategories.map((sub) => (
                            <a
                                key={sub.id}
                                href={`/categoria/${category.id}/${sub.id}`}
                                className="block !px-6 !py-2 text-sm text-gray-600 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                                {sub.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Main Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        setExpandedCategory(null);
                    }
                }}
                className={`flex w-full items-center justify-between !px-4 !py-3 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors border border-gray-200 ${isOpen ? 'bg-gray-50' : ''}`}
            >
                <div className="flex items-center gap-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tag" viewBox="0 0 16 16">
                        <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/>
                        <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1m0 5.586 7 7L13.586 9l-7-7H2z"/>
                    </svg>
                    <span>Seleccionar categoría</span>
                </div>
                
                {isOpen ? (
                    <FiChevronUp className="text-gray-400" />
                ) : (
                    <FiChevronDown className="text-gray-400" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 !mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                    {/* Main Categories (first 3 or all if showMore) */}
                    {visibleMainCategories.map(renderCategory)}

                    {/* Extra Categories (only if showMore) */}
                    {visibleExtraCategories.map(renderCategory)}

                    {/* Ver más / Ver menos button */}
                    <div
                        onClick={() => setShowMore(!showMore)}
                        className="flex items-center !px-4 !py-3 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors border-t border-gray-200"
                    >
                        <span className="text-sm font-medium">
                            {showMore ? 'Ver menos' : 'Ver más'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}