import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProductsAPI } from './productAPI';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const products = await getProductsAPI();
  return products;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], isLoading: false, error: null },
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
      });
  },
});

export default productSlice.reducer;