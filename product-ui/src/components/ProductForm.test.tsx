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
import { vi } from "vitest";

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

  test("renders form with empty fields in create mode", async () => {
    await act(async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    });

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

  test("renders form with product data in edit mode", async () => {
    await act(async () => {
      render(
        <ProductForm
          initialData={mockProduct}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );
    });

    // Check fields are populated with product data
    expect(screen.getByLabelText(/Barcode/i)).toHaveValue(mockProduct.barcode);
    expect(screen.getByLabelText(/Product Name/i)).toHaveValue(
      mockProduct.name
    );
    expect(screen.getByLabelText(/Category/i)).toHaveValue(
      mockProduct.category
    );
    // For numeric fields, we verify the value as a number
    expect(screen.getByLabelText(/Price/i)).toHaveValue(mockProduct.price);
    expect(screen.getByLabelText(/Discount/i)).toHaveValue(
      mockProduct.discount
    );

    // Check checkbox for available is checked
    expect(screen.getByLabelText(/Product is in stock/i)).toBeChecked();
  });

  test("disables barcode field in edit mode", async () => {
    await act(async () => {
      render(
        <ProductForm
          initialData={mockProduct}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );
    });

    expect(screen.getByLabelText(/Barcode/i)).toBeDisabled();
  });

  test("submits form with valid data in create mode", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    });

    // Fill in the form
    await act(async () => {
      await user.type(screen.getByLabelText(/Barcode/i), "74009876");
      await user.type(screen.getByLabelText(/Product Name/i), "New Product");
      await user.type(screen.getByLabelText(/Category/i), "New Category");
      await user.clear(screen.getByLabelText(/Price/i));
      await user.type(screen.getByLabelText(/Price/i), "1599");
      await user.clear(screen.getByLabelText(/Discount/i));
      await user.type(screen.getByLabelText(/Discount/i), "5");
    });

    // Submit the form
    await act(async () => {
      await user.click(screen.getByRole("button", { name: /Save Product/i }));
    });

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

    await act(async () => {
      render(
        <ProductForm
          initialData={mockProduct}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );
    });

    // Update some fields
    await act(async () => {
      await user.clear(screen.getByLabelText(/Product Name/i));
      await user.type(
        screen.getByLabelText(/Product Name/i),
        "Updated Product"
      );
      await user.clear(screen.getByLabelText(/Price/i));
      await user.type(screen.getByLabelText(/Price/i), "2499");

      // Click the checkbox to uncheck it (since it starts checked)
      await user.click(screen.getByLabelText(/Product is in stock/i));
    });

    // Submit the form
    await act(async () => {
      await user.click(screen.getByRole("button", { name: /Save Product/i }));
    });

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

    await act(async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    });

    // Clear any default values and submit the form without filling required fields
    await act(async () => {
      await user.clear(screen.getByLabelText(/Barcode/i));
      await user.clear(screen.getByLabelText(/Product Name/i));
      await user.clear(screen.getByLabelText(/Category/i));
    });

    // Submit the form
    await act(async () => {
      await user.click(screen.getByRole("button", { name: /Save Product/i }));
    });

    // Check validation errors
    expect(screen.getByText(/Barcode is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Product name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Category is required/i)).toBeInTheDocument();

    // onSubmit should not be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("shows validation error for invalid price", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    });

    // Fill in required fields
    await act(async () => {
      await user.type(screen.getByLabelText(/Barcode/i), "12345678");
      await user.type(screen.getByLabelText(/Product Name/i), "Test Product");
      await user.type(screen.getByLabelText(/Category/i), "Test Category");
    });

    // We need to specifically set a negative price as a separate step
    const priceInput = screen.getByLabelText(/Price/i);
    await act(async () => {
      await user.clear(priceInput);
      fireEvent.change(priceInput, { target: { value: "-100" } });
      fireEvent.blur(priceInput);
    });

    // Submit the form - wrap in waitFor to ensure validation runs
    await act(async () => {
      const submitButton = screen.getByRole("button", {
        name: /Save Product/i,
      });
      await user.click(submitButton);
    });

    // Use waitFor to wait for validation
    await waitFor(() => {
      // Check that onSubmit was not called (validation failed)
      expect(mockOnSubmit).not.toHaveBeenCalled();

      // Check that there's at least one error message
      const errorMessages = document.querySelectorAll(".text-red-500");
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  test("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /Cancel/i }));
    });

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
