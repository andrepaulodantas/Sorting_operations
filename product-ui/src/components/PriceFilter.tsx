import React, { useState } from "react";
import { Filter } from "lucide-react";

interface PriceFilterProps {
  onFilter: (minPrice: number, maxPrice: number) => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({ onFilter }) => {
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const validatePrices = (): boolean => {
    if (!minPrice && !maxPrice) {
      setError("Please enter at least one price value");
      return false;
    }

    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER;

    if (min < 0 || max < 0) {
      setError("Price values cannot be negative");
      return false;
    }

    if (min > max) {
      setError("Maximum price must be greater than minimum price");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePrices()) {
      onFilter(
        minPrice ? parseFloat(minPrice) : 0,
        maxPrice ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER
      );
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Minimum Price ($)
            </label>
            <input
              id="minPrice"
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Maximum Price ($)
            </label>
            <input
              id="maxPrice"
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {error && <div className="mt-3 text-red-400 text-sm">{error}</div>}

        <button
          type="submit"
          className="mt-4 flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          Apply Filter
        </button>
      </form>
    </div>
  );
};
