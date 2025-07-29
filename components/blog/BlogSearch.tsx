'use client';

import React, { useState } from 'react';
import { Search, Filter, X, Calendar, Tag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  categories: string[];
  tags: string[];
}

export const BlogSearch: React.FC<BlogSearchProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTag,
  onTagChange,
  sortBy,
  onSortChange,
  categories,
  tags
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('');
    onTagChange('');
    onSortChange('date');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedTag || sortBy !== 'date';

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher des articles..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-[#00F5FF] focus:outline-none text-white placeholder-gray-400 backdrop-blur-sm"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
            showFilters 
              ? "bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30" 
              : "bg-gray-800/50 text-gray-300 border border-gray-600 hover:border-gray-500"
          )}
        >
          <Filter className="w-4 h-4" />
          <span>Filtres</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-[#00F5FF] rounded-full"></span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="glass-card p-6 rounded-xl border border-gray-700/50 space-y-6">
          
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>Catégories</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCategoryChange('')}
                className={cn(
                  "px-3 py-1 rounded-full text-sm transition-colors",
                  selectedCategory === '' 
                    ? "bg-[#00F5FF] text-white" 
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                )}
              >
                Toutes
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm transition-colors",
                    selectedCategory === category 
                      ? "bg-[#00F5FF] text-white" 
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>Tags</span>
            </h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              <button
                onClick={() => onTagChange('')}
                className={cn(
                  "px-3 py-1 rounded-full text-sm transition-colors",
                  selectedTag === '' 
                    ? "bg-[#9D4EDD] text-white" 
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                )}
              >
                Tous
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagChange(tag)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm transition-colors",
                    selectedTag === tag 
                      ? "bg-[#9D4EDD] text-white" 
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Trier par</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'date', label: 'Plus récent' },
                { value: 'popular', label: 'Plus populaire' },
                { value: 'views', label: 'Plus vus' },
                { value: 'title', label: 'Alphabétique' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm transition-colors",
                    sortBy === option.value 
                      ? "bg-[#00BFFF] text-white" 
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogSearch;