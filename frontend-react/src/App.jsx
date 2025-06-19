// src/App.jsx
import { useState } from 'react';
import Header from './components/Header';
import DistribusiPage from './pages/DistribusiPage';
import RisetPage from './pages/RisetPage';
import KomregPage from './pages/KomregPage';

function App() {
  const [activePage, setActivePage] = useState('distribusi');

  // Fungsi sederhana untuk memilih komponen Halaman mana yang akan ditampilkan
  const renderPage = () => {
    switch (activePage) {
      case 'riset': return <RisetPage />;
      case 'komreg': return <KomregPage />;
      case 'distribusi':
      default: return <DistribusiPage />;
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed font-sans" 
      style={{ backgroundImage: "url('/assets/background.jpg')" }}
    >
      <div className="min-h-screen w-full bg-[#040529]/70 backdrop-blur-md p-4 sm:p-6">
        
        {/* Header sekarang tidak butuh props apa pun selain untuk navigasi */}
        <Header activePage={activePage} setActivePage={setActivePage} />
        
        <main className="mt-8">
          {renderPage()}
        </main>
        
      </div>
    </div>
  );
}
export default App;
