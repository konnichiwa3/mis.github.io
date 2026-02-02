import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Map, List, Settings, Search, Menu, Bot, Navigation, Utensils,
  Calendar, Users, BarChart3, PieChart
} from 'lucide-react';
import { Place, ViewState, ThaiDessert } from './types';
import { MOCK_PLACES, MOCK_USER_LOCATION, MOCK_DESSERTS } from './constants';
import Dashboard from './components/Dashboard';
import MapComponent from './components/MapComponent';
import PlaceDetail from './components/PlaceDetail';
import AdminPanel from './components/AdminPanel';
import DessertLibrary from './components/DessertLibrary';
import DessertDetail from './components/DessertDetail';
import { getGeminiRecommendation } from './services/geminiService';

// Navbar Component - Formal Theme
const Navbar: React.FC<{ 
    toggleSidebar: () => void; 
    setSearchQuery: (q: string) => void; 
    onAiSearch: () => void;
    isLoadingAi: boolean;
}> = ({ toggleSidebar, setSearchQuery, onAiSearch, isLoadingAi }) => (
  <header className="bg-gradient-to-r from-blue-900 to-blue-800 h-16 border-b border-blue-900 fixed w-full top-0 z-30 flex items-center px-4 justify-between shadow-md text-white">
    <div className="flex items-center gap-3">
      <button onClick={toggleSidebar} className="p-2 hover:bg-blue-700 rounded-lg lg:hidden text-white">
        <Menu size={24} />
      </button>
      <div className="flex items-center gap-3">
        <div className="bg-white text-blue-900 p-1.5 rounded-full border-2 border-amber-400">
            <Map size={20} />
        </div>
        <div>
            <h1 className="text-lg font-bold tracking-wide leading-tight hidden md:block">
                ระบบสารสนเทศภูมิปัญญาท้องถิ่น
            </h1>
            <p className="text-[10px] text-blue-200 hidden md:block">Local Wisdom & Tourism Information System</p>
        </div>
      </div>
    </div>

    <div className="flex-1 max-w-xl mx-4 relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="ค้นหาสถานที่, ปราชญ์ชาวบ้าน..." 
          className="w-full pl-10 pr-12 py-2 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-amber-400 rounded text-slate-800 text-sm transition-all outline-none shadow-inner"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
            onClick={onAiSearch}
            disabled={isLoadingAi}
            className={`absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${isLoadingAi ? 'bg-slate-300' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-md'} text-white transition-all`}
            title="ให้ AI แนะนำ"
        >
           {isLoadingAi ? <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div> : <Bot size={16} />}
        </button>
      </div>
    </div>

    <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">เจ้าหน้าที่ สกร.</p>
            <p className="text-[10px] text-amber-300">Admin Level</p>
        </div>
        <div className="w-10 h-10 bg-blue-700 rounded-full overflow-hidden border-2 border-amber-400 p-0.5">
             <img src="https://picsum.photos/100/100?random=user" alt="User" className="rounded-full w-full h-full object-cover" />
        </div>
    </div>
  </header>
);

// Sidebar Component - Formal Theme
const Sidebar: React.FC<{ 
    currentView: ViewState; 
    setView: (v: ViewState) => void; 
    isOpen: boolean;
}> = ({ currentView, setView, isOpen }) => {
    const menuItems = [
        { id: 'DASHBOARD', label: 'ภาพรวม (Dashboard)', icon: <LayoutDashboard size={20} /> },
        { id: 'MAP', label: 'แผนที่ภูมิสารสนเทศ', icon: <Map size={20} /> },
        { id: 'LIST', label: 'ทะเบียนสถานที่', icon: <List size={20} /> },
        { id: 'DESSERTS', label: 'ขนมไทยโบราณ', icon: <Utensils size={20} /> },
        { id: 'ADMIN', label: 'จัดการฐานข้อมูล', icon: <Settings size={20} /> },
    ];

    return (
        <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-slate-200 w-64 transition-transform z-20 shadow-lg ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-4 bg-slate-50 border-b border-slate-200 mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">เมนูหลัก</p>
            </div>
            <nav className="p-2 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id as ViewState)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                            currentView === item.id 
                            ? 'bg-blue-900 text-white shadow-md' 
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="absolute bottom-0 w-full p-4 bg-slate-50 border-t border-slate-200">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 text-white relative overflow-hidden shadow-inner">
                    <div className="relative z-10">
                        <h4 className="font-bold mb-1 text-amber-400">ศูนย์ช่วยเหลือ</h4>
                        <p className="text-[10px] text-blue-100 mb-2">ติดต่อฝ่ายเทคนิคหรือแจ้งปัญหาการใช้งาน</p>
                        <button className="text-[10px] bg-white text-blue-900 px-3 py-1 rounded font-bold shadow hover:bg-slate-100 w-full">โทร 053-772693</button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 bg-white/10 w-24 h-24 rounded-full"></div>
                </div>
            </div>
        </aside>
    );
};

// Places Grid Component
const PlaceGrid: React.FC<{ places: Place[], onSelect: (p: Place) => void }> = ({ places, onSelect }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map(place => (
            <div key={place.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-slate-200 overflow-hidden group">
                <div className="h-48 overflow-hidden relative border-b border-slate-100">
                    <img src={place.coverImage} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-blue-900/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-blue-700">
                        {place.category}
                    </span>
                </div>
                <div className="p-5">
                    <h3 className="font-bold text-blue-900 text-lg mb-2">{place.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{place.description}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <div className="flex items-center text-amber-500 text-sm font-bold">
                            <span className="mr-1">★</span> {place.rating}
                        </div>
                        <button 
                            onClick={() => onSelect(place)}
                            className="text-blue-700 text-sm font-bold hover:underline flex items-center"
                        >
                            ดูข้อมูล <Navigation size={14} className="ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  
  // State for Places with LocalStorage Persistence
  const [places, setPlaces] = useState<Place[]>(() => {
    const saved = localStorage.getItem('lwc_places');
    return saved ? JSON.parse(saved) : MOCK_PLACES;
  });

  // State for Desserts with LocalStorage Persistence
  const [desserts, setDesserts] = useState<ThaiDessert[]>(() => {
    const saved = localStorage.getItem('lwc_desserts');
    return saved ? JSON.parse(saved) : MOCK_DESSERTS;
  });

  // Persist places whenever they change
  useEffect(() => {
    localStorage.setItem('lwc_places', JSON.stringify(places));
  }, [places]);

  // Persist desserts whenever they change
  useEffect(() => {
    localStorage.setItem('lwc_desserts', JSON.stringify(desserts));
  }, [desserts]);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedDessert, setSelectedDessert] = useState<ThaiDessert | null>(null);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // --- Real-time Stats State ---
  const [stats, setStats] = useState({
    online: 142,
    today: 3421,
    month: 45020,
    year: 1254892
  });

  const filteredPlaces = places.filter(p => 
    p.name.includes(searchQuery) || p.description.includes(searchQuery) || p.category.includes(searchQuery)
  );

  // --- Statistics Logic (Effect) ---
  useEffect(() => {
    // 1. Initial Load from LocalStorage
    const storedStats = localStorage.getItem('lwc_stats');
    const storedDate = localStorage.getItem('lwc_date');
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const monthStr = dateStr.substring(0, 7); // YYYY-MM
    const yearStr = dateStr.substring(0, 4); // YYYY

    let currentStats = {
        online: Math.floor(Math.random() * (150 - 100 + 1) + 100), // Random start 100-150
        today: 3421,
        month: 45020,
        year: 1254892,
        lastDate: dateStr,
        lastMonth: monthStr,
        lastYear: yearStr
    };

    if (storedStats) {
        const parsed = JSON.parse(storedStats);
        currentStats = { ...currentStats, ...parsed };
        
        // Reset Logic based on date change
        if (parsed.lastDate !== dateStr) {
            currentStats.today = 0; // New day
            currentStats.lastDate = dateStr;
        }
        if (parsed.lastMonth !== monthStr) {
            currentStats.month = 0; // New month
            currentStats.lastMonth = monthStr;
        }
        if (parsed.lastYear !== yearStr) {
            currentStats.year = 0; // New year
            currentStats.lastYear = yearStr;
        }
    }

    setStats(currentStats);

    // 2. Simulation Intervals
    const onlineInterval = setInterval(() => {
        // Fluctuate online users randomly +/- 5
        setStats(prev => {
            const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
            const newOnline = Math.max(50, prev.online + change);
            return { ...prev, online: newOnline };
        });
    }, 3000);

    const visitInterval = setInterval(() => {
        // Simulate new visit every few seconds
        setStats(prev => {
            const newStats = {
                ...prev,
                today: prev.today + 1,
                month: prev.month + 1,
                year: prev.year + 1
            };
            // Save to LS to persist
            localStorage.setItem('lwc_stats', JSON.stringify(newStats));
            return newStats;
        });
    }, 5000); // New visit every 5 seconds

    return () => {
        clearInterval(onlineInterval);
        clearInterval(visitInterval);
    };
  }, []);

  // Place Handlers
  const handleAddPlace = (newPlace: Place) => {
    setPlaces([...places, newPlace]);
  };
  const handleUpdatePlace = (updatedPlace: Place) => {
    setPlaces(places.map(p => p.id === updatedPlace.id ? updatedPlace : p));
  };
  const handleDeletePlace = (id: string) => {
    setPlaces(places.filter(p => p.id !== id));
  };

  // Dessert Handlers
  const handleAddDessert = (newDessert: ThaiDessert) => {
      setDesserts([...desserts, newDessert]);
  };
  const handleUpdateDessert = (updatedDessert: ThaiDessert) => {
      setDesserts(desserts.map(d => d.id === updatedDessert.id ? updatedDessert : d));
  };
  const handleDeleteDessert = (id: string) => {
      setDesserts(desserts.filter(d => d.id !== id));
  };

  const handleAiSearch = async () => {
    if (!searchQuery) return;
    setLoadingAi(true);
    setAiRecommendation('');
    const result = await getGeminiRecommendation(places, searchQuery);
    setAiRecommendation(result);
    setLoadingAi(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <Navbar 
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
        setSearchQuery={setSearchQuery}
        onAiSearch={handleAiSearch}
        isLoadingAi={loadingAi}
      />
      
      <Sidebar 
        currentView={currentView} 
        setView={(v) => { setCurrentView(v); setSidebarOpen(false); }} 
        isOpen={isSidebarOpen}
      />

      <main className="lg:ml-64 pt-20 p-6 flex flex-col min-h-[calc(100vh-80px)]">
        {/* AI Recommendation Box */}
        {aiRecommendation && (
            <div className="mb-6 bg-white border-l-4 border-amber-500 rounded-r-lg p-6 shadow-md animate-fade-in relative">
                <button 
                    onClick={() => setAiRecommendation('')}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                >
                    <Settings size={18} className="rotate-45" />
                </button>
                <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-lg text-white shadow-sm">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1 text-blue-900">ระบบแนะนำอัจฉริยะ (AI Suggestion)</h3>
                        <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">{aiRecommendation}</p>
                    </div>
                </div>
            </div>
        )}

        <div className="max-w-7xl mx-auto w-full flex-grow">
            <div className="mb-6 flex justify-between items-end border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-blue-900">
                        {currentView === 'DASHBOARD' && 'รายงานภาพรวมแหล่งเรียนรู้ และ ขนมไทยโบราณ'}
                        {currentView === 'MAP' && 'แผนที่ข้อมูลชุมชนเพื่อการท่องเที่ยวและเรียนรู้'}
                        {currentView === 'LIST' && 'ทะเบียนข้อมูลสถานที่'}
                        {currentView === 'DESSERTS' && 'สารานุกรมขนมไทยโบราณ'}
                        {currentView === 'ADMIN' && 'ระบบบริหารจัดการข้อมูลส่วนกลาง'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                         {currentView === 'ADMIN' ? 'เข้าถึงเฉพาะเจ้าหน้าที่ผู้ได้รับอนุญาต' : 'ข้อมูลชุมชนเพื่อการท่องเที่ยวและการเรียนรู้'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="text-xs text-slate-500 hidden sm:block bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm self-center">
                        วันที่: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric'})}
                    </div>
                </div>
            </div>

            {currentView === 'DASHBOARD' && (
                <Dashboard 
                    places={places} 
                    desserts={desserts}
                    onSelectPlace={setSelectedPlace} 
                    onSelectDessert={setSelectedDessert}
                />
            )}
            
            {currentView === 'MAP' && (
                <MapComponent 
                    places={filteredPlaces} 
                    center={MOCK_USER_LOCATION} 
                    onSelectPlace={setSelectedPlace}
                />
            )}
            
            {currentView === 'LIST' && (
                <PlaceGrid places={filteredPlaces} onSelect={setSelectedPlace} />
            )}

            {currentView === 'DESSERTS' && (
                <DessertLibrary desserts={desserts} onSelectDessert={setSelectedDessert} />
            )}

            {currentView === 'ADMIN' && (
                <AdminPanel 
                    places={places} 
                    onAddPlace={handleAddPlace}
                    onUpdatePlace={handleUpdatePlace}
                    onDeletePlace={handleDeletePlace}
                    desserts={desserts}
                    onAddDessert={handleAddDessert}
                    onUpdateDessert={handleUpdateDessert}
                    onDeleteDessert={handleDeleteDessert}
                />
            )}
        </div>

        {/* Website Stats Footer */}
        <footer className="mt-12 border-t border-slate-200 pt-6 pb-8 text-center text-slate-500 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-6">
                 <div className="bg-white p-4 rounded shadow-sm border border-slate-100 flex flex-col items-center group hover:shadow-md transition-all">
                     <div className="bg-amber-100 p-2 rounded-full mb-2 text-amber-600 group-hover:scale-110 transition-transform">
                        <Users size={18} />
                     </div>
                     <span className="block text-xs text-slate-400 uppercase mb-1">ออนไลน์ขณะนี้</span>
                     <span className="font-bold text-amber-500 text-xl animate-pulse">{stats.online.toLocaleString()}</span>
                 </div>

                 <div className="bg-white p-4 rounded shadow-sm border border-slate-100 flex flex-col items-center group hover:shadow-md transition-all">
                     <div className="bg-emerald-100 p-2 rounded-full mb-2 text-emerald-600 group-hover:scale-110 transition-transform">
                        <BarChart3 size={18} />
                     </div>
                     <span className="block text-xs text-slate-400 uppercase mb-1">เข้าชมวันนี้</span>
                     <span className="font-bold text-emerald-600 text-xl">{stats.today.toLocaleString()}</span>
                 </div>

                 <div className="bg-white p-4 rounded shadow-sm border border-slate-100 flex flex-col items-center group hover:shadow-md transition-all">
                     <div className="bg-blue-100 p-2 rounded-full mb-2 text-blue-600 group-hover:scale-110 transition-transform">
                        <Calendar size={18} />
                     </div>
                     <span className="block text-xs text-slate-400 uppercase mb-1">เดือนนี้</span>
                     <span className="font-bold text-blue-900 text-xl">{stats.month.toLocaleString()}</span>
                 </div>

                 <div className="bg-white p-4 rounded shadow-sm border border-slate-100 flex flex-col items-center group hover:shadow-md transition-all">
                     <div className="bg-indigo-100 p-2 rounded-full mb-2 text-indigo-600 group-hover:scale-110 transition-transform">
                        <PieChart size={18} />
                     </div>
                     <span className="block text-xs text-slate-400 uppercase mb-1">ปีนี้</span>
                     <span className="font-bold text-indigo-600 text-xl">{stats.year.toLocaleString()}</span>
                 </div>
            </div>
            <p>© 2024 ระบบสารสนเทศภูมิปัญญาท้องถิ่น (Local Wisdom Connect). สงวนลิขสิทธิ์.</p>
        </footer>
      </main>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <PlaceDetail 
            place={selectedPlace} 
            onClose={() => setSelectedPlace(null)} 
        />
      )}

      {/* Dessert Detail Modal */}
      {selectedDessert && (
        <DessertDetail 
            dessert={selectedDessert} 
            onClose={() => setSelectedDessert(null)} 
        />
      )}
    </div>
  );
};

export default App;