import React, { useState, useEffect } from "react";
import { Product } from "../types/product";
import { Save, X } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultProduct: Product = {
  barcode: "",
  name: "",
  category: "",
  price: 0,
  discount: 0,
  available: true,
};

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Product>(product || defaultProduct);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : Number(value),
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.barcode) {
      newErrors.barcode = "Barcode is required";
    }

    if (!formData.name) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (formData.price < 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (formData.discount < 0 || formData.discount > 100) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="barcode"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Barcode*
          </label>
          <input
            type="text"
            id="barcode"
            name="barcode"
            value={formData.barcode}
            onChange={handleChange}
            disabled={!!product} // Disable barcode field when editing
            className="input w-full"
            placeholder="Enter product barcode"
          />
          {errors.barcode && (
            <p className="text-red-500 text-xs mt-1">{errors.barcode}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Product Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input w-full"
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Category*
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input w-full"
            placeholder="Enter product category"
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Price*
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="1"
            className="input w-full"
            placeholder="Enter product price"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Discount (%)
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            max="100"
            className="input w-full"
            placeholder="Enter discount percentage"
          />
          {errors.discount && (
            <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
          )}
        </div>

        <div className="flex items-center h-full pt-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-primary-500 rounded border-gray-600 bg-gray-800 focus:ring-0"
            />
            <span className="ml-2 text-sm text-gray-300">Available</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline px-4 py-2"
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary px-4 py-2"
          disabled={isLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
};
