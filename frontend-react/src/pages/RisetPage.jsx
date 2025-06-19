// src/pages/RisetPage.jsx
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { uploadRisetFiles, getFilteredLinks, resetRisetData } from '../services/api';
import HasilFilterTable from '../components/HasilFilterTable';

function RisetPage() {
  // Ambil state global dari Context
  const { thresholdKomisi, setThresholdKomisi, filteredLinks, setFilteredLinks, resetCycle } = useAppContext();
  
  // State lokal khusus untuk halaman ini
  const [rank, setRank] = useState(50);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Ambil data link saat pertama kali halaman ini dimuat
  useEffect(() => {
    fetchLinks();
  }, []);

  // === FUNGSI YANG HILANG SEBELUMNYA ADA DI SINI ===
  const handleFileChange = (event) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };
  // =================================================

  const fetchLinks = async () => {
    try {
      const response = await getFilteredLinks();
      setFilteredLinks(response.data);
    } catch (err) {
      setError('Gagal mengambil data hasil filter yang sudah ada.');
    }
  };
  
  const handleProsesClick = async () => {
    if (!rank || files.length === 0 || !thresholdKomisi) {
      setError('Mohon isi Angka Rank, Threshold Komisi, dan pilih File CSV.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('rank', rank);
    formData.append('threshold_komisi', thresholdKomisi);
    files.forEach(file => formData.append('files[]', file));

    try {
      const response = await uploadRisetFiles(formData);
      setSuccessMessage(response.data.message);
      await fetchLinks(); // Ambil data terbaru setelah proses sukses
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat memproses file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetClick = async () => {
    if (window.confirm('Apakah Anda yakin ingin mereset semua data link? Aksi ini akan mengosongkan tabel hasil filter.')) {
        setIsLoading(true);
        try {
            await resetRisetData();
            resetCycle(); // Reset state global
            alert('Data riset berhasil direset.');
        } catch (error) {
            alert('Gagal mereset data di server.');
        } finally {
            setIsLoading(false);
        }
    }
  };

  const copyToClipboard = (batchIndex) => {
    const batchSize = 100;
    const start = batchIndex * batchSize;
    const end = start + batchSize;
    const linksToCopy = filteredLinks.slice(start, end).map(item => item.link).join('\n');
    
    // Menggunakan API Clipboard yang modern
    navigator.clipboard.writeText(linksToCopy).then(() => {
        alert(`${end - start} link dari batch #${batchIndex + 1} berhasil disalin ke clipboard!`);
    }).catch(err => {
        console.error('Gagal menyalin:', err);
        alert('Gagal menyalin ke clipboard.');
    });
  };

  // Logika untuk membuat tombol-tombol copy secara dinamis
  const copyButtons = [];
  if (filteredLinks && filteredLinks.length > 0) {
      for (let i = 0; i < Math.ceil(filteredLinks.length / 100); i++) {
        const start = i * 100 + 1;
        const end = Math.min((i + 1) * 100, filteredLinks.length);
        copyButtons.push(
            <button key={i} onClick={() => copyToClipboard(i)} className="text-sm font-medium text-[#59C6D4] hover:text-[#77F7F0] transition-colors">
                COPY ({start}-{end})
            </button>
        );
      }
  }

  return (
    <div className="space-y-8">
      {/* Card untuk Input & Upload */}
      <div className="w-full p-8 bg-[#19386D]/20 rounded-2xl backdrop-blur-xl border border-[#59C6D4]/20">
        <h2 className="text-2xl font-bold text-[#77F7F0] mb-6">1. Upload File Riset (.csv)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <div>
              <label htmlFor="rank" className="block text-sm font-medium text-[#59C6D4] mb-2">Input Angka Rank</label>
              <input type="number" id="rank" min="1" value={rank} onChange={(e) => setRank(e.target.value)} className="w-full px-4 py-3 bg-black/20 rounded-lg border border-white/10 focus:ring-[#59C6D4] focus:border-[#59C6D4] transition-all" />
            </div>
            <div>
              <label htmlFor="threshold_komisi" className="block text-sm font-medium text-[#59C6D4] mb-2">Threshold Komisi (%)</label>
              <input type="number" id="threshold_komisi" min="0" value={thresholdKomisi} onChange={(e) => setThresholdKomisi(e.target.value)} className="w-full px-4 py-3 bg-black/20 rounded-lg border border-white/10 focus:ring-[#59C6D4] focus:border-[#59C6D4] transition-all" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#59C6D4] mb-2">Upload File CSV</label>
            <div className="flex items-center justify-center w-full h-40 border-2 border-white/20 border-dashed rounded-lg cursor-pointer bg-black/20 hover:bg-black/30">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full text-center">
                    <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleFileChange} />
                    {files.length === 0 ? <p className="text-sm text-white/50 px-2"><span className="font-semibold">Klik untuk upload</span> atau seret file</p> : <p className="font-semibold text-green-400">{files.length} file dipilih</p>}
                </label>
            </div>
          </div>
        </div>
        {error && <div className="mt-6 p-4 bg-red-500/20 text-red-300 rounded-lg">{error}</div>}
        {successMessage && <div className="mt-6 p-4 bg-green-500/20 text-green-300 rounded-lg">{successMessage}</div>}
        <div className="mt-8 text-right">
          <button onClick={handleProsesClick} disabled={isLoading} className="py-3 px-8 bg-[#59C6D4] hover:bg-[#77F7F0] text-[#0D194B] font-bold rounded-lg transition-all disabled:opacity-50">
            {isLoading ? 'Memproses...' : 'PROSES'}
          </button>
        </div>
      </div>
      {/* Card untuk Hasil Filter */}
      <div className="w-full p-8 bg-[#19386D]/20 rounded-2xl backdrop-blur-xl border border-[#59C6D4]/20">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#77F7F0]">2. Hasil Filter</h2>
            {filteredLinks && filteredLinks.length > 0 && <button onClick={handleResetClick} className="text-sm font-medium text-red-400 hover:text-red-300">RESET SEMUA LINK</button>}
        </div>
        {filteredLinks && filteredLinks.length > 0 ? (
          <HasilFilterTable links={filteredLinks} copyButtons={copyButtons} />
        ) : (
          <div className="text-center py-16 text-white/60"><p>Hasil filter akan ditampilkan di sini.</p></div>
        )}
      </div>
    </div>
  );
}
export default RisetPage;
