import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ProductList} from './Components/ProductList';
import { Product } from './Components/Product';

function App() {

  var x = [
            <Product  ImageLink={"https://www.pngmart.com/files/22/Honedge-Pokemon-PNG-Pic.png"} ProductName = "Honedge" ProductPrice = {1000} ProductRating={3} ProductDiscount = {0.5} />,
            <Product  ImageLink={"https://www.pngmart.com/files/22/Arceus-Pokemon-PNG-Isolated-Photo.png"} ProductName = "Arceus" ProductPrice = {2000} ProductRating={5} ProductDiscount = {0.8} />,
            <Product  ImageLink={"https://www.pngmart.com/files/12/Stuart-Minion-PNG-Clipart.png"} ProductName = "Stuart" ProductPrice = {700} ProductRating={4.5} ProductDiscount = {0.2} />
  ]

  return (
    <div style={{ width : '20%', height : '400px' }}>
      <ProductList Product={x} />
    </div>
  );
}

export default App;
