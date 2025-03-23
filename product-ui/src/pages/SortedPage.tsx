import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { sortProductsByPrice } from "../store/productSlice";
import { SortedProductList } from "../components/SortedProductList";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AlertTriangle } from "lucide-react";

export const SortedPage: React.FC = () => {
  const dispatch = useDispatch();
  const { sortedProductNames, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(sortProductsByPrice());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Products Sorted by Price
        </h1>
        <p className="text-gray-400">
          View all products sorted by price in ascending order.
        </p>
      </div>

      {loading && <LoadingSpinner message="Sorting products..." />}

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-md p-4 flex items-start mt-6">
          <AlertTriangle className="text-red-500 mr-3 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="text-red-500 font-medium">Error</h3>
            <p className="text-red-400 mt-1 text-sm">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-6">
          <SortedProductList productNames={sortedProductNames} />
        </div>
      )}
    </div>
  );
};
