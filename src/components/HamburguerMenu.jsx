import { useState, useEffect } from 'react'
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const ANIMATION_DURATION = 300

// Categorías principales (siempre visibles)
const mainCategories = [
  { label: 'Tienda', href: '/tienda' },
  { 
    label: 'Categoria 1', 
    subcategories: ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3', 'Subcategoria 4']
  },
  { label: 'Categoria 2', subcategories: ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3', 'Subcategoria 4'] },
  { label: 'Categoria 3', subcategories: ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3', 'Subcategoria 4'] },
]

// Categorías extra (se muestran al dar "Ver más")
const extraCategories = [
  { label: 'Categoria 4', subcategories: ['Subcategoria 1', 'Subcategoria 2'] },
  { label: 'Categoria 5', subcategories: ['Subcategoria 1', 'Subcategoria 2'] },
  { label: 'Categoria 6', subcategories: ['Subcategoria 1', 'Subcategoria 2'] },
  { label: 'Categoria 7', subcategories: ['Subcategoria 1', 'Subcategoria 2'] },
  { label: 'Categoria 8', subcategories: ['Subcategoria 1', 'Subcategoria 2'] },
  { label: 'Categoria 9', subcategories: ['Subcategoria 1', 'Subcategoria 2'] },
]

// Items finales (siempre al final)
const bottomItems = [
  { label: 'Blog', href: '/blog' },
]

const HamburguerMenu = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [openCategory, setOpenCategory] = useState(null)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => setIsVisible(true))
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, ANIMATION_DURATION)
  }

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index)
  }

  const overlayClasses = `
    fixed inset-0 z-40
    bg-black/50
    transition-opacity duration-300
    ${isVisible ? 'opacity-100' : 'opacity-0'}
  `

  const menuClasses = `
    fixed top-0 left-0 z-50
    w-[70%] max-w-[280px] h-screen
    bg-white border-r border-gray-300
    transition-transform duration-300
    overflow-y-auto
    ${isVisible ? 'translate-x-0' : '-translate-x-full'}
  `

  return (
    <>
      <div className={overlayClasses} onClick={handleClose} />
      <div className={menuClasses}>
        {/* Header con X */}
        <div className="flex justify-end !p-4 border-b border-gray-200">
          <FiX 
            onClick={handleClose} 
            className="cursor-pointer text-xl"
          />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col">
          {/* Categorías principales */}
          {mainCategories.map((item, index) => (
            <div key={`main-${index}`}>
              <div 
                className="flex items-center justify-between !px-4 !py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => item.subcategories ? toggleCategory(`main-${index}`) : null}
              >
                <span className="text-base font-medium text-gray-800">{item.label}</span>
                {item.subcategories && item.subcategories.length > 0 && (
                  openCategory === `main-${index}` 
                    ? <FiChevronUp className="text-gray-600" />
                    : <FiChevronDown className="text-gray-600" />
                )}
              </div>
              {item.subcategories && openCategory === `main-${index}` && (
                <div className="bg-gray-50">
                  {item.subcategories.map((sub, subIndex) => (
                    <a 
                      key={subIndex}
                      href="#"
                      className="block !px-6 !py-2 text-base text-gray-600 hover:bg-gray-100 border-b border-gray-200"
                    >
                      {sub}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Categorías extra (visibles solo si showMore es true) - aparecen ARRIBA del botón */}
          {showMore && extraCategories.map((item, index) => (
            <div key={`extra-${index}`}>
              <div 
                className="flex items-center justify-between !px-4 !py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => item.subcategories ? toggleCategory(`extra-${index}`) : null}
              >
                <span className="text-base font-medium text-gray-800">{item.label}</span>
                {item.subcategories && item.subcategories.length > 0 && (
                  openCategory === `extra-${index}` 
                    ? <FiChevronUp className="text-gray-600" />
                    : <FiChevronDown className="text-gray-600" />
                )}
              </div>
              {item.subcategories && openCategory === `extra-${index}` && (
                <div className="bg-gray-50">
                  {item.subcategories.map((sub, subIndex) => (
                    <a 
                      key={subIndex}
                      href="#"
                      className="block !px-6 !py-2 text-base text-gray-600 hover:bg-gray-100 border-b border-gray-200"
                    >
                      {sub}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Botón Ver más / Ver menos - sin icono, como Blog */}
          <div 
            className="flex items-center !px-4 !py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
            onClick={() => setShowMore(!showMore)}
          >
            <span className="text-base font-medium text-gray-800">
              {showMore ? 'Ver menos' : 'Ver más'}
            </span>
          </div>

          {/* Items finales (Blog, etc.) */}
          {bottomItems.map((item, index) => (
            <a 
              key={`bottom-${index}`}
              href={item.href}
              className="flex items-center justify-between !px-4 !py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
            >
              <span className="text-base font-medium text-gray-800">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}

export default HamburguerMenu