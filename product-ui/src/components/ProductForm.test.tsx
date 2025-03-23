import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductForm from "./ProductForm";
import { Product } from "../types/Product";
import userEvent from "@testing-library/user-event";

// Mock the API service
jest.mock("../services/api", () => ({
  createProduct: jest.fn().mockResolvedValue({ status: 201 }),
  updateProduct: jest.fn().mockResolvedValue({ status: 200 }),
}));

describe("ProductForm Component", () => {
  const mockProduct: Product = {
    barcode: "74001234",
    item: "Test Product",
    category: "Test Category",
    price: 1999,
    discount: 10,
    available: 1,
  };

  const mockOnSubmitSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form with empty fields in create mode", () => {
    render(
      <ProductForm
        mode="create"
        onSubmitSuccess={mockOnSubmitSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Check form elements are rendered
    expect(screen.getByLabelText(/Barcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Item/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Discount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Available/i)).toBeInTheDocument();

    // Check buttons
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();

    // Check fields are empty
    expect(screen.getByLabelText(/Barcode/i)).toHaveValue("");
    expect(screen.getByLabelText(/Item/i)).toHaveValue("");
  });

  test("renders form with product data in edit mode", () => {
    render(
      <ProductForm
        mode="edit"
        product={mockProduct}
        onSubmitSuccess={mockOnSubmitSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Check fields are populated with product data
    expect(screen.getByLabelText(/Barcode/i)).toHaveValue(mockProduct.barcode);
    expect(screen.getByLabelText(/Item/i)).toHaveValue(mockProduct.item);
    expect(screen.getByLabelText(/Category/i)).toHaveValue(
      mockProduct.category
    );
    expect(screen.getByLabelText(/Price/i)).toHaveValue(
      mockProduct.price.toString()
    );
    expect(screen.getByLabelText(/Discount/i)).toHaveValue(
      mockProduct.discount.toString()
    );

    // Check radio button for available=1 is selected
    expect(screen.getByLabelText(/Yes/i)).toBeChecked();
  });

  test("disables barcode field in edit mode", () => {
    render(
      <ProductForm
        mode="edit"
        product={mockProduct}
        onSubmitSuccess={mockOnSubmitSuccess}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/Barcode/i)).toBeDisabled();
  });

  test("submits form with valid data in create mode", async () => {
    const { createProduct } = require("../services/api");

    render(
      <ProductForm
        mode="create"
        onSubmitSuccess={mockOnSubmitSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Fill in the form
    userEvent.type(screen.getByLabelText(/Barcode/i), "74009876");
    userEvent.type(screen.getByLabelText(/Item/i), "New Product");
    userEvent.type(screen.getByLabelText(/Category/i), "New Category");
    userEvent.type(screen.getByLabelText(/Price/i), "1599");
    userEvent.type(screen.getByLabelText(/Discount/i), "5");
    userEvent.click(screen.getByLabelText(/Yes/i));

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith({
        barcode: "74009876",
        item: "New Product",
        category: "New Category",
        price: 1599,
        discount: 5,
        available: 1,
      });
      expect(mockOnSubmitSuccess).toHaveBeenCalled();
    });
  });

  test("submits form with valid data in edit mode", async () => {
    const { updateProduct } = require("../services/api");

    render(
      <ProductForm
        mode="edit"
        product={mockProduct}
        onSubmitSuccess={mockOnSubmitSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Update some fields
    userEvent.clear(screen.getByLabelText(/Item/i));
    userEvent.type(screen.getByLabelText(/Item/i), "Updated Product");
    userEvent.clear(screen.getByLabelText(/Price/i));
    userEvent.type(screen.getByLabelText(/Price/i), "2499");
    userEvent.click(screen.getByLabelText(/No/i));

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalledWith({
        barcode: "74001234",
        item: "Updated Product",
        category: "Test Category",
        price: 2499,
        discount: 10,
        available: 0,
      });
      expect(mockOnSubmitSuccess).toHaveBeenCalled();
    });
  });

  test("shows validation errors for empty required fields", async () => {
    render(
      <ProductForm
        mode="create"
        onSubmitSuccess={mockOnSubmitSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Submit the form without filling in any fields
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/Barcode is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Item is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Category is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Price is required/i)).toBeInTheDocument();
    });

    // API should not be called
    const { createProduct } = require("../services/api");
    expect(createProduct).not.toHaveBeenCalled();
  });

  test("shows validation error for invalid price", async () => {
    render(
      <ProductForm
        mode="create"
        onSubmitSuccess={mockOnSubmitSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Fill in the form with invalid price
    userEvent.type(screen.getByLabelText(/Barcode/i), "74009876");
    userEvent.type(screen.getByLabelText(/Item/i), "New Product");
    userEvent.type(screen.getByLabelText(/Category/i), "New Category");
    userEvent.type(screen.getByLabelText(/Price/i), "-100");
    userEvent.type(screen.getByLabelText(/Discount/i), "5");

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Check validation error for price
    await waitFor(() => {
      expect(
        screen.getByText(/Price must be greater than 0/i)
      ).toBeInTheDocument();
    });

    // API should not be called
    const { createProduct } = require("../services/api");
    expect(createProduct).not.toHaveBeenCalled();
  });

  test("calls onCancel when cancel button is clicked", () => {
    render(
      <ProductForm
        mode="create"
        onSubmitSuccess={mockOnSubmitSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
