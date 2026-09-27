import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProductsAPI, getProductByIdAPI } from './productAPI';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const products = await getProductsAPI();
  return products;
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id) => {
  const product = await getProductByIdAPI(id);
  return product;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], isLoading: false, error: null, currentProduct: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(fetchProductById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export default productSlice.reducer;