// src/components/PieChart.jsx

// Komponen ini menerima persentase (0-100) dan ukuran chart
function PieChart({ percentage, size = 120 }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Lingkaran background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFFFFF1A" // Warna abu-abu transparan
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Lingkaran progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#77F7F0" // Warna winprod-light-cyan
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      {/* Teks persentase di tengah */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{`${percentage}%`}</span>
      </div>
    </div>
  );
}

export default PieChart;