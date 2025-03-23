import React from "react";
import { ArrowUpDown, ShoppingBag } from "lucide-react";

interface SortedProductListProps {
  productNames: string[];
}

export const SortedProductList: React.FC<SortedProductListProps> = ({
  productNames,
}) => {
  if (!productNames || productNames.length === 0) {
    return (
      <div className="text-center py-10">
        <ArrowUpDown className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-300">
          No sorted products
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          No products are available to sort.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-800">
        <h3 className="text-lg font-medium leading-6 text-white">
          Products Sorted by Price
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-400">
          Showing {productNames.length} product
          {productNames.length !== 1 ? "s" : ""} sorted from lowest to highest
          price
        </p>
      </div>
      <ul className="divide-y divide-gray-800">
        {productNames.map((productName, index) => (
          <li
            key={index}
            className="px-6 py-4 flex items-center hover:bg-gray-800"
          >
            <span className="flex-shrink-0 mr-4 bg-gray-800 p-2 rounded-full">
              <ShoppingBag size={16} className="text-primary-400" />
            </span>
            <div>
              <span className="font-medium text-white">{index + 1}.</span>{" "}
              <span className="text-gray-300">{productName}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
