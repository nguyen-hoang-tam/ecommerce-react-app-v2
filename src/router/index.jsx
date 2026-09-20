import { createBrowserRouter } from 'react-router-dom';
import Signin from '@/pages/Auth/signin';
import Register from '@/pages/Auth/register';
import Home from '../pages/Home/index';


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
]);
