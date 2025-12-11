import { useState, useEffect } from 'react'
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { mainCategories, extraCategories } from '../data/categories.js'

const ANIMATION_DURATION = 300

// Item de tienda (siempre primero)
const tiendaItem = { label: 'Tienda', href: '/' }

// Items finales (siempre al final)
const bottomItems = [
  { label: 'Blog', href: '#' },
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
          {/* Tienda */}
          <a 
            href={tiendaItem.href}
            className="flex items-center justify-between !px-4 !py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
          >
            <span className="text-base font-medium text-gray-800">{tiendaItem.label}</span>
          </a>

          {/* Categorías principales */}
          {mainCategories.map((item, index) => (
            <div key={item.id}>
              {item.subcategories && item.subcategories.length > 0 ? (
                <>
                  <div className="flex items-center justify-between !px-4 !py-3 border-b border-gray-200">
                    <a 
                      href={`/categoria/${item.id}`}
                      className="flex-1 text-base font-medium text-gray-800 cursor-pointer"
                    >
                      {item.label}
                    </a>
                    <div 
                      onClick={() => toggleCategory(`main-${index}`)}
                      className="cursor-pointer pl-4"
                    >
                      {openCategory === `main-${index}` 
                        ? <FiChevronUp className="text-gray-600 text-xl" />
                        : <FiChevronDown className="text-gray-600 text-xl" />
                      }
                    </div>
                  </div>
                  {openCategory === `main-${index}` && (
                    <div className="bg-gray-50">
                      {item.subcategories.map((sub) => (
                        <a 
                          key={sub.id}
                          href={`/categoria/${item.id}/${sub.id}`}
                          className="block !px-6 !py-2 text-base text-gray-600 hover:bg-gray-100 border-b border-gray-200"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a 
                  href={`/categoria/${item.id}`}
                  className="flex items-center justify-between !px-4 !py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-base font-medium text-gray-800">{item.label}</span>
                </a>
              )}
            </div>
          ))}

          {/* Categorías extra (visibles solo si showMore es true) - aparecen ARRIBA del botón */}
          {showMore && extraCategories.map((item, index) => (
            <div key={item.id}>
              {item.subcategories && item.subcategories.length > 0 ? (
                <>
                  <div className="flex items-center justify-between !px-4 !py-3 border-b border-gray-200">
                    <a 
                      href={`/categoria/${item.id}`}
                      className="flex-1 text-base font-medium text-gray-800 cursor-pointer"
                    >
                      {item.label}
                    </a>
                    <div 
                      onClick={() => toggleCategory(`extra-${index}`)}
                      className="cursor-pointer pl-4"
                    >
                      {openCategory === `extra-${index}` 
                        ? <FiChevronUp className="text-gray-600 text-xl" />
                        : <FiChevronDown className="text-gray-600 text-xl" />
                      }
                    </div>
                  </div>
                  {openCategory === `extra-${index}` && (
                    <div className="bg-gray-50">
                      {item.subcategories.map((sub) => (
                        <a 
                          key={sub.id}
                          href={`/categoria/${item.id}/${sub.id}`}
                          className="block !px-6 !py-2 text-base text-gray-600 hover:bg-gray-100 border-b border-gray-200"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a 
                  href={`/categoria/${item.id}`}
                  className="flex items-center justify-between !px-4 !py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-base font-medium text-gray-800">{item.label}</span>
                </a>
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