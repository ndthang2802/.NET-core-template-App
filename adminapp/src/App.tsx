// import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import { Auth } from './features/auth/Auth';

// function App() {
//   return (
//       <Auth />
//   );
// }

// export default App;
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
  // const navigate = useNavigate();
  const { readyToGetInfomation, isAuth } = useSelector(authSelector);
  useEffect(()=>{
    dispatch(fetchRefreshToken())
  }, [])
  useEffect(()=>{
    if (readyToGetInfomation)
      dispatch(GetUserInformation({}))
  },[readyToGetInfomation])
  
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