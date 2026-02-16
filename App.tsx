
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, 
  Truck, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  MapPin,
  X,
  Map as MapIcon,
  Calendar,
  DollarSign,
  Camera,
  Save,
  ChevronRight,
  ArrowLeft,
  Info,
  Package,
  Scale,
  Home,
  BrainCircuit
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Trip, DashboardStats } from './types';
import { analyzeFreight } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trips'>('dashboard');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [selectedTripForDetails, setSelectedTripForDetails] = useState<Trip | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const [formData, setFormData] = useState({
    origin: '', destination: '', cargo: '', weight: '', plate: '', 
    startDate: new Date().toISOString().split('T')[0],
    distance: 450, freightValue: '', commission: '', fuel: '', tolls: '', expenses: '', advance: ''
  });

  useEffect(() => {
    const savedTrips = localStorage.getItem('fretesmart_trips');
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    } else {
      const initialTrips: Trip[] = [
        {
          id: '1', origin: 'Curitiba, PR', destination: 'Florianópolis, SC', distance: 300,
          freightValue: 2800, driverCommission: 300, fuelCost: 400, tollCost: 160,
          otherExpenses: 100, advanceAmount: 1000, status: 'Em andamento',
          startDate: '11/02/2026', plate: 'XYZ-9876', cargo: 'Eletrônicos', weight: 12000, expenses: []
        },
        {
          id: '2', origin: 'São Paulo, SP', destination: 'Curitiba, PR', distance: 408,
          freightValue: 4500, driverCommission: 450, fuelCost: 900, tollCost: 400,
          otherExpenses: 100, advanceAmount: 1500, status: 'Concluído',
          startDate: '08/02/2026', plate: 'ABC-1234', cargo: 'Grãos', weight: 25000, expenses: []
        }
      ];
      setTrips(initialTrips);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fretesmart_trips', JSON.stringify(trips));
  }, [trips]);

  const stats = useMemo<DashboardStats>(() => {
    const totalRevenue = trips.reduce((sum, trip) => sum + trip.freightValue, 0);
    const totalExpenses = trips.reduce((sum, trip) => 
      sum + trip.fuelCost + trip.tollCost + trip.driverCommission + trip.otherExpenses, 0);
    return { totalRevenue, totalExpenses, netProfit: totalRevenue - totalExpenses, tripCount: trips.length };
  }, [trips]);

  const pieData = useMemo(() => [
    { name: 'Lucro', value: stats.netProfit, color: '#22c55e' },
    { name: 'Despesas', value: stats.totalExpenses, color: '#ef4444' }
  ], [stats]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeFreight({
      origin: formData.origin,
      destination: formData.destination,
      distance: formData.distance,
      freightValue: Number(formData.freightValue),
      driverCommission: Number(formData.commission),
      fuelCost: Number(formData.fuel),
      tollCost: Number(formData.tolls),
      otherExpenses: Number(formData.expenses),
      advanceAmount: Number(formData.advance)
    });
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = () => {
    const dateObj = new Date(formData.startDate);
    const formattedDate = dateObj.toLocaleDateString('pt-BR');
    const newTrip: Trip = {
      id: Date.now().toString(), origin: formData.origin, destination: formData.destination,
      cargo: formData.cargo, weight: Number(formData.weight), plate: formData.plate,
      startDate: formattedDate, distance: formData.distance, freightValue: Number(formData.freightValue),
      driverCommission: Number(formData.commission), fuelCost: Number(formData.fuel),
      tollCost: Number(formData.tolls), otherExpenses: Number(formData.expenses),
      advanceAmount: Number(formData.advance), status: 'Em andamento', expenses: []
    };
    setTrips([newTrip, ...trips]);
    resetModal();
  };

  const resetModal = () => {
    setIsAddingTrip(false);
    setModalStep(1);
    setAiAnalysis(null);
    setFormData({
      origin: '', destination: '', cargo: '', weight: '', plate: '', startDate: new Date().toISOString().split('T')[0],
      distance: 450, freightValue: '', commission: '', fuel: '', tolls: '', expenses: '', advance: ''
    });
  };

  return (
    <div className="h-screen-dvh bg-[#f9fafb] flex flex-col relative overflow-hidden font-sans w-full">
      <main className="flex-1 w-full px-4 sm:px-8 py-4 pb-28 overflow-y-auto no-scrollbar scroll-smooth">
        {activeTab === 'dashboard' && (
          <div className="space-y-3 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-extrabold text-[#111827]">Olá, Trans Martins! 👋</h1>
                <p className="text-[#9ca3af] text-[10px]">Resumo financeiro mensal.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                <div className="p-1.5 bg-[#dcfce7] w-fit rounded-full text-[#22c55e] mb-1">
                  <TrendingUp size={16} />
                </div>
                <span className="text-[9px] font-bold uppercase text-[#9ca3af]">Receita</span>
                <div className="text-base font-extrabold text-[#111827]">R$ {stats.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                <div className="p-1.5 bg-[#fee2e2] w-fit rounded-full text-[#ef4444] mb-1">
                  <TrendingDown size={16} />
                </div>
                <span className="text-[9px] font-bold uppercase text-[#9ca3af]">Despesas</span>
                <div className="text-base font-extrabold text-[#111827]">R$ {stats.totalExpenses.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-brand-600 p-4 rounded-2xl shadow-lg text-white flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-bold opacity-80 uppercase">Lucro Líquido</p>
                <h2 className="text-2xl font-black">R$ {stats.netProfit.toLocaleString()}</h2>
              </div>
              <Wallet size={24} className="opacity-20 relative z-10" />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center">
               <div className="h-32 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-black text-[#111827]">{stats.totalRevenue > 0 ? Math.round((stats.netProfit/stats.totalRevenue)*100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trips' && !selectedTripForDetails && (
           <div className="space-y-3 animate-in slide-in-from-bottom-10 max-w-4xl mx-auto">
              <h2 className="text-lg font-black text-[#111827]">Meus Fretes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trips.map(trip => {
                  const profit = trip.freightValue - trip.fuelCost - trip.tollCost - trip.driverCommission - trip.otherExpenses;
                  return (
                    <div key={trip.id} onClick={() => setSelectedTripForDetails(trip)} className="bg-white rounded-xl p-3 shadow-sm border border-gray-50 active:scale-[0.98] transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400">{trip.startDate}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${trip.status === 'Em andamento' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                          {trip.status}
                        </span>
                      </div>
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div><span className="text-xs font-bold text-gray-800 line-clamp-1">{trip.origin}</span></div>
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><span className="text-xs font-bold text-gray-800 line-clamp-1">{trip.destination}</span></div>
                      </div>
                      <div className="flex justify-between items-end pt-2 border-t border-gray-50">
                        <span className="text-sm font-black text-gray-900">R$ {trip.freightValue.toLocaleString()}</span>
                        <span className="text-sm font-black text-green-600">L: R$ {profit.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>
        )}

        {activeTab === 'trips' && selectedTripForDetails && (
          <div className="space-y-3 animate-in slide-in-from-right-10 max-w-3xl mx-auto">
            <button onClick={() => setSelectedTripForDetails(null)} className="flex items-center gap-2 text-xs font-bold text-gray-400"><ArrowLeft size={14} /> Voltar</button>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
               <p className="text-[10px] font-bold text-gray-400 uppercase">Rota</p>
               <h3 className="text-sm font-black text-gray-900 mb-3">{selectedTripForDetails.origin} ➔ {selectedTripForDetails.destination}</h3>
               <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-gray-50 rounded-lg"><p className="text-[8px] font-bold text-gray-400 uppercase">Diesel</p><p className="text-xs font-black">R$ {selectedTripForDetails.fuelCost}</p></div>
                  <div className="p-2 bg-gray-50 rounded-lg"><p className="text-[8px] font-bold text-gray-400 uppercase">Pedágio</p><p className="text-xs font-black">R$ {selectedTripForDetails.tollCost}</p></div>
               </div>
               <div className="mt-4 bg-brand-600 p-3 rounded-xl text-white flex justify-between items-center">
                 <div><p className="text-[8px] font-bold uppercase opacity-80">Lucro Estimado</p><p className="text-lg font-black">R$ {(selectedTripForDetails.freightValue - selectedTripForDetails.fuelCost - selectedTripForDetails.tollCost - selectedTripForDetails.driverCommission - selectedTripForDetails.otherExpenses).toLocaleString()}</p></div>
                 <Wallet size={20} className="opacity-40" />
               </div>
            </div>
          </div>
        )}
      </main>

      {isAddingTrip && (
        <div className="fixed inset-0 z-[100] bg-[#f9fafb] animate-in fade-in duration-300 w-full overflow-hidden">
           <div className="w-full h-full flex flex-col max-w-lg mx-auto bg-white sm:shadow-2xl">
              <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-lg font-black text-[#111827]">Novo Lançamento</h2>
                <button onClick={resetModal} className="p-1.5 bg-gray-100 rounded-full"><X size={18} /></button>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
                {modalStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Origem</label><input name="origin" value={formData.origin} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-lg p-2.5 text-sm" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Destino</label><input name="destination" value={formData.destination} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-lg p-2.5 text-sm" /></div>
                    </div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Data</label><input name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-lg p-2.5 text-sm" /></div>
                    <button onClick={() => setModalStep(2)} className="w-full bg-brand-600 text-white font-black py-3 rounded-xl shadow-md">Próximo</button>
                  </div>
                )}
                
                {modalStep === 2 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><label className="text-[9px] font-bold text-green-700 uppercase">Valor Frete</label><input name="freightValue" type="number" value={formData.freightValue} onChange={handleInputChange} className="w-full border-none rounded-lg p-2.5 text-sm font-bold" /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-green-700 uppercase">Adiantamento</label><input name="advance" type="number" value={formData.advance} onChange={handleInputChange} className="w-full border-none rounded-lg p-2.5 text-sm font-bold" /></div>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><label className="text-[9px] font-bold text-red-700 uppercase">Diesel</label><input name="fuel" type="number" value={formData.fuel} onChange={handleInputChange} className="w-full border-none rounded-lg p-2.5 text-sm font-bold" /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-red-700 uppercase">Pedágio</label><input name="tolls" type="number" value={formData.tolls} onChange={handleInputChange} className="w-full border-none rounded-lg p-2.5 text-sm font-bold" /></div>
                      </div>
                    </div>
                    
                    {aiAnalysis && (
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in zoom-in-95">
                        <div className="flex items-center gap-2 text-blue-700 font-black text-[10px] uppercase mb-2"><BrainCircuit size={14} /> Análise da IA</div>
                        <p className="text-xs font-bold text-blue-900 mb-1">Veredito: {aiAnalysis.verdict} (Nota: {aiAnalysis.score})</p>
                        <ul className="text-[10px] text-blue-700 space-y-0.5">
                          {aiAnalysis.tips.map((tip: string, i: number) => <li key={i}>• {tip}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 mt-4">
                      <button 
                        onClick={handleAiAnalysis} 
                        disabled={isAnalyzing}
                        className="w-full bg-white border border-brand-200 text-brand-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        {isAnalyzing ? "Analisando..." : <><BrainCircuit size={18} /> Análise Inteligente</>}
                      </button>
                      <button onClick={() => setModalStep(3)} className="w-full bg-brand-600 text-white font-black py-3 rounded-xl shadow-md">Finalizar</button>
                    </div>
                  </div>
                )}

                {modalStep === 3 && (
                  <div className="space-y-6">
                    <div className="p-8 border-2 border-dashed border-gray-100 rounded-2xl text-center"><p className="text-gray-400 text-xs font-bold">Confirme para salvar no histórico.</p></div>
                    <button onClick={handleSubmit} className="w-full bg-brand-600 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"><Save size={18} /> Salvar Frete</button>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/95 backdrop-blur-xl border border-gray-100 px-8 py-3 rounded-[2rem] shadow-lg z-50 flex justify-around items-center">
        <NavButton active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setSelectedTripForDetails(null); }} icon={<LayoutGrid size={22} />} label="Início" />
        <div className="relative -top-6">
          <button onClick={() => { setModalStep(1); setIsAddingTrip(true); }} className="w-14 h-14 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white active:scale-90 transition-all"><Plus size={28} /></button>
        </div>
        <NavButton active={activeTab === 'trips'} onClick={() => { setActiveTab('trips'); setSelectedTripForDetails(null); }} icon={<Truck size={22} />} label="Fretes" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-0.5 transition-all ${active ? 'text-brand-600' : 'text-gray-300'}`}>
    {icon}
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
