import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/productSlice";
import { AppDispatch } from "../store";
import { Product } from "../types";
import { Container } from "../components/Container";
import { ProductForm } from "../components/ProductForm";
import { ProductTable } from "../components/ProductTable";
import { Modal } from "../components/Modal";
import { toast } from "react-toastify";
import { AlertTriangle, Plus, Pencil, Trash2 } from "lucide-react";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const ManageProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);
  const loading = useSelector((state: RootState) => state.products.loading);
  const error = useSelector((state: RootState) => state.products.error);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setIsEditing(true);
      setSelectedProduct(product);
    } else {
      setIsEditing(false);
      setSelectedProduct(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleSubmitForm = async (formData: Omit<Product, "id">) => {
    setIsLoading(true);
    try {
      if (isEditing && selectedProduct) {
        await dispatch(
          updateProduct({
            barcode: selectedProduct.barcode,
            product: {
              ...formData,
              barcode: selectedProduct.barcode,
            },
          })
        ).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await dispatch(createProduct(formData)).unwrap();
        toast.success("Product created successfully!");
      }

      // Atualizar a lista de produtos e mostrar feedback visual
      await dispatch(fetchProducts());
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);

      handleCloseModal();
    } catch (error) {
      toast.error(
        isEditing ? "Error updating product" : "Error creating product"
      );
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (barcode: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      try {
        await dispatch(deleteProduct(barcode)).unwrap();
        toast.success("Product deleted successfully!");

        // Atualizar a lista de produtos
        await dispatch(fetchProducts());
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 3000);
      } catch (error) {
        toast.error("Error deleting product");
        console.error("Error deleting product:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Products</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => handleOpenModal()}
        >
          Add New Product
        </button>
      </div>

      {loading && !isLoading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-400">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-900/20 rounded-lg">
          <h3 className="text-xl font-semibold text-red-500">
            Failed to load products
          </h3>
          <p className="text-gray-400 mt-2">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <ProductTable
            products={products}
            title="Product List"
            showUpdatedStatus={showFeedback}
          />

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Product Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.barcode}
                  className={`bg-gray-800 p-4 rounded-lg ${
                    showFeedback && product.barcode === selectedProduct?.barcode
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                >
                  <h4 className="text-lg font-medium text-white">
                    {product.name}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Barcode: {product.barcode}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      onClick={() => handleOpenModal(product)}
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      onClick={() => handleDeleteProduct(product.barcode)}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? "Edit Product" : "Add New Product"}
      >
        <ProductForm
          initialData={selectedProduct}
          onSubmit={handleSubmitForm}
          isLoading={isLoading}
        />
      </Modal>
    </Container>
  );
};
