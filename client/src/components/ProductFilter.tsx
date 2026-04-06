import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, X } from 'lucide-react';

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
}

interface ProductFilterProps {
  availableCategories: string[];
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
}

export default function ProductFilter({
  availableCategories,
  onFilterChange,
  maxPrice,
}: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, maxPrice],
    sortBy: 'newest',
  });

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    category: true,
    price: true,
    sort: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (
    type: 'min' | 'max',
    value: number
  ) => {
    const newRange = [...filters.priceRange] as [number, number];
    if (type === 'min') {
      newRange[0] = Math.min(value, newRange[1]);
    } else {
      newRange[1] = Math.max(value, newRange[0]);
    }

    const newFilters = { ...filters, priceRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (
    sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest'
  ) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const newFilters: FilterOptions = {
      categories: [],
      priceRange: [0, maxPrice],
      sortBy: 'newest',
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>

      {/* Sort Section */}
      <Card className="p-4">
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full"
        >
          <h4 className="font-semibold text-gray-900">Sort By</h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expandedSections.sort ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.sort && (
          <div className="mt-4 space-y-2">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
              { value: 'name-asc', label: 'Name: A to Z' },
              { value: 'name-desc', label: 'Name: Z to A' },
            ].map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={filters.sortBy === option.value}
                  onChange={() =>
                    handleSortChange(
                      option.value as
                        | 'price-asc'
                        | 'price-desc'
                        | 'name-asc'
                        | 'name-desc'
                        | 'newest'
                    )
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </Card>

      {/* Category Section */}
      {availableCategories.length > 0 && (
        <Card className="p-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full"
          >
            <h4 className="font-semibold text-gray-900">Category</h4>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.category ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSections.category && (
            <div className="mt-4 space-y-2">
              {availableCategories.map((category) => (
                <label key={category} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 capitalize">{category}</span>
                </label>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Price Range Section */}
      <Card className="p-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full"
        >
          <h4 className="font-semibold text-gray-900">Price Range</h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expandedSections.price ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.price && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Min Price: ${filters.priceRange[0].toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Max Price: ${filters.priceRange[1].toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="bg-gray-100 p-3 rounded text-sm">
              <p className="text-gray-700">
                Price Range: ${filters.priceRange[0].toFixed(2)} - $
                {filters.priceRange[1].toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
