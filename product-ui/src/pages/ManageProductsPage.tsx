import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/productSlice";
import { ProductTable } from "../components/ProductTable";
import { ProductForm } from "../components/ProductForm";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AlertTriangle, Plus, Pencil, Trash2 } from "lucide-react";
import { Product } from "../types/product";
import toast from "react-hot-toast";

export const ManageProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddNew = () => {
    setCurrentProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setCurrentProduct(null);
  };

  const handleSubmitForm = (product: Product) => {
    if (currentProduct) {
      // Update existing product
      dispatch(updateProduct({ barcode: product.barcode, product }))
        .unwrap()
        .then(() => {
          toast.success("Product updated successfully");
          setIsFormOpen(false);
          setCurrentProduct(null);
        })
        .catch((error) => {
          toast.error(`Failed to update product: ${error}`);
        });
    } else {
      // Create new product
      dispatch(createProduct(product))
        .unwrap()
        .then(() => {
          toast.success("Product created successfully");
          setIsFormOpen(false);
        })
        .catch((error) => {
          toast.error(`Failed to create product: ${error}`);
        });
    }
  };

  const handleDeleteConfirm = (barcode: string) => {
    setProductToDelete(barcode);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete))
        .unwrap()
        .then(() => {
          toast.success("Product deleted successfully");
          setIsDeleteConfirmOpen(false);
          setProductToDelete(null);
        })
        .catch((error) => {
          toast.error(`Failed to delete product: ${error}`);
        });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Manage Products
          </h1>
          <p className="text-gray-400">
            Add, edit, or remove products from the inventory.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn btn-primary px-4 py-2"
          disabled={isFormOpen}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 my-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {currentProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <ProductForm
            product={currentProduct || undefined}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            isLoading={loading}
          />
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="btn btn-outline px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="btn btn-destructive px-4 py-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && !isFormOpen && (
        <LoadingSpinner message="Loading products..." />
      )}

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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-left">
                    <th className="px-4 py-3 text-gray-300 font-medium">
                      Barcode
                    </th>
                    <th className="px-4 py-3 text-gray-300 font-medium">
                      Name
                    </th>
                    <th className="px-4 py-3 text-gray-300 font-medium">
                      Category
                    </th>
                    <th className="px-4 py-3 text-gray-300 font-medium">
                      Price
                    </th>
                    <th className="px-4 py-3 text-gray-300 font-medium">
                      Discount
                    </th>
                    <th className="px-4 py-3 text-gray-300 font-medium">
                      Available
                    </th>
                    <th className="px-4 py-3 text-gray-300 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.barcode}
                      className="border-t border-gray-700 hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-3 text-gray-300">
                        {product.barcode}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {product.discount}%
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.available
                              ? "bg-green-900/30 text-green-400"
                              : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {product.available ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1 text-primary-400 hover:text-primary-300 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(product.barcode)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
