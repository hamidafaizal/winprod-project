import { createContext, useState, useContext } from 'react';
import { getDistribusiStatus } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [emberCapacity, setEmberCapacityState] = useState(null);
  const [emberStatus, setEmberStatus] = useState({ capacity: 0, current_count: 0, links: [] });
  const [thresholdKomisi, setThresholdKomisi] = useState(10);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);

  const setEmberCapacity = (value) => {
    setEmberCapacityState(value);
  };

  const fetchEmberStatus = async () => {
    try {
      const response = await getDistribusiStatus();
      setEmberStatus(response.data);
    } catch (error) { console.error("Gagal mengambil status ember:", error); }
  };
  
  const resetCycle = () => {
    setFilteredLinks([]);
    setAnalysisResults([]);
    fetchEmberStatus();
  };

  const value = {
    emberCapacity, setEmberCapacity,
    emberStatus, fetchEmberStatus,
    thresholdKomisi, setThresholdKomisi,
    filteredLinks, setFilteredLinks,
    analysisResults, setAnalysisResults,
    resetCycle,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() { return useContext(AppContext); }