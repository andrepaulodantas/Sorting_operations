import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { filterProductsByPrice } from "../store/productSlice";
import { PriceFilter } from "../components/PriceFilter";
import { ProductTable } from "../components/ProductTable";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AlertTriangle } from "lucide-react";

export const FilterPage: React.FC = () => {
  const dispatch = useDispatch();
  const { filteredProducts, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [hasFiltered, setHasFiltered] = useState(false);

  const handleFilter = (minPrice: number, maxPrice: number) => {
    dispatch(filterProductsByPrice({ minPrice, maxPrice }));
    setHasFiltered(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Filter Products</h1>
        <p className="text-gray-400">
          Filter products by price range to narrow down your search.
        </p>
      </div>

      <PriceFilter onFilter={handleFilter} />

      {loading && <LoadingSpinner message="Filtering products..." />}

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-md p-4 flex items-start mt-6">
          <AlertTriangle className="text-red-500 mr-3 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="text-red-500 font-medium">Error</h3>
            <p className="text-red-400 mt-1 text-sm">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && hasFiltered && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Filter Results
          </h2>
          {filteredProducts.length === 0 ? (
            <div className="text-gray-400 italic">
              No products match the filter criteria.
            </div>
          ) : (
            <ProductTable products={filteredProducts} />
          )}
        </div>
      )}
    </div>
  );
};
