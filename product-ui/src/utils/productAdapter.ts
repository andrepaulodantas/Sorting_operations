/**
 * Adapter class to convert between backend and frontend product formats
 * Following the Adapter pattern for better compatibility
 */
export class ProductAdapter {
  /**
   * Converts backend product format to frontend format
   * @param backendProduct Backend product object
   * @returns Frontend product object
   */
  static toFrontend(backendProduct: any) {
    return {
      barcode: backendProduct.barcode,
      name: backendProduct.item, // backend uses 'item', frontend uses 'name'
      category: backendProduct.category,
      price: backendProduct.price,
      discount: backendProduct.discount,
      available: backendProduct.available === 1, // backend uses 0/1, frontend uses boolean
    };
  }

  /**
   * Converts frontend product format to backend format
   * @param frontendProduct Frontend product object
   * @returns Backend product object
   */
  static toBackend(frontendProduct: any) {
    return {
      barcode: frontendProduct.barcode,
      item: frontendProduct.name, // frontend uses 'name', backend uses 'item'
      category: frontendProduct.category,
      price: frontendProduct.price,
      discount: frontendProduct.discount,
      available: frontendProduct.available ? 1 : 0, // frontend uses boolean, backend uses 0/1
    };
  }

  /**
   * Converts a list of backend products to frontend format
   * @param backendProducts Array of backend product objects
   * @returns Array of frontend product objects
   */
  static toFrontendList(backendProducts: any[]) {
    return backendProducts.map(this.toFrontend);
  }
}
