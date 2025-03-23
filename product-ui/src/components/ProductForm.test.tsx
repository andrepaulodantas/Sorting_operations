import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProductForm } from "./ProductForm";
import { Product } from "../types/product";
import userEvent from "@testing-library/user-event";

describe("ProductForm Component", () => {
  const mockProduct: Product = {
    barcode: "74001234",
    name: "Test Product",
    category: "Test Category",
    price: 1999,
    discount: 10,
    available: true,
  };

  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders form with empty fields in create mode", () => {
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Check form elements are rendered
    expect(screen.getByLabelText(/Barcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Discount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product is in stock/i)).toBeInTheDocument();

    // Check buttons
    expect(
      screen.getByRole("button", { name: /Save Product/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();

    // Check fields are empty
    expect(screen.getByLabelText(/Barcode/i)).toHaveValue("");
    expect(screen.getByLabelText(/Product Name/i)).toHaveValue("");
  });

  test("renders form with product data in edit mode", () => {
    render(
      <ProductForm
        initialData={mockProduct}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Check fields are populated with product data
    expect(screen.getByLabelText(/Barcode/i)).toHaveValue(mockProduct.barcode);
    expect(screen.getByLabelText(/Product Name/i)).toHaveValue(
      mockProduct.name
    );
    expect(screen.getByLabelText(/Category/i)).toHaveValue(
      mockProduct.category
    );
    // Para campos numéricos, verificamos o valor como number
    expect(screen.getByLabelText(/Price/i)).toHaveValue(mockProduct.price);
    expect(screen.getByLabelText(/Discount/i)).toHaveValue(
      mockProduct.discount
    );

    // Check checkbox for available is checked
    expect(screen.getByLabelText(/Product is in stock/i)).toBeChecked();
  });

  test("disables barcode field in edit mode", () => {
    render(
      <ProductForm
        initialData={mockProduct}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/Barcode/i)).toBeDisabled();
  });

  test("submits form with valid data in create mode", async () => {
    const user = userEvent.setup();

    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill in the form
    await user.type(screen.getByLabelText(/Barcode/i), "74009876");
    await user.type(screen.getByLabelText(/Product Name/i), "New Product");
    await user.type(screen.getByLabelText(/Category/i), "New Category");
    await user.clear(screen.getByLabelText(/Price/i));
    await user.type(screen.getByLabelText(/Price/i), "1599");
    await user.clear(screen.getByLabelText(/Discount/i));
    await user.type(screen.getByLabelText(/Discount/i), "5");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Save Product/i }));

    // Check if onSubmit was called with the right data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      barcode: "74009876",
      name: "New Product",
      category: "New Category",
      price: 1599,
      discount: 5,
      available: true,
    });
  });

  test("submits form with valid data in edit mode", async () => {
    const user = userEvent.setup();

    render(
      <ProductForm
        initialData={mockProduct}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Update some fields
    await user.clear(screen.getByLabelText(/Product Name/i));
    await user.type(screen.getByLabelText(/Product Name/i), "Updated Product");
    await user.clear(screen.getByLabelText(/Price/i));
    await user.type(screen.getByLabelText(/Price/i), "2499");

    // Click the checkbox to uncheck it (since it starts checked)
    await user.click(screen.getByLabelText(/Product is in stock/i));

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Save Product/i }));

    // Check if onSubmit was called with the right data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      barcode: "74001234",
      name: "Updated Product",
      category: "Test Category",
      price: 2499,
      discount: 10,
      available: false,
    });
  });

  test("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();

    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Clear any default values and submit the form without filling required fields
    await user.clear(screen.getByLabelText(/Barcode/i));
    await user.clear(screen.getByLabelText(/Product Name/i));
    await user.clear(screen.getByLabelText(/Category/i));

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Save Product/i }));

    // Check validation errors
    expect(screen.getByText(/Barcode is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Product name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Category is required/i)).toBeInTheDocument();

    // onSubmit should not be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("shows validation error for invalid price", async () => {
    // First, render the form
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Barcode/i), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "Test Product" },
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: "Test Category" },
    });

    // Set a negative price
    fireEvent.change(screen.getByLabelText(/Price \(\$\)/i), {
      target: { value: "-100" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Save Product/i }));

    // Check for error message
    expect(
      screen.getByText("Price must be a positive number")
    ).toBeInTheDocument();

    // onSubmit should not have been called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
