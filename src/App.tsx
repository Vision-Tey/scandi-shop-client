import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/homePage';
import ProductDetails from './pages/productDetail';
import { useStateValue } from './context/StateProvider';
import { SET_ACTIVE_CATEGORY } from './constants/constants';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <>
            <Header />
            <HomePage />
          </>
        } />
        <Route path='/:category' element={
          <CategoryRouteWrapper  />
        } />

        <Route path="/product/:id" element={
          <>
            <Header />
            <ProductDetails />
          </>
        } />
      </Routes>
    </Router>
  );
};


const CategoryRouteWrapper: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { dispatch } = useStateValue();
  useEffect(() => {
    if (dispatch) {
      dispatch({ type: SET_ACTIVE_CATEGORY, active: category ?? '' });
    }
  }, [category, dispatch]);

  return (
    <>
      <Header />
      <HomePage />
    </>
  );
};

export default App;
