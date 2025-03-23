import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { FilterPage } from "./pages/FilterPage";
import { SortedPage } from "./pages/SortedPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ManageProductsPage } from "./pages/ManageProductsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#2D3748",
                color: "#ffffff",
                border: "1px solid #4A5568",
                padding: "16px",
                borderRadius: "6px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                fontWeight: 500,
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#38A169",
                  secondary: "#ffffff",
                },
                style: {
                  border: "1px solid #2F855A",
                },
              },
              error: {
                iconTheme: {
                  primary: "#E53E3E",
                  secondary: "#ffffff",
                },
                style: {
                  border: "1px solid #C53030",
                },
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="filter" element={<FilterPage />} />
                <Route path="sorted" element={<SortedPage />} />
                <Route path="manage" element={<ManageProductsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
};

export default App;
