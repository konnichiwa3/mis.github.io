import React, { useState } from 'react';
import { Place, Category, ThaiDessert, DessertIngredient } from '../types';
import { 
    Edit, Trash2, Plus, Save, User, Lock, LogIn, MapPin, 
    Image as ImageIcon, Phone, Globe, UserCircle, Minus, X,
    Utensils, LayoutList, History, ChefHat, Heart, Youtube
} from 'lucide-react';

interface AdminPanelProps {
  places: Place[];
  onAddPlace: (place: Place) => void;
  onUpdatePlace: (place: Place) => void;
  onDeletePlace: (id: string) => void;
  // Dessert Props
  desserts: ThaiDessert[];
  onAddDessert: (dessert: ThaiDessert) => void;
  onUpdateDessert: (dessert: ThaiDessert) => void;
  onDeleteDessert: (id: string) => void;
}

type ManageTab = 'PLACES' | 'DESSERTS';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    places, onAddPlace, onUpdatePlace, onDeletePlace,
    desserts, onAddDessert, onUpdateDessert, onDeleteDessert
}) => {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Management State
  const [activeTab, setActiveTab] = useState<ManageTab>('PLACES');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- Place Form State ---
  const initialPlaceState: Partial<Place> = {
    name: '',
    category: Category.SUB_DISTRICT,
    description: '',
    ownerName: '',
    contact: '',
    socialMedia: '',
    youtubeUrl: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    lat: 13.75,
    lng: 100.50,
    coverImage: '',
    images: []
  };
  const [newPlace, setNewPlace] = useState<Partial<Place>>(initialPlaceState);

  // --- Dessert Form State ---
  const initialDessertState: Partial<ThaiDessert> = {
      name: '',
      localName: '',
      origin: '',
      subDistrict: '',
      district: '',
      description: '',
      lat: 13.75,
      lng: 100.50,
      address: '',
      images: { main: '', process: [], ingredients: [] },
      history: '',
      beliefs: '',
      season: '',
      ingredients: [],
      equipment: [],
      steps: [],
      tips: '',
      nutrition: { calories: 0, healthNotes: '' },
      youtubeUrl: ''
  };
  const [newDessert, setNewDessert] = useState<Partial<ThaiDessert>>(initialDessertState);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'Phansweetlocal1111') {
        setIsLoggedIn(true);
        setLoginError('');
    } else {
        setLoginError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  // --- Place Handlers ---
  const handleClickAddPlace = () => {
      setNewPlace(initialPlaceState);
      setEditingId(null);
      setIsFormVisible(true);
  };

  const handleClickEditPlace = (place: Place) => {
      setNewPlace({ ...place, images: place.images || [] });
      setEditingId(place.id);
      setIsFormVisible(true);
  };

  const addPlaceImage = () => {
      setNewPlace({ ...newPlace, images: [...(newPlace.images || []), ''] });
  };

  const updatePlaceImage = (index: number, value: string) => {
      const currentImages = [...(newPlace.images || [])];
      currentImages[index] = value;
      setNewPlace({ ...newPlace, images: currentImages });
  };

  const removePlaceImage = (index: number) => {
      const currentImages = [...(newPlace.images || [])];
      currentImages.splice(index, 1);
      setNewPlace({ ...newPlace, images: currentImages });
  };

  const handlePlaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlace.name && newPlace.description) {
        const filteredImages = (newPlace.images || []).filter(img => img.trim() !== '');
        if (editingId) {
            onUpdatePlace({ ...newPlace, id: editingId, images: filteredImages } as Place);
        } else {
            onAddPlace({
                ...newPlace,
                id: Date.now().toString(),
                images: filteredImages,
                rating: 5.0, visits: 0, reviews: []
            } as Place);
        }
        setIsFormVisible(false);
        setNewPlace(initialPlaceState);
        setEditingId(null);
    }
  };

  // --- Dessert Handlers ---
  const handleClickAddDessert = () => {
      setNewDessert(JSON.parse(JSON.stringify(initialDessertState))); // Deep copy
      setEditingId(null);
      setIsFormVisible(true);
  };

  const handleClickEditDessert = (dessert: ThaiDessert) => {
      setNewDessert(JSON.parse(JSON.stringify(dessert))); // Deep copy
      setEditingId(dessert.id);
      setIsFormVisible(true);
  };

  const handleDessertSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newDessert.name && newDessert.description) {
          if (editingId) {
              onUpdateDessert({ ...newDessert, id: editingId } as ThaiDessert);
          } else {
              onAddDessert({ ...newDessert, id: Date.now().toString() } as ThaiDessert);
          }
          setIsFormVisible(false);
          setNewDessert(initialDessertState);
          setEditingId(null);
      }
  };

  // Dessert Array Helpers
  const addDessertIngredient = () => {
      const current = newDessert.ingredients || [];
      setNewDessert({ ...newDessert, ingredients: [...current, { name: '', amount: '' }] });
  };
  const updateDessertIngredient = (idx: number, field: keyof DessertIngredient, value: string) => {
      const current = [...(newDessert.ingredients || [])];
      current[idx] = { ...current[idx], [field]: value };
      setNewDessert({ ...newDessert, ingredients: current });
  };
  const removeDessertIngredient = (idx: number) => {
      const current = [...(newDessert.ingredients || [])];
      current.splice(idx, 1);
      setNewDessert({ ...newDessert, ingredients: current });
  };

  const addListString = (field: 'equipment' | 'steps') => {
      const current = newDessert[field] || [];
      setNewDessert({ ...newDessert, [field]: [...current, ''] });
  };
  const updateListString = (field: 'equipment' | 'steps', idx: number, value: string) => {
      const current = [...(newDessert[field] || [])];
      current[idx] = value;
      setNewDessert({ ...newDessert, [field]: current });
  };
  const removeListString = (field: 'equipment' | 'steps', idx: number) => {
      const current = [...(newDessert[field] || [])];
      current.splice(idx, 1);
      setNewDessert({ ...newDessert, [field]: current });
  };

  // Dessert Process Images Handlers
  const addProcessImage = () => {
    const currentProcess = newDessert.images?.process || [];
    setNewDessert({
        ...newDessert,
        images: { ...newDessert.images!, process: [...currentProcess, ''] }
    });
  };

  const updateProcessImage = (idx: number, value: string) => {
    const currentProcess = [...(newDessert.images?.process || [])];
    currentProcess[idx] = value;
    setNewDessert({
        ...newDessert,
        images: { ...newDessert.images!, process: currentProcess }
    });
  };

  const removeProcessImage = (idx: number) => {
    const currentProcess = [...(newDessert.images?.process || [])];
    currentProcess.splice(idx, 1);
    setNewDessert({
        ...newDessert,
        images: { ...newDessert.images!, process: currentProcess }
    });
  };


  if (!isLoggedIn) {
      // Login Form (Same as before)
      return (
        <div className="min-h-[600px] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900">เข้าสู่ระบบสารสนเทศ</h2>
                    <p className="text-slate-500 text-sm">สำหรับเจ้าหน้าที่ผู้ดูแลระบบ (สกร.)</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ใช้งาน</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input type="password" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                    </div>
                    {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
                    <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-md font-medium flex items-center justify-center gap-2">
                        <LogIn size={18} /> เข้าสู่ระบบ
                    </button>
                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[800px]">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50 gap-4">
        <div>
            <h2 className="text-xl font-bold text-blue-900">ระบบจัดการฐานข้อมูล</h2>
            <p className="text-xs text-slate-500">Administrator Panel</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
            <button 
                onClick={() => { setActiveTab('PLACES'); setIsFormVisible(false); }}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'PLACES' ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                <LayoutList size={16} /> ทะเบียนสถานที่
            </button>
            <button 
                 onClick={() => { setActiveTab('DESSERTS'); setIsFormVisible(false); }}
                 className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'DESSERTS' ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                <Utensils size={16} /> ขนมไทยโบราณ
            </button>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={activeTab === 'PLACES' ? handleClickAddPlace : handleClickAddDessert}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors shadow-sm text-white ${activeTab === 'PLACES' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}
            >
                <Plus size={16} /> เพิ่มข้อมูล
            </button>
            <button 
                onClick={() => setIsLoggedIn(false)}
                className="border border-slate-300 text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
                ออกจากระบบ
            </button>
        </div>
      </div>

      {/* --- FORM SECTION --- */}
      {isFormVisible && (
          <div className="p-6 bg-slate-50/50 border-b border-blue-100 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Plus size={20} className={activeTab === 'PLACES' ? "text-blue-600" : "text-amber-600"} /> 
                    {editingId ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'} ({activeTab === 'PLACES' ? 'สถานที่' : 'ขนมไทย'})
                 </h3>
                 <button onClick={() => setIsFormVisible(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>

              {/* PLACE FORM */}
              {activeTab === 'PLACES' && (
                  <form onSubmit={handlePlaceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">ชื่อแหล่งเรียนรู้ *</label>
                        <input type="text" className="w-full border p-2 rounded-md outline-none" value={newPlace.name} onChange={e => setNewPlace({...newPlace, name: e.target.value})} required />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">ประเภท</label>
                        <select className="w-full border p-2 rounded-md outline-none" value={newPlace.category} onChange={(e) => setNewPlace({...newPlace, category: e.target.value as Category})}>
                            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className="col-span-2 md:col-span-1"><label className="block text-sm text-slate-500 mb-1">ผู้ดูแล</label><input type="text" placeholder="ชื่อ-สกุล" className="w-full border p-2 rounded-md outline-none" value={newPlace.ownerName} onChange={e => setNewPlace({...newPlace, ownerName: e.target.value})} /></div>
                      <div className="col-span-2 md:col-span-1"><label className="block text-sm text-slate-500 mb-1">เบอร์โทรติดต่อ</label><input type="text" placeholder="0xx-xxx-xxxx" className="w-full border p-2 rounded-md outline-none" value={newPlace.contact} onChange={e => setNewPlace({...newPlace, contact: e.target.value})} /></div>
                      <div className="col-span-2 md:col-span-1"><label className="block text-sm text-slate-500 mb-1">ลิงก์ Social Media</label><input type="text" placeholder="เช่น FB, Line ID, Website" className="w-full border p-2 rounded-md outline-none" value={newPlace.socialMedia} onChange={e => setNewPlace({...newPlace, socialMedia: e.target.value})} /></div>
                      
                      {/* YouTube Input for Place */}
                      <div className="col-span-2 md:col-span-1">
                          <label className="block text-sm text-slate-500 mb-1 flex items-center gap-1"><Youtube size={14} className="text-red-500"/> ลิงก์ YouTube (Video)</label>
                          <input type="text" placeholder="เช่น https://youtu.be/..." className="w-full border p-2 rounded-md outline-none" value={newPlace.youtubeUrl} onChange={e => setNewPlace({...newPlace, youtubeUrl: e.target.value})} />
                      </div>

                      <h4 className="font-bold text-blue-900 border-b pb-2 pt-2 flex items-center gap-2 col-span-2"><MapPin size={16}/> ที่อยู่และพิกัด</h4>
                      <div className="col-span-2 md:col-span-2"><label className="block text-sm text-slate-500 mb-1">รายละเอียดที่อยู่</label><input type="text" placeholder="เลขที่ หมู่บ้าน..." className="w-full border p-2 rounded-md outline-none" value={newPlace.address} onChange={e => setNewPlace({...newPlace, address: e.target.value})} /></div>
                      
                      <div className="col-span-2 md:col-span-2 grid grid-cols-3 gap-2">
                         <div><label className="text-xs text-slate-500">ตำบล</label><input type="text" className="w-full border p-2 rounded-md" value={newPlace.subDistrict} onChange={e => setNewPlace({...newPlace, subDistrict: e.target.value})} /></div>
                         <div><label className="text-xs text-slate-500">อำเภอ</label><input type="text" className="w-full border p-2 rounded-md" value={newPlace.district} onChange={e => setNewPlace({...newPlace, district: e.target.value})} /></div>
                         <div><label className="text-xs text-slate-500">จังหวัด</label><input type="text" className="w-full border p-2 rounded-md" value={newPlace.province} onChange={e => setNewPlace({...newPlace, province: e.target.value})} /></div>
                      </div>

                      <div className="col-span-2 md:col-span-2 grid grid-cols-2 gap-2">
                         <div><label className="text-xs text-slate-500">ละติจูด (Lat)</label><input type="number" step="any" className="w-full border p-2 rounded-md" value={newPlace.lat} onChange={e => setNewPlace({...newPlace, lat: parseFloat(e.target.value)})} /></div>
                         <div><label className="text-xs text-slate-500">ลองจิจูด (Lng)</label><input type="number" step="any" className="w-full border p-2 rounded-md" value={newPlace.lng} onChange={e => setNewPlace({...newPlace, lng: parseFloat(e.target.value)})} /></div>
                      </div>

                      <h4 className="font-bold text-blue-900 border-b pb-2 pt-2 flex items-center gap-2 col-span-2"><ImageIcon size={16}/> รูปภาพ</h4>
                      <div className="col-span-2"><label className="block text-sm text-slate-500 mb-1">รูปปก (Cover Image URL)</label><input type="text" placeholder="URL ของรูปภาพหลัก" className="w-full border p-2 rounded-md outline-none" value={newPlace.coverImage} onChange={e => setNewPlace({...newPlace, coverImage: e.target.value})} /></div>
                      
                      <div className="col-span-2 bg-slate-100 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-700">ภาพบรรยากาศ (Gallery)</span>
                            <button type="button" onClick={addPlaceImage} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1"><Plus size={12}/> เพิ่มรูป</button>
                        </div>
                        <div className="space-y-2">
                            {(newPlace.images || []).map((img, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input type="text" placeholder="URL รูปภาพ" className="flex-1 border p-1 rounded text-sm" value={img} onChange={e => updatePlaceImage(idx, e.target.value)} />
                                    <button type="button" onClick={() => removePlaceImage(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                </div>
                            ))}
                            {(newPlace.images || []).length === 0 && <p className="text-xs text-slate-400 italic">ยังไม่มีรูปภาพเพิ่มเติม</p>}
                        </div>
                      </div>

                      <div className="col-span-2"><label className="block text-sm text-slate-500 mb-1">รายละเอียด/คำบรรยาย *</label><textarea placeholder="รายละเอียด..." className="w-full border p-2 rounded-md h-24 outline-none" value={newPlace.description} onChange={e => setNewPlace({...newPlace, description: e.target.value})} required /></div>
                      
                      <div className="col-span-2 flex justify-end gap-2 pt-4">
                          <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-md">ยกเลิก</button>
                          <button type="submit" className="bg-blue-900 text-white px-6 py-2 rounded-md">บันทึก</button>
                      </div>
                  </form>
              )}

              {/* DESSERT FORM */}
              {activeTab === 'DESSERTS' && (
                  <form onSubmit={handleDessertSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2 md:col-span-1 space-y-4">
                          <h4 className="font-bold text-amber-800 border-b pb-2 flex items-center gap-2"><Utensils size={16}/> ข้อมูลทั่วไป</h4>
                          <div><label className="text-xs text-slate-500">ชื่อขนม *</label><input type="text" className="w-full border p-2 rounded" value={newDessert.name} onChange={e => setNewDessert({...newDessert, name: e.target.value})} required /></div>
                          <div><label className="text-xs text-slate-500">ชื่อท้องถิ่น</label><input type="text" className="w-full border p-2 rounded" value={newDessert.localName} onChange={e => setNewDessert({...newDessert, localName: e.target.value})} /></div>
                          <div><label className="text-xs text-slate-500">จังหวัด/แหล่งกำเนิด</label><input type="text" className="w-full border p-2 rounded" value={newDessert.origin} onChange={e => setNewDessert({...newDessert, origin: e.target.value})} /></div>
                          
                          <div className="flex gap-2">
                             <div className="flex-1"><label className="text-xs text-slate-500">ตำบล</label><input type="text" className="w-full border p-2 rounded" value={newDessert.subDistrict} onChange={e => setNewDessert({...newDessert, subDistrict: e.target.value})} /></div>
                             <div className="flex-1"><label className="text-xs text-slate-500">อำเภอ</label><input type="text" className="w-full border p-2 rounded" value={newDessert.district} onChange={e => setNewDessert({...newDessert, district: e.target.value})} /></div>
                          </div>

                          <div><label className="text-xs text-slate-500">คำอธิบาย/รสชาติ</label><textarea className="w-full border p-2 rounded h-20" value={newDessert.description} onChange={e => setNewDessert({...newDessert, description: e.target.value})} /></div>
                          
                          <h4 className="font-bold text-amber-800 border-b pb-2 pt-2 flex items-center gap-2"><MapPin size={16}/> พิกัดต้นตำรับ</h4>
                           <div><label className="text-xs text-slate-500">ที่อยู่ร้าน/แหล่งผลิต</label><input type="text" className="w-full border p-2 rounded" value={newDessert.address} onChange={e => setNewDessert({...newDessert, address: e.target.value})} /></div>
                           <div className="flex gap-2">
                                <div className="flex-1"><label className="text-xs text-slate-500">Lat</label><input type="number" step="any" className="w-full border p-2 rounded" value={newDessert.lat} onChange={e => setNewDessert({...newDessert, lat: parseFloat(e.target.value)})} /></div>
                                <div className="flex-1"><label className="text-xs text-slate-500">Lng</label><input type="number" step="any" className="w-full border p-2 rounded" value={newDessert.lng} onChange={e => setNewDessert({...newDessert, lng: parseFloat(e.target.value)})} /></div>
                           </div>

                          <h4 className="font-bold text-amber-800 border-b pb-2 pt-2 flex items-center gap-2"><History size={16}/> บริบทวัฒนธรรม</h4>
                          <div><label className="text-xs text-slate-500">ประวัติความเป็นมา</label><textarea className="w-full border p-2 rounded h-20" value={newDessert.history} onChange={e => setNewDessert({...newDessert, history: e.target.value})} /></div>
                          <div><label className="text-xs text-slate-500">ความเชื่อ</label><input type="text" className="w-full border p-2 rounded" value={newDessert.beliefs} onChange={e => setNewDessert({...newDessert, beliefs: e.target.value})} /></div>
                          <div><label className="text-xs text-slate-500">ฤดูกาล</label><input type="text" className="w-full border p-2 rounded" value={newDessert.season} onChange={e => setNewDessert({...newDessert, season: e.target.value})} /></div>
                      </div>

                      <div className="col-span-2 md:col-span-1 space-y-4">
                           <h4 className="font-bold text-amber-800 border-b pb-2 flex items-center gap-2"><ChefHat size={16}/> สูตรและการทำ</h4>
                           
                           {/* Ingredients */}
                           <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                <div className="flex justify-between mb-2"><span className="text-xs font-bold text-amber-900">วัตถุดิบ</span><button type="button" onClick={addDessertIngredient}><Plus size={14} className="text-amber-600"/></button></div>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    {(newDessert.ingredients || []).map((ing, idx) => (
                                        <div key={idx} className="flex gap-1">
                                            <input type="text" placeholder="ชื่อ" className="flex-1 border p-1 rounded text-xs" value={ing.name} onChange={e => updateDessertIngredient(idx, 'name', e.target.value)} />
                                            <input type="text" placeholder="ปริมาณ" className="w-20 border p-1 rounded text-xs" value={ing.amount} onChange={e => updateDessertIngredient(idx, 'amount', e.target.value)} />
                                            <button type="button" onClick={() => removeDessertIngredient(idx)} className="text-red-500"><X size={14}/></button>
                                        </div>
                                    ))}
                                </div>
                           </div>

                           {/* Steps */}
                           <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                <div className="flex justify-between mb-2"><span className="text-xs font-bold text-amber-900">ขั้นตอนการทำ</span><button type="button" onClick={() => addListString('steps')}><Plus size={14} className="text-amber-600"/></button></div>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    {(newDessert.steps || []).map((step, idx) => (
                                        <div key={idx} className="flex gap-1">
                                            <span className="text-xs mt-1 text-slate-400">{idx+1}.</span>
                                            <input type="text" className="flex-1 border p-1 rounded text-xs" value={step} onChange={e => updateListString('steps', idx, e.target.value)} />
                                            <button type="button" onClick={() => removeListString('steps', idx)} className="text-red-500"><X size={14}/></button>
                                        </div>
                                    ))}
                                </div>
                           </div>

                           <div><label className="text-xs text-slate-500">เคล็ดลับก้นครัว</label><input type="text" className="w-full border p-2 rounded" value={newDessert.tips} onChange={e => setNewDessert({...newDessert, tips: e.target.value})} /></div>

                           <h4 className="font-bold text-amber-800 border-b pb-2 pt-2 flex items-center gap-2"><Heart size={16}/> โภชนาการ & รูปภาพ</h4>
                           <div className="flex gap-2">
                                <div className="flex-1"><label className="text-xs text-slate-500">แคลอรี่ (Kcal)</label><input type="number" className="w-full border p-2 rounded" value={newDessert.nutrition?.calories} onChange={e => setNewDessert({...newDessert, nutrition: {...newDessert.nutrition, calories: parseInt(e.target.value)}})} /></div>
                                <div className="flex-[2]"><label className="text-xs text-slate-500">ข้อควรระวัง</label><input type="text" className="w-full border p-2 rounded" value={newDessert.nutrition?.healthNotes} onChange={e => setNewDessert({...newDessert, nutrition: {...newDessert.nutrition, healthNotes: e.target.value}})} /></div>
                           </div>
                           <div>
                               <label className="text-xs text-slate-500">รูปหลัก (URL)</label>
                               <input type="text" className="w-full border p-2 rounded" value={newDessert.images?.main} onChange={e => setNewDessert({...newDessert, images: {...newDessert.images!, main: e.target.value}})} />
                           </div>
                           
                           {/* Process Images */}
                           <div className="bg-slate-100 p-3 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-700">รูปภาพขั้นตอนการทำ</span>
                                    <button type="button" onClick={addProcessImage} className="text-xs bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700 flex items-center gap-1"><Plus size={12}/> เพิ่มรูป</button>
                                </div>
                                <div className="space-y-2">
                                    {(newDessert.images?.process || []).map((img, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input type="text" placeholder="URL รูปขั้นตอน" className="flex-1 border p-1 rounded text-xs" value={img} onChange={e => updateProcessImage(idx, e.target.value)} />
                                            <button type="button" onClick={() => removeProcessImage(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                        </div>
                                    ))}
                                    {(newDessert.images?.process || []).length === 0 && <p className="text-xs text-slate-400 italic">ยังไม่มีรูปขั้นตอน</p>}
                                </div>
                           </div>

                           {/* YouTube Input for Dessert */}
                           <div>
                               <label className="text-xs text-slate-500 flex items-center gap-1"><Youtube size={12} className="text-red-500"/> ลิงก์ YouTube (Video)</label>
                               <input type="text" placeholder="https://youtu.be/..." className="w-full border p-2 rounded" value={newDessert.youtubeUrl} onChange={e => setNewDessert({...newDessert, youtubeUrl: e.target.value})} />
                           </div>
                      </div>

                      <div className="col-span-2 flex justify-end gap-2 pt-4 border-t">
                          <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-md">ยกเลิก</button>
                          <button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md">บันทึกข้อมูลขนม</button>
                      </div>
                  </form>
              )}
          </div>
      )}

      {/* --- TABLE SECTION --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-100 font-bold uppercase text-xs tracking-wider">
            <tr>
              {activeTab === 'PLACES' ? (
                  <>
                    <th className="p-4 border-b text-blue-900">ชื่อแหล่งเรียนรู้</th>
                    <th className="p-4 border-b text-blue-900">ประเภท</th>
                    <th className="p-4 border-b text-blue-900">ผู้ดูแล</th>
                    <th className="p-4 border-b text-blue-900">สถิติเข้าชม</th>
                  </>
              ) : (
                  <>
                    <th className="p-4 border-b text-amber-900">ชื่อขนมไทย</th>
                    <th className="p-4 border-b text-amber-900">จังหวัด/แหล่งกำเนิด</th>
                    <th className="p-4 border-b text-amber-900">จำนวนส่วนผสม</th>
                    <th className="p-4 border-b text-amber-900">แคลอรี่</th>
                  </>
              )}
              <th className="p-4 border-b text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'PLACES' ? places.map((place) => (
              <tr key={place.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-semibold text-slate-800">{place.name}</td>
                <td className="p-4"><span className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-600 inline-block max-w-[150px] truncate">{place.category}</span></td>
                <td className="p-4 text-slate-500">{place.ownerName || '-'}</td>
                <td className="p-4">{place.visits.toLocaleString()}</td>
                <td className="p-4 flex gap-2 justify-end">
                  <button onClick={() => handleClickEditPlace(place)} className="text-blue-700 hover:bg-blue-50 p-2 rounded"><Edit size={16} /></button>
                  <button onClick={() => onDeletePlace(place.id)} className="text-red-700 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            )) : desserts.map((dessert) => (
                <tr key={dessert.id} className="border-b border-slate-100 hover:bg-amber-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-800">{dessert.name}</td>
                  <td className="p-4">{dessert.origin}</td>
                  <td className="p-4">{dessert.ingredients.length} รายการ</td>
                  <td className="p-4">{dessert.nutrition.calories} kcal</td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button onClick={() => handleClickEditDessert(dessert)} className="text-amber-700 hover:bg-amber-50 p-2 rounded"><Edit size={16} /></button>
                    <button onClick={() => onDeleteDessert(dessert.id)} className="text-red-700 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;