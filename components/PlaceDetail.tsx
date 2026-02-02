import React, { useState, useEffect } from 'react';
import { Place, Review } from '../types';
import { 
  X, MapPin, Star, Navigation, Phone, Sparkles, User, Globe, 
  Share2, Send, Maximize2, Facebook, Twitter, MessageCircle, 
  Link as LinkIcon, Check, ChevronLeft, ChevronRight, Youtube, PlayCircle
} from 'lucide-react';
import { MOCK_USER_LOCATION } from '../constants';
import { analyzePlaceReviews } from '../services/geminiService';

interface PlaceDetailProps {
  place: Place;
  onClose: () => void;
}

const PlaceDetail: React.FC<PlaceDetailProps> = ({ place, onClose }) => {
  const [distance, setDistance] = useState<number | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Video State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Gallery Carousel State
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  
  // Share Menu State
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Review State
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [localReviews, setLocalReviews] = useState<Review[]>(place.reviews);

  // Haversine formula for distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    const d = calculateDistance(MOCK_USER_LOCATION.lat, MOCK_USER_LOCATION.lng, place.lat, place.lng);
    setDistance(Number(d.toFixed(2)));
    setLocalReviews(place.reviews); // Reset reviews when place changes
    setIsPlayingVideo(false); // Reset video state

    // Load AI Analysis for reviews
    if (place.reviews.length > 0) {
        setLoadingAi(true);
        analyzePlaceReviews(place.name, place.reviews.map(r => r.comment))
            .then(summary => setAiSummary(summary))
            .finally(() => setLoadingAi(false));
    } else {
        setAiSummary("");
    }
    
    // Reset form & states
    setUserRating(0);
    setUserComment("");
    setLightboxImage(null);
    setShowShareMenu(false);
    setIsCopied(false);
    setCurrentGalleryIndex(0);
  }, [place]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentGalleryIndex((prev) => (prev === 0 ? place.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentGalleryIndex((prev) => (prev === place.images.length - 1 ? 0 : prev + 1));
  };

  const shareToSocial = (platform: 'facebook' | 'twitter' | 'line') => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`แนะนำสถานที่: ${place.name}\n${place.description}`);
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
      const textToCopy = `${place.name} - ${window.location.href}`;
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

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = place.youtubeUrl ? getYoutubeId(place.youtubeUrl) : null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative border border-slate-200">
        
        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
            <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)} 
                  className="bg-white/90 p-2 rounded-full hover:bg-slate-200 transition-colors text-blue-900 shadow-sm"
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
              className="bg-white/90 p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-800 shadow-sm"
            >
              <X size={24} />
            </button>
        </div>

        {/* Hero Image */}
        <div 
            className="h-64 md:h-80 w-full relative cursor-pointer group"
            onClick={() => setLightboxImage(place.coverImage)}
            title="คลิกเพื่อดูภาพขนาดใหญ่"
        >
            <img 
                src={place.coverImage} 
                alt={place.name} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="text-white drop-shadow-md" size={48} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-transparent p-6 pt-20 pointer-events-none">
                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block shadow-sm">
                    {place.category}
                </span>
                <h2 className="text-3xl font-bold text-white shadow-black drop-shadow-md">{place.name}</h2>
            </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="md:col-span-2 space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2 border-b border-slate-100 pb-2">ข้อมูลทั่วไป</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">{place.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-900" />
                        <span className="font-semibold">ผู้ดูแล:</span> {place.ownerName || '-'}
                    </div>
                    <div className="flex items-center gap-2">
                         <Globe size={16} className="text-blue-900" />
                         <span className="font-semibold">Social:</span> {place.socialMedia || '-'}
                    </div>
                </div>

                {/* Video Section if available */}
                {youtubeId && (
                     <div>
                        <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <Youtube size={24} className="text-red-600" /> วิดีโอแนะนำ
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
                     </div>
                )}

                {/* AI Insight */}
                {loadingAi ? (
                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-pulse text-sm text-slate-500">
                        กำลังประมวลผลข้อมูลรีวิว...
                     </div>
                ) : aiSummary && (
                    <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-600">
                        <div className="flex items-center gap-2 mb-2 text-blue-900">
                            <Sparkles size={18} className="text-amber-500" />
                            <h4 className="font-bold">บทสรุปความคิดเห็น (AI Summary)</h4>
                        </div>
                        <p className="text-sm text-slate-700">{aiSummary}</p>
                    </div>
                )}

                {/* Review Section */}
                <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-4 border-b border-slate-100 pb-2">ความคิดเห็นผู้รับบริการ ({localReviews.length})</h3>
                    
                    {/* Add Review Form */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6">
                        <h4 className="font-bold text-sm text-slate-700 mb-3">เขียนรีวิวความประทับใจ</h4>
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
                            className="w-full border border-slate-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none mb-3"
                            placeholder="เล่าประสบการณ์ของคุณที่นี่..."
                            rows={3}
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end">
                            <button 
                                onClick={handleSubmitReview}
                                className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition-colors"
                            >
                                <Send size={16} /> ส่งรีวิว
                            </button>
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {localReviews.length > 0 ? localReviews.map(review => (
                            <div key={review.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
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
                            <p className="text-slate-500 italic text-sm text-center py-4">ยังไม่มีความคิดเห็น เป็นคนแรกที่รีวิวเลย!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <MapPin size={18} /> ข้อมูลการติดต่อ
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">{place.address}</p>
                    <p className="text-sm text-slate-600 mb-4 flex items-center gap-2 font-medium">
                        <Phone size={14} className="text-blue-900" /> {place.contact}
                    </p>
                    
                    <div className="border-t border-slate-100 pt-4 mt-2">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-slate-500">ระยะทางโดยประมาณ</span>
                            <span className="font-bold text-blue-900">{distance} กม.</span>
                        </div>
                        <a 
                            href={googleMapsUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block w-full bg-blue-900 hover:bg-blue-800 text-white text-center py-2.5 rounded shadow-sm font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <Navigation size={16} /> นำทางด้วย Google Maps
                        </a>
                    </div>
                </div>

                {/* Slideshow Gallery */}
                <div>
                    <h4 className="font-bold text-blue-900 mb-3 text-sm">ภาพบรรยากาศ</h4>
                    
                    {place.images.length > 0 ? (
                        <div className="relative h-48 w-full rounded-lg overflow-hidden border border-slate-200 group bg-slate-100">
                            <img 
                                src={place.images[currentGalleryIndex]} 
                                alt={`Gallery ${currentGalleryIndex}`} 
                                className="w-full h-full object-cover cursor-pointer transition-transform duration-500"
                                onClick={() => setLightboxImage(place.images[currentGalleryIndex])}
                            />
                            
                            {/* Navigation Overlays */}
                            {place.images.length > 1 && (
                                <>
                                    <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <button 
                                            onClick={handlePrevImage} 
                                            className="pointer-events-auto p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button 
                                            onClick={handleNextImage} 
                                            className="pointer-events-auto p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                    
                                    {/* Dots indicators */}
                                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                                        {place.images.map((_, idx) => (
                                            <div 
                                                key={idx}
                                                className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${idx === currentGalleryIndex ? 'bg-white scale-110 opacity-100' : 'bg-white/50 opacity-70'}`}
                                            />
                                        ))}
                                    </div>
                                    
                                    {/* Counter */}
                                    <div className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white backdrop-blur-sm pointer-events-none font-medium">
                                        {currentGalleryIndex + 1} / {place.images.length}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-20 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-slate-400 text-xs italic">
                            ไม่มีภาพเพิ่มเติม
                        </div>
                    )}
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

export default PlaceDetail;