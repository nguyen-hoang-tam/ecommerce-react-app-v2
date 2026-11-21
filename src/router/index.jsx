import { createBrowserRouter, Navigate } from 'react-router-dom';
import Signin from '@/pages/Auth/signin';
import Register from '@/pages/Auth/register';
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import Payment from '@/pages/Payment';
import OrderSuccess from '@/pages/OrderSuccess';
import AddToCartSuccess from '@/pages/AddToCartSuccess';
import ShoppingCart from '@/pages/ShoppingCart';
import OrderDetail from '@/pages/OrderDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Signin />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/productdetail/:id',
    element: <ProductDetail />,
  },
  {
    path: '/payment/:id',
    element: <Payment />,
  },
  {
    path: '/ordersuccess',
    element: <OrderSuccess />,
  },
  {
    path: '/addtocart/:id',
    element: <AddToCartSuccess />,
  },
  {
    path: '/shoppingcart',
    element: <ShoppingCart />,
  },
  {
    path: '/orderdetail/:id',
    element: <OrderDetail />,
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);
