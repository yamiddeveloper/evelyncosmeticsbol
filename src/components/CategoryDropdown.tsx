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

const allCategories = [...(mainCategories as Category[]), ...(extraCategories as Category[])];

export default function CategoryDropdown({ className = '' }: CategoryDropdownProps) {
    // Mobile state
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
                setIsSubcategoryOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mobile: Handle category selection
    const handleCategorySelect = (category: Category) => {
        if (category.subcategories.length === 0) {
            // No subcategories - go directly to category page
            window.location.href = `/categoria/${category.id}`;
        } else {
            // Has subcategories - show subcategory dropdown
            setSelectedCategory(category);
            setIsCategoryOpen(false);
            setIsSubcategoryOpen(false);
        }
    };

    // Mobile: Clear selection
    const clearSelection = () => {
        setSelectedCategory(null);
        setIsSubcategoryOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`${className}`}>
            {/* ========== MOBILE VERSION ========== */}
            <div className="lg:hidden space-y-3">
                {/* Category Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsCategoryOpen(!isCategoryOpen);
                            setIsSubcategoryOpen(false);
                        }}
                        className="flex w-full items-center justify-between !px-3 !py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors !mb-4"
                    >
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/>
                                <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1m0 5.586 7 7L13.586 9l-7-7H2z"/>
                            </svg>
                            <span className={selectedCategory ? 'text-gray-900 font-medium' : ''}>
                                {selectedCategory ? selectedCategory.label : 'Seleccionar categoría'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            {selectedCategory && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearSelection();
                                    }}
                                    className="!p-1 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            {isCategoryOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </button>

                    {isCategoryOpen && (
                        <div className="absolute top-full left-0 right-0 !mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                            {allCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategorySelect(category)}
                                    className={`w-full text-left !px-3 !py-2.5 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                                        selectedCategory?.id === category.id 
                                            ? 'bg-gray-100 text-gray-900 font-medium' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{category.label}</span>
                                        {category.subcategories.length > 0 && (
                                            <span className="text-xs text-gray-400">
                                                {category.subcategories.length} sub
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Subcategory Dropdown - Only shows when category is selected and has subcategories */}
                {selectedCategory && selectedCategory.subcategories.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
                            className="flex w-full items-center justify-between !px-3 !py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors !mb-4"
                        >
                            <span>Seleccionar subcategoría</span>
                            {isSubcategoryOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </button>

                        {isSubcategoryOpen && (
                            <div className="absolute top-full left-0 right-0 !mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                {selectedCategory.subcategories.map((sub) => (
                                    <a
                                        key={sub.id}
                                        href={`/categoria/${selectedCategory.id}/${sub.id}`}
                                        className="block !px-3 !py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                    >
                                        {sub.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Go to category button - Shows when category selected */}
                {selectedCategory && (
                    <a
                        href={`/categoria/${selectedCategory.id}`}
                        className="flex items-center justify-center gap-2 w-full !px-3 !py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span>Ver {selectedCategory.label}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                )}
            </div>

            {/* ========== DESKTOP VERSION ========== */}
            <div className="hidden lg:block">
                <div className="!px-3 !py-2.5 !mb-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/>
                            <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1m0 5.586 7 7L13.586 9l-7-7H2z"/>
                        </svg>
                        <span>Categorías</span>
                    </div>
                </div>
                <ul className="space-y-1">
                    {allCategories.map((category) => (
                        <li key={category.id}>
                            <a
                                href={`/categoria/${category.id}`}
                                className="block !px-3 !py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                {category.label}
                            </a>
                            {category.subcategories.length > 0 && (
                                <ul className="!ml-4 !mt-1 space-y-0.5">
                                    {category.subcategories.map((sub) => (
                                        <li key={sub.id}>
                                            <a
                                                href={`/categoria/${category.id}/${sub.id}`}
                                                className="block !px-3 !py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                                            >
                                                {sub.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}