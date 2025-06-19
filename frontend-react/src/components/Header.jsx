// src/components/Header.jsx
import { useAppContext } from '../context/AppContext';

function Header({ activePage, setActivePage }) {
  // Ambil state 'emberCapacity' dari context.
  // Ini akan secara otomatis me-render ulang komponen ini saat nilainya berubah.
  const { emberCapacity } = useAppContext(); 
  
  const getNavStyle = (pageName) => {
    return activePage === pageName 
      ? 'bg-white/10 text-white font-semibold' 
      : 'text-neutral-300 hover:bg-white/5 hover:text-white';
  };
  const lockedStyle = "cursor-not-allowed opacity-40";

  return (
    <header className="sticky top-4 mx-auto max-w-7xl rounded-2xl bg-[#19386D]/30 backdrop-blur-xl border border-[#59C6D4]/30 shadow-2xl z-50">
      <nav className="flex items-center justify-between p-3 px-4">
        <div>
          <img src="/assets/logo.png" alt="WINPROD Logo" className="h-9 sm:h-10" /> 
        </div>
        
        {/* Navigasi Tengah */}
        <div className="hidden md:flex items-center space-x-1 rounded-lg bg-black/20 p-1">
          <button 
            onClick={() => setActivePage('distribusi')} 
            className={`px-4 py-2 rounded-md text-sm transition-colors duration-200 ${getNavStyle('distribusi')}`}
          >
            Distribusi Link
          </button>
          {/* Tombol ini akan aktif/non-aktif berdasarkan nilai emberCapacity */}
          <button 
            onClick={() => emberCapacity && setActivePage('riset')} 
            disabled={!emberCapacity} 
            className={`px-4 py-2 rounded-md text-sm transition-colors duration-200 ${!emberCapacity ? lockedStyle : getNavStyle('riset')}`}
          >
            Upload File Riset
          </button>
          <button 
            onClick={() => emberCapacity && setActivePage('komreg')} 
            disabled={!emberCapacity} 
            className={`px-4 py-2 rounded-md text-sm transition-colors duration-200 ${!emberCapacity ? lockedStyle : getNavStyle('komreg')}`}
          >
            Komreg
          </button>
        </div>
        
        {/* Navigasi Kanan */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-sm font-medium text-neutral-300 hover:text-white">Login</button>
          <button className="rounded-md bg-[#59C6D4] px-4 py-2 text-sm font-bold text-[#0D194B] hover:bg-[#77F7F0] transition-all duration-200 transform hover:scale-105">Trial</button>
        </div>

        {/* Placeholder untuk menu mobile */}
        <div className="md:hidden">
          <button className="p-2">
             <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
export default Header;
