import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CheckIcon } from './icons/CheckIcon';
import { TagIcon } from './icons/TagIcon';

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
        className={`flex items-center justify-between gap-2 w-full px-4 py-3 bg-white dark:bg-gray-700 text-slate-800 dark:text-slate-100 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all focus:outline-none ${isOpen ? 'ring-2 ring-indigo-500' : 'focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <TagIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <span className="font-semibold text-slate-700 dark:text-slate-200 flex-1 text-left">{selectedCategory}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg z-20 ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
          <ul className="py-2">
            {categories.map(category => {
                const isSelected = selectedCategory === category;
                return (
                    <li
                        key={category}
                        className={`flex items-center justify-between cursor-pointer select-none px-4 py-3 text-sm transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/50' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                        onClick={() => handleSelect(category)}
                    >
                        <span className={`block truncate ${isSelected ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'font-normal'}`}>
                        {category}
                        </span>
                        {isSelected && (
                        <CheckIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
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