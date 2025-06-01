import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx'; // Adjust path as needed

const App = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== '/signup';
  return (
    <div className="flex bg-black">
      {showSidebar && <Sidebar />}
      <div className="ml-64 w-full my-4 mr-4  p-6">
        <Outlet /> {/* Renders the routed page */}
      </div>
    </div>
  );
};

export default App;