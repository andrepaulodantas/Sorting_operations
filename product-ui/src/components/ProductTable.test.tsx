import React from "react";
import { render, screen } from "@testing-library/react";
import { ProductTable } from "./ProductTable";
import { Product } from "../types/product";

describe("ProductTable Component", () => {
  const mockProducts: Product[] = [
    {
      barcode: "74001755",
      name: "Ball Gown",
      category: "Full Body Outfits",
      price: 35.48,
      discount: 7,
      available: true,
    },
    {
      barcode: "74002423",
      name: "Shawl",
      category: "Accessories",
      price: 7.58,
      discount: 12,
      available: true,
    },
    {
      barcode: "74005123",
      name: "Denim Jeans",
      category: "Bottoms",
      price: 12.0,
      discount: 0,
      available: false,
    },
  ];

  test("renders empty state when no products are provided", () => {
    render(<ProductTable products={[]} />);
    expect(screen.getByText("No products found")).toBeInTheDocument();
    expect(
      screen.getByText("There are no products to display.")
    ).toBeInTheDocument();
  });

  test("renders products table with correct data", () => {
    render(<ProductTable products={mockProducts} />);

    // Check table headers
    expect(screen.getByText("Barcode")).toBeInTheDocument();
    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Discount")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();

    // Check product data
    expect(screen.getByText("Ball Gown")).toBeInTheDocument();
    expect(screen.getByText("Accessories")).toBeInTheDocument();
    expect(screen.getByText("$35.48")).toBeInTheDocument();
    expect(screen.getByText("7%")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  test("renders with custom title", () => {
    const customTitle = "Custom Product List";
    render(<ProductTable products={mockProducts} title={customTitle} />);
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  test("handles available/unavailable states correctly", () => {
    render(<ProductTable products={mockProducts} />);

    // We expect to see both "Yes" and "No" for availability
    const yesElements = screen.getAllByText("Yes");
    const noElements = screen.getAllByText("No");

    expect(yesElements.length).toBe(2); // 2 available products
    expect(noElements.length).toBe(1); // 1 unavailable product
  });

  test('displays "Showing X products" with correct count', () => {
    render(<ProductTable products={mockProducts} />);
    expect(
      screen.getByText(`Showing ${mockProducts.length} products`)
    ).toBeInTheDocument();

    // Test singular form
    render(<ProductTable products={[mockProducts[0]]} />);
    expect(screen.getByText(`Showing 1 product`)).toBeInTheDocument();
  });
});
