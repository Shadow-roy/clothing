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
        className={`flex items-center justify-between gap-2 w-full px-4 py-3 bg-white/50 dark:bg-stone-700/50 text-stone-800 dark:text-stone-100 rounded-xl hover:bg-white/80 dark:hover:bg-stone-700/80 transition-all focus:outline-none`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-stone-400 dark:text-stone-500" />
            <span className="font-medium text-stone-700 dark:text-stone-200 text-sm">{selectedCategory}</span>
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-stone-500 dark:text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full sm:w-56 rounded-xl bg-white/90 dark:bg-stone-800/90 backdrop-blur-xl border border-stone-200/50 dark:border-stone-700/50 shadow-xl z-50 overflow-hidden ring-1 ring-black/5">
          <ul className="py-1 max-h-60 overflow-auto custom-scrollbar">
            {categories.map(category => {
                const isSelected = selectedCategory === category;
                return (
                    <li
                        key={category}
                        className={`flex items-center justify-between cursor-pointer select-none px-4 py-2.5 text-sm transition-colors ${isSelected ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/50'}`}
                        onClick={() => handleSelect(category)}
                    >
                        <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                        {category}
                        </span>
                        {isSelected && (
                        <CheckIcon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
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