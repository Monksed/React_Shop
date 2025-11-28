import React, { useEffect } from "react";
import AppRouter from "./router";
import { checkForNewVersion } from "./versionCheck";
import { CartProvider } from "./contexts/CartContext";

export default function App() {
  useEffect(() => {
    checkForNewVersion();
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      document.documentElement.classList.add("is-iphone");
    }
  }, []);

  return (
    <CartProvider>
    <AppRouter />
    </CartProvider>
  );
}
