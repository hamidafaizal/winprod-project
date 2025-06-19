// BUAT FILE BARU DI: src/components/HasilFilterTable.jsx

// Komponen ini akan menerima 'links' dan 'copyButtons' dari RisetPage.jsx
function HasilFilterTable({ links, copyButtons }) {
  return (
    <div className="space-y-4">
      {/* Container tabel agar bisa di-scroll */}
      <div className="max-h-96 overflow-y-auto rounded-lg border border-white/10">
        <table className="w-full text-sm text-left">
          {/* Header Tabel */}
          <thead className="text-xs text-[#59C6D4] uppercase bg-black/20 sticky top-0 backdrop-blur-sm">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Link Produk</th>
              <th scope="col" className="px-6 py-3">Komisi</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          {/* Isi Tabel */}
          <tbody>
            {links.map((link, index) => (
              <tr key={link.id} className="border-b border-white/10 hover:bg-white/5">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{index + 1}</th>
                <td className="px-6 py-4 truncate max-w-xs" title={link.link}>{link.link}</td>
                <td className="px-6 py-4 text-white/70">{link.commission ? `${link.commission}%` : '-'}</td>
                <td className="px-6 py-4 text-white/70">{link.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bagian bawah tabel */}
      <div className="flex justify-between items-center pt-2">
        <p className="text-sm text-white/60">{links.length} link ditemukan.</p>
        {/* Tempat untuk tombol-tombol copy dinamis */}
        <div className="space-x-4">
            {copyButtons}
        </div>
      </div>
    </div>
  );
}

export default HasilFilterTable;
