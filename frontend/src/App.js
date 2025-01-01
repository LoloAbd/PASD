import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import ImageSlider from './Components/ImageSlider';
import Architects from './Components/DataManagement/Architects/Architects';
import ShowBuildings from './Components/DataManagement/Buildings/ShowBuildings';
import Cities from './Components/DataManagement/City/Cities';
import Notaries from './Components/DataManagement/Notary/Notaries';
import Owners from './Components/DataManagement/Owners/Owners';
import Tenants from './Components/DataManagement/Tenant/Tenant';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  // Function to check localStorage for login status
  const getLocalStorageWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiryTime) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  useEffect(() => {
    // Check login status on initial render
    const loginStatus = getLocalStorageWithExpiry('isLogin');
    setIsLogin(!!loginStatus); // Set state based on login status
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLogin'); // Clear login status
    setIsLogin(false); // Update state
  };

  return (
    <BrowserRouter>
      <Routes>
        {isLogin ? (
          <>
            <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
            <Route path="/ImageSlider" element={<ImageSlider />} />
            <Route path="/Architects" element={<Architects />} />
            <Route path="/ShowBuildings" element={<ShowBuildings />} />
            <Route path="/Cities" element={<Cities />} />
            <Route path="/Notaries" element={<Notaries />} />
            <Route path="/Owners" element={<Owners />} />
            <Route path="/Tenants" element={<Tenants />} />
          </>
        ) : (
          <Route path="*" element={<Login onLogin={() => setIsLogin(true)} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
