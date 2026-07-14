import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppLayout from './layout/AppLayout';

import Home from './pages/Home';
import Disease from './pages/Disease';
import Crop from './pages/Crop';
import Yield from './pages/Yield';
import Report from './pages/Report';
import FarmAssistant from './pages/FarmAssistant';
import PesticideAuth from './pages/PesticideAuth';

function AppRoutes() {
  const location = useLocation();

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/disease" element={<Disease />} />
          <Route path="/crop" element={<Crop />} />
          <Route path="/yield" element={<Yield />} />
          <Route path="/report" element={<Report />} />
          <Route path="/farm-assistant" element={<FarmAssistant />} />
          <Route path="/pesticide-auth" element={<PesticideAuth />} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
}

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
