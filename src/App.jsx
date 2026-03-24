import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import PayByLink from './pages/PayByLink';
import DropIn from './pages/DropIn';
import Capital from './pages/Capital';
import TerminalAPI from './pages/TerminalAPI';

import MainLayout from './layout/MainLayout';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dropin" element={<DropIn />} />
        <Route path="/tapi" element={<TerminalAPI />} />
        <Route path="/paybylink" element={<PayByLink />} />
        <Route path="/capital" element={<Capital />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
