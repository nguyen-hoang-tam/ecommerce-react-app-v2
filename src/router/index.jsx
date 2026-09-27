import { createBrowserRouter } from 'react-router-dom';
import Signin from '@/pages/Auth/signin';
import Register from '@/pages/Auth/register';
import Home from '../pages/Home/index';
import ProductDetail from '../pages/ProductDetail/index'
import Payment from '../pages/Payment/index'


export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Signin />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/home',
    element: <Home />,
  },
    {
    path: '/productdetail/:id',
    element: <ProductDetail />,
  },
  {
    path: '/payment/:id',
    element: <Payment />,
  },
]);
