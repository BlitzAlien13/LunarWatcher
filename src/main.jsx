import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/index";

// Check for token in URL and store it
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
if (token) {
  localStorage.setItem("jwToken", token);
  // Remove token from URL
  window.history.replaceState({}, document.title, window.location.pathname);
}

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <div className="antialiased">
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
      </Routes>
    </BrowserRouter>
  </div>,
);
