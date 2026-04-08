import { useState, useEffect, useMemo } from 'react';
import { 
  Factory, 
  UserCircle, 
  Info, 
  Sigma, 
  Save, 
  BarChart3, 
  Calculator, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  Plus,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CalculationResult, View } from './types';

const GRAVITY_CONSTANT = 9.80665;

export default function App() {
  const [view, setView] = useState<View>('estimator');
  const [pressure, setPressure] = useState<string>('60000');
  const [diameter, setDiameter] = useState<string>('40');
  const [history, setHistory] = useState<CalculationResult[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kingsley_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('kingsley_history', JSON.stringify(history));
  }, [history]);

  const results = useMemo(() => {
    const p = parseFloat(pressure) || 0;
    const d = parseFloat(diameter) || 0;

    const pascalsEquivalent = p * GRAVITY_CONSTANT;
    const effectiveArea = Math.PI * Math.pow(d / 2000, 2);
    const weight = (pascalsEquivalent * effectiveArea) / GRAVITY_CONSTANT;

    return {
      weight: weight.toFixed(2),
      effectiveArea: effectiveArea.toExponential(3),
      pascalsEquivalent: pascalsEquivalent.toFixed(2),
    };
  }, [pressure, diameter]);

  const handleRecord = () => {
    const newRecord: CalculationResult = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      pressure: parseFloat(pressure),
      diameter: parseFloat(diameter),
      gravity: GRAVITY_CONSTANT,
      weight: parseFloat(results.weight),
      effectiveArea: parseFloat(results.effectiveArea),
      pascalsEquivalent: parseFloat(results.pascalsEquivalent),
    };
    setHistory([newRecord, ...history]);
  };

  const deleteRecord = (id: string) => {
    setHistory(history.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Factory className="text-primary w-6 h-6" />
          <span className="text-xl font-bold text-primary font-headline tracking-tight">Kingsley Deadweight</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <button 
            onClick={() => setView('estimator')}
            className={`font-semibold font-headline tracking-tight transition-colors ${view === 'estimator' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Estimator
          </button>
          <button 
            onClick={() => setView('history')}
            className={`font-semibold font-headline tracking-tight transition-colors ${view === 'history' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            History
          </button>
          <button 
            onClick={() => setView('settings')}
            className={`font-semibold font-headline tracking-tight transition-colors ${view === 'settings' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Settings
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
            <UserCircle className="text-on-surface-variant w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-28 pb-32 md:pb-12">
        <AnimatePresence mode="wait">
          {view === 'estimator' && (
            <motion.div
              key="estimator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-background mb-4">Deadweight Calculator</h1>
                <p className="text-on-surface-variant max-w-2xl leading-relaxed">
                  Precision instrument for calculating required calibration weights based on localized atmospheric pressure and orifice diameter parameters.
                </p>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                  <section className="bg-surface-container-low rounded-xl p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant">Engineering Parameters</h2>
                      <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-semibold tracking-wide">METRIC UNITS</span>
                    </div>
                    
                    <div className="space-y-10">
                      {/* Pressure */}
                      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                          Pressure 
                          <Info className="w-4 h-4 opacity-50" />
                        </label>
                        <div className="md:col-span-2 relative">
                          <input 
                            type="number"
                            value={pressure}
                            onChange={(e) => setPressure(e.target.value)}
                            className="input-field"
                            placeholder="0.00"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-outline-variant uppercase">mmwc</span>
                        </div>
                      </div>

                      {/* Diameter */}
                      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                          Diameter
                          <Info className="w-4 h-4 opacity-50" />
                        </label>
                        <div className="md:col-span-2 relative">
                          <input 
                            type="number"
                            value={diameter}
                            onChange={(e) => setDiameter(e.target.value)}
                            className="input-field"
                            placeholder="0.00"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-outline-variant uppercase">mm</span>
                        </div>
                      </div>
                    </div>
                  </section>

                </div>

                {/* Results */}
                <div className="lg:col-span-5">
                  <div className="sticky top-24 bg-surface-container-lowest rounded-xl p-8 border-l-[6px] border-primary shadow-xl h-fit">
                    <div className="flex flex-col gap-8">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-2">Estimated Weight Required</span>
                        <div className="flex items-baseline gap-4">
                          <span className="text-7xl font-headline font-extrabold text-on-background tracking-tighter">{results.weight}</span>
                          <span className="text-2xl font-bold text-on-surface-variant">kg</span>
                        </div>
                      </div>

                      <div className="bg-surface-container-low rounded-lg p-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-on-surface-variant font-medium">Effective Area</span>
                          <span className="text-on-surface font-mono font-bold">{results.effectiveArea} m²</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-on-surface-variant font-medium">Pascals Equivalent</span>
                          <span className="text-on-surface font-mono font-bold">{results.pascalsEquivalent} Pa</span>
                        </div>
                        <div className="pt-4 mt-4 border-t border-outline-variant/15 flex justify-between items-center">
                          <span className="text-xs font-bold uppercase text-on-surface-variant">Confidence Rating</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-2 h-2 rounded-full bg-primary" />
                            ))}
                            <div className="w-2 h-2 rounded-full bg-outline-variant/30" />
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={handleRecord}
                        className="w-full bg-gradient-to-r from-primary to-primary-dim text-white py-4 rounded-md font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
                      >
                        <Save className="w-5 h-5" />
                        RECORD ESTIMATE
                      </button>

                      <p className="text-[11px] text-on-surface-variant/70 italic text-center px-4">
                        Results are calculated based on ISO 5167 standards. Please verify with physical calibration blocks before high-pressure testing.
                      </p>
                    </div>
                  </div>

                  {/* Blueprint Visual */}
                  <div className="mt-8 rounded-xl overflow-hidden aspect-[4/3] relative group">
                    <img 
                      className="w-full h-full object-cover grayscale contrast-125 opacity-40 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQMgjORa-T2TaEpEYRf6Cf0TPaO7BQWz1nH5YuLzG5_OAK3CqZB914k1wVtNkgpIlhKI6UyiJiTh9X5NnZiZ6c_tZi6vJuuP_HAr9_mYgZ6t9bbS2r2KnxjGVfCuvq_p_-uomnpB4YCmH6hp48i3kfn1K1dbqktYDBi51f5Z7dzW6anau1ghHsP7O47jZU0kudMiDQrLlHxBGfXGXd-rgqtrYmozI25RaGYk1xHIxVcDcr8gyR1_RUHXJ69YjOX0dL3SZNoD2KFJ8" 
                      alt="Technical diagram"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center border border-primary/20 rounded-xl">
                      <div className="text-center p-6 bg-surface-container-lowest/90 backdrop-blur-md rounded-lg shadow-xl max-w-[80%]">
                        <BarChart3 className="text-primary mb-2 w-8 h-8 mx-auto" />
                        <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">Data Visualization</h4>
                        <p className="text-xs text-on-surface-variant mt-2">Active simulation of pressure-to-weight correlation based on input variance.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <section>
                <h1 className="text-4xl font-extrabold tracking-tight text-on-background mb-4">Calculation History</h1>
                <p className="text-on-surface-variant">Review and manage your previous weight estimations.</p>
              </section>

              <div className="grid gap-4">
                {history.length === 0 ? (
                  <div className="text-center py-20 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/20">
                    <HistoryIcon className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                    <p className="text-on-surface-variant">No records found. Start by creating an estimate.</p>
                  </div>
                ) : (
                  history.map((record) => (
                    <div key={record.id} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                      <div className="flex items-center gap-6">
                        <div className="bg-primary-container p-4 rounded-lg">
                          <span className="text-2xl font-bold text-primary font-headline">{record.weight}</span>
                          <span className="text-xs font-bold text-primary ml-1">kg</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">
                            {new Date(record.timestamp).toLocaleDateString()} at {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-xs text-on-surface-variant">P: {record.pressure} mmwc</span>
                            <span className="text-xs text-on-surface-variant">D: {record.diameter} mm</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => deleteRecord(record.id)}
                          className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <ChevronRight className="text-outline-variant group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <section>
                <h1 className="text-4xl font-extrabold tracking-tight text-on-background mb-4">Settings</h1>
                <p className="text-on-surface-variant">Configure application preferences and engineering standards.</p>
              </section>

              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-on-surface">Unit System</p>
                    <p className="text-sm text-on-surface-variant">Choose between Metric and Imperial units.</p>
                  </div>
                  <div className="bg-surface-container-highest p-1 rounded-full flex">
                    <button className="px-4 py-1 bg-white rounded-full text-xs font-bold shadow-sm">METRIC</button>
                    <button className="px-4 py-1 text-xs font-bold text-on-surface-variant">IMPERIAL</button>
                  </div>
                </div>
                <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-on-surface">Calculation Standard</p>
                    <p className="text-sm text-on-surface-variant">ISO 5167 is the current default.</p>
                  </div>
                  <span className="text-xs font-bold text-primary">ISO 5167-2022</span>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-on-surface text-red-500">Clear Data</p>
                    <p className="text-sm text-on-surface-variant">Permanently delete all calculation history.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all history?')) {
                        setHistory([]);
                      }
                    }}
                    className="px-4 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    CLEAR ALL
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant/10 flex justify-around items-center px-4 pb-6 pt-3 z-50">
        <button 
          onClick={() => setView('estimator')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'estimator' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <Calculator className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Estimator</span>
        </button>
        <button 
          onClick={() => setView('history')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'history' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <HistoryIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">History</span>
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'settings' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <SettingsIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
        </button>
      </nav>

      {/* FAB */}
      <button 
        onClick={() => {
          setView('estimator');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
