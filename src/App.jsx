import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import PayByLink from './pages/PayByLink';

import MainLayout from './layout/MainLayout';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paybylink" element={<PayByLink />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
