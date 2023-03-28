
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GetUserInformation, fetchRefreshToken, authSelector } from 'features/auth/authSlice';
import { useAppDispatch } from './app/hooks';

// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useAppDispatch();
  const { readyToGetInfomation, } = useSelector(authSelector);
  useEffect(()=>{
    dispatch(fetchRefreshToken())
  }, [dispatch])
  useEffect(()=>{
    if (readyToGetInfomation)
      dispatch(GetUserInformation({}))
  },[readyToGetInfomation, dispatch])
  
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}