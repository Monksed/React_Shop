import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./routes/Main";
import CartPage from "./routes/Cart";
import ProductPage from "./routes/ProductPage";
import { BackButtonProvider } from "./contexts/BackButtonContext";
import UserPage from "./routes/UserPage";

const AppRouter = () => {
  return (
    <Router>
      <BackButtonProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </BackButtonProvider>
    </Router>
  );
};

export default AppRouter;
