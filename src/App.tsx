import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Apod from './pages/Apod';
import MarsPhotos from './pages/MarsPhotos';
import Asteroids from './pages/Asteroids';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Apod />} />
        <Route path="/marte" element={<MarsPhotos />} />
        <Route path="/asteroides" element={<Asteroids />} />
      </Routes>
    </Router>
  );
}
