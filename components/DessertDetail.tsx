import React, { useState, useEffect } from 'react';
import { ThaiDessert, Review } from '../types';
import { 
  BookOpen, Heart, Info, Clock, MapPin, 
  ChefHat, AlertCircle, X, Leaf, Flame, Navigation,
  Share2, Star, Send, Facebook, Twitter, MessageCircle, Link as LinkIcon, Check, Youtube, ImageIcon, PlayCircle, Maximize2
} from 'lucide-react';

interface DessertDetailProps {
  dessert: ThaiDessert;
  onClose: () => void;
}

const DessertDetail: React.FC<DessertDetailProps> = ({ dessert, onClose }) => {
  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Video State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Share & Review State
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [localReviews, setLocalReviews] = useState<Review[]>(dessert.reviews || []);

  useEffect(() => {
    setLocalReviews(dessert.reviews || []);
    setUserRating(0);
    setUserComment("");
    setShowShareMenu(false);
    setIsCopied(false);
    setLightboxImage(null);
    setIsPlayingVideo(false);
  }, [dessert]);

  const shareToSocial = (platform: 'facebook' | 'twitter' | 'line') => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`แนะนำขนมไทยโบราณ: ${dessert.name} (${dessert.origin})\n${dessert.description}`);
      let shareUrl = '';

      if (platform === 'facebook') {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      } else if (platform === 'twitter') {
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      } else if (platform === 'line') {
          shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
      }

      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
  };

  const copyToClipboard = () => {
      const textToCopy = `${dessert.name} - ${window.location.href}`;
      navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitReview = () => {
      if (userRating === 0 || !userComment.trim()) {
          alert("กรุณาให้คะแนนและเขียนข้อความรีวิว");
          return;
      }

      const newReview: Review = {
          id: Date.now().toString(),
          user: 'ผู้เยี่ยมชม (Guest)',
          rating: userRating,
          comment: userComment,
          date: new Date().toISOString().split('T')[0]
      };

      setLocalReviews([newReview, ...localReviews]);
      setUserComment("");
      setUserRating(0);
      alert("ขอบคุณสำหรับความคิดเห็น!");
  };

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = dessert.youtubeUrl ? getYoutubeId(dessert.youtubeUrl) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
       <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-in">
          
          {/* Top Right Controls */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
              <div className="relative">
                  <button 
                    onClick={() => setShowShareMenu(!showShareMenu)} 
                    className="bg-white/90 p-2 rounded-full hover:bg-slate-200 transition-colors text-amber-700 shadow-sm"
                    title="แชร์"
                  >
                    <Share2 size={24} />
                  </button>
                  
                  {/* Social Share Menu */}
                  {showShareMenu && (
                      <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-slate-200 p-2 w-48 flex flex-col gap-1 z-50 animate-fade-in">
                          <button onClick={() => shareToSocial('facebook')} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded-md transition-colors">
                              <Facebook size={16} className="text-blue-600" /> Facebook
                          </button>
                          <button onClick={() => shareToSocial('twitter')} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded-md transition-colors">
                              <Twitter size={16} className="text-sky-500" /> Twitter (X)
                          </button>
                          <button onClick={() => shareToSocial('line')} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded-md transition-colors">
                              <MessageCircle size={16} className="text-green-500" /> Line
                          </button>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button onClick={copyToClipboard} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                              {isCopied ? <Check size={16} className="text-emerald-500" /> : <LinkIcon size={16} className="text-slate-500" />}
                              {isCopied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
                          </button>
                      </div>
                  )}
              </div>

              <button 
                onClick={onClose}
                className="bg-white/90 p-2 rounded-full hover:bg-slate-200 z-10 transition-colors shadow-sm text-slate-700"
              >
                <X size={24} />
              </button>
          </div>

          {/* Hero Image */}
          <div 
            className="h-64 md:h-80 w-full relative cursor-pointer group"
            onClick={() => setLightboxImage(dessert.images.main)}
          >
             <img src={dessert.images.main} alt={dessert.name} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
             <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-black/30 p-3 rounded-full backdrop-blur-sm">
                    <Maximize2 className="text-white" size={32} />
                </div>
             </div>
             <div className="absolute bottom-0 left-0 p-8 text-white w-full pointer-events-none">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded mb-2 inline-block">
                            {dessert.origin}
                        </span>
                        <h1 className="text-4xl font-bold mb-2 shadow-sm">{dessert.name}</h1>
                        <p className="text-amber-200 text-lg font-medium">{dessert.localName}</p>
                    </div>
                    {/* Rating Display in Hero */}
                    <div className="hidden md:block text-right">
                         <div className="flex items-center gap-1 justify-end text-amber-400 mb-1">
                             {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={20} fill={i < Math.round(dessert.rating || 0) ? "currentColor" : "none"} />
                             ))}
                         </div>
                         <p className="text-sm text-slate-300">{localReviews.length > 0 ? `${localReviews.length} รีวิว` : 'ยังไม่มีรีวิว'}</p>
                    </div>
                </div>
             </div>
          </div>

          {/* Content Grid */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left Column: Info & Culture */}
             <div className="lg:col-span-2 space-y-8">
                {/* Basic Info */}
                <section>
                   <h3 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-2">
                      <Info size={20} /> ข้อมูลพื้นฐาน
                   </h3>
                   <p className="text-slate-700 leading-relaxed bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                      {dessert.description}
                   </p>
                </section>

                {/* YouTube Video Section if available */}
                {youtubeId && (
                     <section>
                        <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                            <Youtube size={24} className="text-red-600" /> วิดีโอสาธิต/แนะนำ
                        </h3>
                        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md border border-slate-200 bg-black relative">
                            {!isPlayingVideo ? (
                                <div 
                                    className="w-full h-full cursor-pointer group relative"
                                    onClick={() => setIsPlayingVideo(true)}
                                >
                                    <img 
                                        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} 
                                        alt="Video Thumbnail" 
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                             <PlayCircle size={32} className="text-white fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white text-sm font-medium drop-shadow-md bg-black/50 px-2 py-1 rounded">
                                        คลิกเพื่อเล่นวิดีโอ
                                    </div>
                                </div>
                            ) : (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                     </section>
                )}

                {/* Cultural Context */}
                <section>
                   <h3 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-2">
                      <BookOpen size={20} /> วัฒนธรรมและประวัติศาสตร์
                   </h3>
                   <div className="space-y-4">
                      <div className="bg-white border border-slate-200 p-5 rounded-lg">
                         <h4 className="font-bold text-slate-800 mb-2">ประวัติความเป็นมา</h4>
                         <p className="text-sm text-slate-600">{dessert.history}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-white border border-slate-200 p-4 rounded-lg">
                            <h4 className="font-bold text-slate-800 mb-1 text-sm">ความเชื่อ/พิธีกรรม</h4>
                            <p className="text-sm text-slate-600">{dessert.beliefs || '-'}</p>
                         </div>
                         <div className="bg-white border border-slate-200 p-4 rounded-lg">
                            <h4 className="font-bold text-slate-800 mb-1 text-sm">ฤดูกาล</h4>
                            <p className="text-sm text-slate-600">{dessert.season}</p>
                         </div>
                      </div>
                   </div>
                </section>

                {/* Recipe */}
                <section>
                   <h3 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-2">
                      <ChefHat size={20} /> สูตรและขั้นตอนการทำ
                   </h3>
                   
                   {/* Ingredients & Equipment */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                         <h4 className="font-bold text-slate-700 mb-3 border-b border-slate-200 pb-2">วัตถุดิบหลัก</h4>
                         <ul className="space-y-2">
                            {dessert.ingredients.map((ing, idx) => (
                               <li key={idx} className="flex justify-between text-sm">
                                  <span className="text-slate-700">• {ing.name}</span>
                                  <span className="text-slate-500 font-medium">{ing.amount}</span>
                               </li>
                            ))}
                         </ul>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                         <h4 className="font-bold text-slate-700 mb-3 border-b border-slate-200 pb-2">อุปกรณ์เฉพาะทาง</h4>
                         <ul className="space-y-2">
                            {dessert.equipment.map((item, idx) => (
                               <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> {item}
                               </li>
                            ))}
                         </ul>
                      </div>
                   </div>

                   {/* Steps */}
                   <div className="space-y-4 mb-6">
                       <h4 className="font-bold text-slate-700">วิธีทำ (Step-by-Step)</h4>
                       {dessert.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-4">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                             </div>
                             <p className="text-slate-700 text-sm mt-1">{step}</p>
                          </div>
                       ))}
                   </div>

                   {/* Process Images Gallery */}
                   {dessert.images.process && dessert.images.process.length > 0 && (
                       <div className="mb-4">
                           <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                               <ImageIcon size={16} /> ภาพขั้นตอนการทำ
                           </h4>
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                               {dessert.images.process.map((img, idx) => (
                                   <div 
                                        key={idx} 
                                        className="h-24 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => setLightboxImage(img)}
                                   >
                                       <img src={img} alt={`Process ${idx + 1}`} className="w-full h-full object-cover" />
                                   </div>
                               ))}
                           </div>
                       </div>
                   )}

                   {/* Tips */}
                   {dessert.tips && (
                      <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex gap-3">
                         <Leaf className="text-yellow-600 flex-shrink-0" size={20} />
                         <div>
                            <h4 className="font-bold text-yellow-800 text-sm mb-1">เคล็ดลับก้นครัว</h4>
                            <p className="text-yellow-700 text-sm">{dessert.tips}</p>
                         </div>
                      </div>
                   )}
                </section>

                {/* REVIEWS SECTION */}
                <section className="pt-6 border-t border-slate-200">
                    <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                        <MessageCircle size={20} /> รีวิวและความคิดเห็น ({localReviews.length})
                    </h3>
                    
                    {/* Add Review Form */}
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mb-6">
                        <h4 className="font-bold text-sm text-slate-700 mb-3">แชร์ประสบการณ์ของคุณ</h4>
                        <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                    key={star} 
                                    onClick={() => setUserRating(star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star 
                                        size={24} 
                                        fill={userRating >= star ? "#fbbf24" : "none"} 
                                        className={userRating >= star ? "text-amber-400" : "text-slate-300"} 
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-xs text-slate-500">{userRating > 0 ? `${userRating} ดาว` : 'เลือกคะแนน'}</span>
                        </div>
                        <textarea 
                            className="w-full border border-slate-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-amber-900 focus:border-transparent outline-none mb-3"
                            placeholder="รสชาติเป็นอย่างไร? ทำยากไหม? เล่าให้เราฟัง..."
                            rows={3}
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end">
                            <button 
                                onClick={handleSubmitReview}
                                className="bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-amber-700 transition-colors"
                            >
                                <Send size={16} /> ส่งรีวิว
                            </button>
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {localReviews.length > 0 ? localReviews.map(review => (
                            <div key={review.id} className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-slate-800 text-sm">{review.user}</span>
                                    <span className="text-xs text-slate-400">{review.date}</span>
                                </div>
                                <div className="flex text-amber-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600">"{review.comment}"</p>
                            </div>
                        )) : (
                            <p className="text-slate-500 italic text-sm text-center py-4 bg-slate-50 rounded-lg">ยังไม่มีความคิดเห็น เป็นคนแรกที่รีวิวเลย!</p>
                        )}
                    </div>
                </section>
             </div>

             {/* Right Column: Nutrition & Location */}
             <div className="space-y-6">
                {/* Nutrition Card */}
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                   <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Heart size={18} className="text-red-500" /> ข้อมูลโภชนาการ
                   </h4>
                   <div className="text-center py-4">
                      <div className="text-3xl font-bold text-slate-800 mb-1">{dessert.nutrition.calories}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">กิโลแคลอรี่ / หน่วย</div>
                   </div>
                   {dessert.nutrition.healthNotes && (
                      <div className="bg-red-50 p-3 rounded text-xs text-red-700 flex gap-2 mt-2">
                          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                          {dessert.nutrition.healthNotes}
                      </div>
                   )}
                </div>

                {/* Location Card */}
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                   <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                      <MapPin size={18} className="text-blue-600" /> แหล่งต้นตำรับ
                   </h4>
                   <p className="text-sm text-slate-600 mb-2">
                      <span className="font-semibold block mb-1">ที่อยู่:</span>
                      {dessert.address || 'ไม่ระบุที่อยู่แน่ชัด'}
                   </p>
                   <div className="text-xs text-slate-500 mb-4">
                      {dessert.subDistrict && <span>ต.{dessert.subDistrict} </span>}
                      {dessert.district && <span>อ.{dessert.district} </span>}
                      {dessert.origin && <span>จ.{dessert.origin}</span>}
                   </div>
                   <a 
                       href={`https://www.google.com/maps/dir/?api=1&destination=${dessert.lat},${dessert.lng}`}
                       target="_blank" 
                       rel="noreferrer"
                       className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded shadow-sm font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                   >
                       <Navigation size={16} /> นำทางไปร้านต้นตำรับ
                   </a>
                </div>
             </div>
          </div>

       </div>

       {/* Lightbox Modal */}
       {lightboxImage && (
        <div 
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setLightboxImage(null)}
        >
            <button 
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                onClick={() => setLightboxImage(null)}
            >
                <X size={32} />
            </button>
            <img 
                src={lightboxImage} 
                alt="Full Size" 
                className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
            />
        </div>
      )}
    </div>
  );
};

export default DessertDetail;