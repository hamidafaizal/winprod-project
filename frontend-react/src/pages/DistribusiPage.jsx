import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { setDistribusiCapacity } from '../services/api';
import PieChart from '../components/PieChart';

function DistribusiPage() {
  const { emberCapacity, setEmberCapacity, emberStatus, fetchEmberStatus } = useAppContext();
  const [inputValue, setInputValue] = useState(200);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (emberCapacity) {
      fetchEmberStatus();
    }
  }, [emberCapacity, fetchEmberStatus]);

  const handleConfirmClick = async () => {
    if (inputValue && inputValue > 0 && inputValue % 100 === 0) {
      setIsLoading(true);
      try {
        await setDistribusiCapacity(inputValue);
        setEmberCapacity(inputValue);
      } catch (error) {
        alert('Gagal menyimpan kapasitas ke server.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Nilai kapasitas harus kelipatan 100.');
    }
  };

  if (!emberCapacity) {
    return (
      <div className="flex flex-col items-center justify-center mt-16">
        <div className="w-full max-w-md p-8 bg-[#19386D]/20 rounded-2xl backdrop-blur-xl border border-[#59C6D4]/20">
          <h2 className="text-2xl font-bold text-center text-[#77F7F0] mb-6">Tentukan Kapasitas Batch</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="threshold" className="block text-sm font-medium text-[#59C6D4] mb-2">Kapasitas Ember</label>
              <input type="number" id="threshold" value={inputValue} onChange={(e) => setInputValue(Number(e.target.value))} className="w-full px-4 py-3 bg-black/20 rounded-lg border border-white/10" />
            </div>
            <button onClick={handleConfirmClick} disabled={isLoading} className="w-full py-3 px-4 bg-[#59C6D4] hover:bg-[#77F7F0] text-[#0D194B] font-bold rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50">
              {isLoading ? 'Menyimpan...' : 'Konfirmasi'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const { current_count, links } = emberStatus;
  const percentage = emberCapacity > 0 ? (current_count / emberCapacity) * 100 : 0;
  const linkKurang = emberCapacity - current_count;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 p-6 bg-[#19386D]/20 rounded-2xl backdrop-blur-xl border border-[#59C6D4]/20 flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-white">Progress Batch</h3>
        <PieChart percentage={Math.round(percentage)} />
        <div className="text-center">
          <p className="text-4xl font-bold text-white">{current_count} / {emberCapacity}</p>
          <p className="text-sm text-white/70">Link di Dalam Ember</p>
        </div>
        {linkKurang > 0 && (<p className="text-center text-yellow-400 text-sm">Link masih kurang {linkKurang} lagi.</p>)}
      </div>
      <div className="lg:col-span-2 p-6 bg-[#19386D]/20 rounded-2xl backdrop-blur-xl border border-[#59C6D4]/20">
        <h3 className="text-lg font-semibold text-white mb-4">Daftar Batch Siap Kirim</h3>
        {current_count > 0 ? (
            <div className="text-xs text-white/80 space-y-2 max-h-80 overflow-y-auto pr-2">
                {links.map(link => <div key={link.id} className="bg-black/20 p-2 rounded truncate">{link.link}</div>)}
            </div>
        ) : (
            <div className="text-center py-16"><p className="text-white/60">Belum ada link di dalam ember.</p></div>
        )}
      </div>
    </div>
  );
}

export default DistribusiPage;