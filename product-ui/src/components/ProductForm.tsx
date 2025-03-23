import React, { useState, useEffect } from "react";
import { Product } from "../types/product";
import { Save, X } from "lucide-react";

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (product: Omit<Product, "id">) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category: "",
    price: 0,
    discount: 0,
    available: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        barcode: initialData.barcode || "",
        category: initialData.category || "",
        price: initialData.price || 0,
        discount: initialData.discount || 0,
        available:
          initialData.available !== undefined ? initialData.available : true,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.barcode.trim()) {
      newErrors.barcode = "Barcode is required";
    } else if (!/^[0-9]{8}$/.test(formData.barcode)) {
      newErrors.barcode = "Barcode must be 8 digits";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (formData.discount < 0 || formData.discount > 100) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        name: formData.name,
        barcode: formData.barcode,
        category: formData.category,
        price: formData.price,
        discount: formData.discount,
        available: formData.available,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-gray-700 border ${
            errors.name ? "border-red-500" : "border-gray-600"
          } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="barcode"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Barcode
        </label>
        <input
          type="text"
          id="barcode"
          name="barcode"
          value={formData.barcode}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-gray-700 border ${
            errors.barcode ? "border-red-500" : "border-gray-600"
          } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={!!initialData}
        />
        {errors.barcode && (
          <p className="mt-1 text-sm text-red-500">{errors.barcode}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-gray-700 border ${
            errors.category ? "border-red-500" : "border-gray-600"
          } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-700 border ${
              errors.price ? "border-red-500" : "border-gray-600"
            } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
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
            min="0"
            max="100"
            value={formData.discount}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-700 border ${
              errors.discount ? "border-red-500" : "border-gray-600"
            } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.discount && (
            <p className="mt-1 text-sm text-red-500">{errors.discount}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="available"
          name="available"
          checked={formData.available}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
        />
        <label
          htmlFor="available"
          className="text-sm font-medium text-gray-300"
        >
          Product is in stock
        </label>
      </div>

      <div className="pt-4 flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white ${
            isLoading
              ? "bg-blue-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
        >
          {isLoading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
};
