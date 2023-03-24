import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import RolePage from './pages/RolePage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GetUserInformation, fetchRefreshToken, authSelector } from 'features/auth/authSlice';
import { useAppDispatch } from './app/hooks';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function Router() {


  //const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { readyToGetInfomation, isAuth } = useSelector(authSelector);
  // useEffect(()=>{
  //   dispatch(fetchRefreshToken())
  // }, [])
  // useEffect(()=>{
  //   dispatch(GetUserInformation({}))
  // },[readyToGetInfomation])
  useEffect(()=>{
    if (isAuth){
      navigate('/dashboard', { replace: true });
    }
    else {
      navigate('/login', { replace: true });
    }
  },[isAuth])

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'role', element: <RolePage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
