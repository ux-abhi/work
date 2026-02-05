import { Routes, Route } from 'react-router-dom';
import CreatePage from './pages/CreatePage';
import ResultPage from './pages/ResultPage';
import './styles/global.css';

/**
 * App shell with two routes:
 * - / : Create a new smart link
 * - /result/:slug : View created smart link with sharing options
 */
export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<CreatePage />} />
        <Route path="/result/:slug" element={<ResultPage />} />
      </Routes>
    </div>
  );
}
