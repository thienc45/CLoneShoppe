import path from 'src/constants/path.ts'

import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import RegisterLayout from './layouts/RegisterLayout';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import Profile from './pages/Profile';
import Register from './pages/Register';
import { useContext } from 'react';
import { AppContext } from './contexts/app.context';

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext); // Chắc chắn rằng bạn lấy giá trị isAuthenticated từ AppContext
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;

}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext); // Chắc chắn rằng bạn lấy giá trị isAuthenticated từ AppContext
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />;
}

export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: (
            <MainLayout>
              <ProductList />
            </MainLayout>
          )
        },
        {
          path: path.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    }
  ]);
  return routeElements;
}
