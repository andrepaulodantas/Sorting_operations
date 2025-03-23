import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { fetchProducts } from "../store/productSlice";
import { ProductTable } from "../components/ProductTable";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AlertTriangle } from "lucide-react";

export const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Product Catalog</h1>
        <p className="text-gray-400">
          Browse all available products in the inventory.
        </p>
      </div>

      {loading && <LoadingSpinner message="Loading products..." />}

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
          {products.length === 0 ? (
            <div className="text-gray-400 italic">
              No products available in the inventory.
            </div>
          ) : (
            <ProductTable products={products} />
          )}
        </div>
      )}
    </div>
  );
};
