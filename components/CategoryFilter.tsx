import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (category: string) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        className={`flex items-center justify-between gap-4 w-full px-4 py-2 bg-teal-700 text-white rounded-full shadow-md hover:bg-teal-800 transition-all focus:outline-none ${isOpen ? 'ring-2 ring-white' : 'focus:ring-2 focus:ring-offset-2 focus:ring-teal-700'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col text-left">
          <span className="text-xs font-light">Shop by</span>
          <span className="font-extrabold text-lg leading-tight">Category</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full rounded-xl bg-white shadow-lg z-20 ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
          <ul className="py-2">
            {categories.map(category => {
                const isSelected = selectedCategory === category;
                return (
                    <li
                        key={category}
                        className={`flex items-center justify-between cursor-pointer select-none px-4 py-3 text-sm transition-colors ${isSelected ? 'bg-teal-50' : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={() => handleSelect(category)}
                    >
                        <span className={`block truncate ${isSelected ? 'font-semibold text-teal-700' : 'font-normal'}`}>
                        {category}
                        </span>
                        {isSelected && (
                        <CheckIcon className="h-5 w-5 text-teal-600" />
                        )}
                    </li>
                );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;