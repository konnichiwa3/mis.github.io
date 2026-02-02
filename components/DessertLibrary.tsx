import React, { useState } from 'react';
import { ThaiDessert } from '../types';
import { 
  Utensils, MapPin, Search, Flame, Clock, Star
} from 'lucide-react';

interface DessertLibraryProps {
  desserts: ThaiDessert[];
  onSelectDessert: (dessert: ThaiDessert) => void;
}

const DessertLibrary: React.FC<DessertLibraryProps> = ({ desserts, onSelectDessert }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDesserts = desserts.filter(d => 
    d.name.includes(searchTerm) || d.origin.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div>
           <h2 className="text-2xl font-bold text-amber-700 flex items-center gap-2">
              <Utensils className="text-amber-500" />
              ขนมไทยโบราณในท้องถิ่น
           </h2>
           <p className="text-slate-500 text-sm mt-1">คลังความรู้ มรดกทางวัฒนธรรม และสูตรต้นตำรับ</p>
        </div>
        <div className="relative w-full md:w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
              type="text" 
              placeholder="ค้นหาชื่อขนม หรือ จังหวัด..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:ring-2 focus:ring-amber-400 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDesserts.map((dessert) => (
          <div 
            key={dessert.id}
            onClick={() => onSelectDessert(dessert)}
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-slate-200 overflow-hidden cursor-pointer flex flex-col h-full"
          >
            <div className="relative h-48 overflow-hidden">
               <img 
                 src={dessert.images.main} 
                 alt={dessert.name} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-bold text-amber-800 shadow-sm flex items-center gap-1">
                  <MapPin size={10} /> {dessert.origin}
               </div>
               {dessert.rating && (
                   <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white flex items-center gap-1">
                       <Star size={10} className="text-amber-400" fill="#fbbf24" /> {dessert.rating.toFixed(1)}
                   </div>
               )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
               <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">
                 {dessert.name}
               </h3>
               {dessert.localName && <p className="text-xs text-slate-500 italic mb-2">ชื่อท้องถิ่น: {dessert.localName}</p>}
               <p className="text-sm text-slate-600 line-clamp-2 flex-1">{dessert.description}</p>
               <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock size={12} /> {dessert.season}</span>
                  <span className="flex items-center gap-1 text-red-400"><Flame size={12} /> {dessert.nutrition.calories || '-'} kcal</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DessertLibrary;