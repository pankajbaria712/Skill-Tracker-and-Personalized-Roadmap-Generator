// src/contexts/RouterContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const RouterContext = createContext();

// Mock Link component for Dashboard components
const Link = ({ to, children, ...props }) => {
  const { navigateTo } = useContext(RouterContext);
  return (
    <button
      onClick={() => navigateTo(to.replace("/", ""))}
      {...props}
      className="text-left"
    >
      {children}
    </button>
  );
};

export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  const navigateTo = (to) => {
    // In a real app, we'd use `history.pushState`
    const newPath = `/${to.toLowerCase()}`;
    window.history.pushState({}, "", newPath);
    setCurrentPath(newPath);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigateTo, Link }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
};

export const useNavigate = () => {
  const { navigateTo } = useContext(RouterContext);
  return navigateTo;
};
