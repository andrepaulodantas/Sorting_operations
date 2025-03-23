import React, { useEffect, useState } from "react";
import { Product } from "../types";

interface ProductTableProps {
  products: Product[];
  title?: string;
  showUpdatedStatus?: boolean;
}

// Adicionando função para calcular o preço final
const calculateFinalPrice = (price: number, discount: number) => {
  return Math.round((price * (100 - discount)) / 100);
};

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  title = "Products",
  showUpdatedStatus = false,
}) => {
  // Estado para rastrear quais produtos foram atualizados recentemente
  const [updatedProducts, setUpdatedProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const [prevProducts, setPrevProducts] = useState<Product[]>([]);

  // Efeito para detectar mudanças nos produtos e atualizar o estado
  useEffect(() => {
    if (showUpdatedStatus && prevProducts.length > 0) {
      const updated: { [key: string]: boolean } = {};

      // Verificar produtos novos ou atualizados
      products.forEach((product) => {
        const prevProduct = prevProducts.find(
          (p) => p.barcode === product.barcode
        );
        if (
          !prevProduct ||
          JSON.stringify(prevProduct) !== JSON.stringify(product)
        ) {
          updated[product.barcode] = true;
        }
      });

      if (Object.keys(updated).length > 0) {
        setUpdatedProducts(updated);

        // Limpar o status de atualização após 3 segundos
        setTimeout(() => {
          setUpdatedProducts({});
        }, 3000);
      }
    }

    setPrevProducts(products);
  }, [products, showUpdatedStatus]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-semibold text-white">No products found</h3>
        <p className="text-gray-400 mt-2">There are no products to display.</p>
      </div>
    );
  }

  // Nas colunas da tabela, adicione uma coluna para o preço final
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Barcode",
      accessorKey: "barcode",
    },
    {
      header: "Original Price",
      accessorKey: "price",
      cell: ({ row }) => `$${(row.original.price / 100).toFixed(2)}`,
    },
    {
      header: "Discount",
      accessorKey: "discount",
      cell: ({ row }) => `${row.original.discount}%`,
    },
    {
      header: "Final Price",
      accessorKey: "finalPrice",
      cell: ({ row }) => {
        const finalPrice = calculateFinalPrice(
          row.original.price,
          row.original.discount
        );
        return `$${(finalPrice / 100).toFixed(2)}`;
      },
    },
    {
      header: "Availability",
      accessorKey: "available",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.original.available
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.available ? "In Stock" : "Out of Stock"}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-gray-900 rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">
          Showing {products.length}{" "}
          {products.length === 1 ? "product" : "products"}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Barcode
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Original Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Discount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Final Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Availability
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {products.map((product) => (
              <tr
                key={product.barcode}
                className={`hover:bg-gray-800/50 transition-colors ${
                  updatedProducts[product.barcode] ? "bg-blue-900/20" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.barcode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.discount}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  $
                  {calculateFinalPrice(product.price, product.discount).toFixed(
                    2
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.available ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                {updatedProducts[product.barcode] && (
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded-full bg-blue-500 text-white animate-pulse">
                    Updated
                  </span>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
