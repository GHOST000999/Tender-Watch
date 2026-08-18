import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Browser from './pages/Browser';
import Tenders from './pages/Tenders';
import Company from './pages/Company';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/browser" element={<Browser />} />
          <Route path="/tenders" element={<Tenders />} />
          <Route path="/company" element={<Company />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
