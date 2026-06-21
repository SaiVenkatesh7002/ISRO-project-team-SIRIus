import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import Results from './pages/Results.jsx';
import Upload from './pages/Upload.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/results/:jobId" element={<Results />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}
