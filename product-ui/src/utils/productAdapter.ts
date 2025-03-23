/**
 * Adapter class to convert between backend and frontend product formats
 * Following the Adapter pattern for better compatibility
 */
export class ProductAdapter {
  /**
   * Calculates the final price with discount applied
   * @param price Original price
   * @param discount Discount percentage
   * @returns Price with discount applied
   */
  static calculateFinalPrice(price: number, discount: number): number {
    return Math.round((price * (100 - discount)) / 100);
  }

  /**
   * Converts backend product format to frontend format
   * @param backendProduct Backend product object
   * @returns Frontend product object
   */
  static toFrontend(backendProduct: any) {
    console.log("Converting backend product to frontend:", backendProduct);

    if (!backendProduct) {
      console.error("Backend product is undefined or null");
      return null;
    }

    const frontendProduct = {
      barcode: backendProduct.barcode || "",
      name: backendProduct.item || "", // backend uses 'item', frontend uses 'name'
      category: backendProduct.category || "",
      price: backendProduct.price || 0,
      discount: backendProduct.discount || 0,
      available: backendProduct.available === 1, // backend uses 0/1, frontend uses boolean
      finalPrice:
        backendProduct.finalPrice ||
        this.calculateFinalPrice(
          backendProduct.price || 0,
          backendProduct.discount || 0
        ),
    };

    console.log("Converted to frontend product:", frontendProduct);
    return frontendProduct;
  }

  /**
   * Converts frontend product format to backend format
   * @param frontendProduct Frontend product object
   * @returns Backend product object
   */
  static toBackend(frontendProduct: any) {
    console.log("Converting frontend product to backend:", frontendProduct);

    if (!frontendProduct) {
      console.error("Frontend product is undefined or null");
      throw new Error(
        "Cannot convert undefined or null product to backend format"
      );
    }

    if (!frontendProduct.barcode) {
      console.error("Frontend product is missing required barcode field");
      throw new Error("Product barcode is required");
    }

    if (!frontendProduct.name) {
      console.error("Frontend product is missing required name field");
      throw new Error("Product name is required");
    }

    const backendProduct = {
      barcode: frontendProduct.barcode,
      item: frontendProduct.name, // frontend uses 'name', backend uses 'item'
      category: frontendProduct.category || "",
      price: frontendProduct.price || 0,
      discount: frontendProduct.discount || 0,
      available: frontendProduct.available ? 1 : 0, // frontend uses boolean, backend uses 0/1
    };

    console.log("Converted to backend product:", backendProduct);
    return backendProduct;
  }

  /**
   * Converts a list of backend products to frontend format
   * @param backendProducts Array of backend product objects
   * @returns Array of frontend product objects
   */
  static toFrontendList(backendProducts: any[]) {
    console.log(
      "Converting backend product list to frontend list:",
      backendProducts
    );

    if (!Array.isArray(backendProducts)) {
      console.error("Backend product list is not an array:", backendProducts);
      return [];
    }

    return backendProducts
      .filter((product) => product) // Filter out null/undefined entries
      .map(this.toFrontend);
  }
}
