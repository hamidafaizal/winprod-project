// src/pages/KomregPage.jsx
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { analyzeImages, approveAndSend, getFilteredLinks } from '../services/api';

function KomregPage() {
  const { 
    filteredLinks, setFilteredLinks, 
    analysisResults, setAnalysisResults, 
  } = useAppContext();
  
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshFilteredLinks = async () => {
    try {
      const response = await getFilteredLinks();
      setFilteredLinks(response.data);
    } catch (err) {
      console.error("Gagal refresh data link:", err);
    }
  };

  const handleImageChange = (event) => {
    setIsLoading(false);
    setError(null);
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setImages(prevImages => [...prevImages, ...newFiles]);
    }
  };

  const handleAnalisaClick = async () => {
    if (images.length === 0) {
      setError('Mohon pilih gambar.');
      return;
    }
    setError(null);
    setIsLoading(true);
    
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images[]', image);
    });

    try {
      const response = await analyzeImages(formData);
      setAnalysisResults(prev => [...prev, ...response.data]);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Gagal menganalisa.';
      setError(errorMessage);
    } finally {
      // Perbaikan uploader macet: pastikan state dibersihkan di sini
      setIsLoading(false);
      setImages([]); 
    }
  };
  
  const handleResetClick = () => {
    setAnalysisResults([]);
    setError(null);
  };

  const handleApproveClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        commissions: analysisResults,
      };
      const response = await approveAndSend(payload);
      alert(response.data.message);
      
      setAnalysisResults([]);
      await refreshFilteredLinks(); 

    } catch (err) {
        setError(err.response?.data?.message || 'Gagal melakukan proses approve.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalLinksInCycle = filteredLinks.length;
  const linksMenunggu = filteredLinks.filter(link => link.status === 'Menunggu Analisa');
  const linksSelesai = totalLinksInCycle - linksMenunggu.length;
  const overallProgressPercentage = totalLinksInCycle > 0 ? (linksSelesai / totalLinksInCycle) * 100 : 0;
  
  if (linksMenunggu.length === 0 && filteredLinks.length > 0) {
    return (
      <div className="w-full p-8 bg-[#19386D]/20 rounded-2xl backdrop-blur-xl border border-[#59C6D4]/20 text-center text-green-400">
        <p className="font-bold">Semua link telah selesai diproses.</p>
        <p className="text-sm">Anda bisa memulai siklus baru dari halaman "Upload File Riset".</p>
      </div>
    );
  }

  if (filteredLinks.length === 0) {
    return (
      <div className="w-full p-8 bg-[#19386D]/20 rounded-2xl backdrop-blur-xl border border-[#59C6D4]/20 text-center">
        <p className="text-white/60">Tidak ada siklus riset yang aktif.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="p-4 bg-[#19386D]/20 rounded-xl border border-[#59C6D4]/20">
        <div className="flex justify-between items-center mb-1">
          <span className="text-base font-medium text-[#77F7F0]">Progress Keseluruhan</span>
          <span className="text-sm font-medium text-[#77F7F0]">{linksSelesai} / {totalLinksInCycle} Selesai</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-[#59C6D4] to-[#77F7F0] h-2.5 rounded-full transition-all duration-500" style={{ width: `${overallProgressPercentage}%` }}></div>
        </div>
        {analysisResults.length > 0 && (
          <div className="text-xs text-amber-400 mt-2 text-right">
            Ada {analysisResults.length} hasil analisa baru siap untuk di "APPROVE & KIRIM".
          </div>
        )}
      </div>

      <div className="w-full p-8 bg-[#19386D]/20 rounded-2xl backdrop-blur-xl border border-[#59C6D4]/20">
        <h2 className="text-2xl font-bold text-[#77F7F0] mb-6">1. Upload Gambar Produk</h2>
          <>
            <div className="flex items-center justify-center w-full h-40 border-2 border-white/20 border-dashed rounded-lg cursor-pointer bg-black/20 hover:bg-black/30">
                <label htmlFor="image-dropzone" className="flex flex-col items-center justify-center w-full h-full text-center">
                    <input id="image-dropzone" type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                    {images.length === 0 ? <p className="text-sm text-white/50 px-2"><span className="font-semibold">Klik untuk upload</span> atau seret gambar</p> : <p className="font-semibold text-green-400">{images.length} gambar dipilih</p>}
                </label>
            </div>
            <div className="mt-8 text-right">
              <button onClick={handleAnalisaClick} disabled={isLoading || images.length === 0} className="py-3 px-8 bg-[#59C6D4] hover:bg-[#77F7F0] text-[#0D194B] font-bold rounded-lg transition-all disabled:opacity-50">
                {isLoading ? 'Menganalisa...' : 'ANALISA'}
              </button>
            </div>
          </>
        {error && <div className="mt-4 p-3 bg-red-500/20 text-red-300 rounded-md break-words">{error}</div>}
      </div>
      
      <div className="w-full p-8 bg-[#19386D]/20 rounded-2xl backdrop-blur-xl border border-[#59C6D4]/20">
        <h2 className="text-2xl font-bold text-[#77F7F0] mb-6">2. Hasil Analisa Komisi</h2>
        {analysisResults.length > 0 ? (
          <div className="max-h-96 overflow-y-auto rounded-lg border border-white/10">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#59C6D4] uppercase bg-black/20 sticky top-0 backdrop-blur-sm">
                <tr>
                    <th className="px-6 py-3">No</th>
                    <th className="px-6 py-3">Komisi Hasil AI</th>
                </tr>
              </thead>
              <tbody>
                {analysisResults.map((commission, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{commission}%</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-white/60"><p>Hasil analisa akan ditampilkan di sini.</p></div>
        )}
        {analysisResults.length > 0 && (
          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={handleResetClick} disabled={isLoading} className="text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-50">RESET</button>
            <button onClick={handleApproveClick} disabled={isLoading} className="py-2 px-6 bg-green-500 hover:bg-green-400 text-white font-bold rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait">
              {isLoading ? "Menyimpan..." : "APPROVE & KIRIM"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default KomregPage;