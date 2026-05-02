import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com/products';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const apiService = {
  async getProducts(limit = 20, skip = 0): Promise<ProductsResponse> {
    const response = await axios.get(`${API_BASE_URL}?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  async getProductById(id: string | number): Promise<Product> {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  async searchProducts(query: string, limit = 20, skip = 0): Promise<ProductsResponse> {
    const response = await axios.get(`${API_BASE_URL}/search?q=${query}&limit=${limit}&skip=${skip}`);
    return response.data;
  },

  async getCategories(): Promise<string[]> {
    // The DummyJSON API might return objects for categories now, let's map them to strings if needed
    const response = await axios.get(`${API_BASE_URL}/categories`);
    // Some versions of DummyJSON return an array of strings, some return array of objects {slug, name, url}. 
    // We'll handle both just in case.
    if (response.data.length > 0 && typeof response.data[0] === 'object') {
        return response.data.map((c: any) => c.slug || c.name);
    }
    return response.data;
  },

  async getProductsByCategory(category: string, limit = 20, skip = 0): Promise<ProductsResponse> {
    const response = await axios.get(`${API_BASE_URL}/category/${category}?limit=${limit}&skip=${skip}`);
    return response.data;
  }
};
