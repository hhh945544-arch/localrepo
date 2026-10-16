import React, { useEffect, useRef, useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Star, 
  Clock, 
  Briefcase, 
  Search,
  X,
  Bookmark,
  Coffee,
  Zap,
  Droplets,
  Store,
  ChevronRight,
  Compass,
  SlidersHorizontal,
  Flame,
  Check,
  ShieldCheck,
  Building2
} from 'lucide-react';
import L from 'leaflet';

export default function MapView({ 
  hubs, 
  userLocation, 
  onSelectHub, 
  onSelectJob,
  onOpenAuth
}) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const routeLineRef = useRef(null);

  // Quick filter pills matching user hand-drawn sketch and mockup:
  // Chai, EV Charge, Washroom, Food, Empty
  const [quickFilter, setQuickFilter] = useState('all'); 
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHubCard, setSelectedHubCard] = useState(hubs[0] || null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSimulatingLocation, setIsSimulatingLocation] = useState(false);
  
  const [currentUserPos, setCurrentUserPos] = useState({
    lat: userLocation?.lat || 28.6139,
    lng: userLocation?.lng || 77.2090,
  });

  // Filter hubs based on quick filters and search query
  const filteredHubs = hubs.filter(hub => {
    const category = hub.category.toLowerCase();
    const categoryMatches = selectedCategoryFilter === 'all' || {
      cafe: /cafe|café|chai|coffee/.test(category),
      restaurant: /restaurant|food|dhab|eat/.test(category),
      rest: /rest|stop|lounge/.test(category),
      hotel: /hotel|motel|inn/.test(category),
      other: /\bother\b/.test(category)
    }[selectedCategoryFilter];
    if (!categoryMatches) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches = 
        hub.name.toLowerCase().includes(q) ||
        hub.category.toLowerCase().includes(q) ||
        hub.address.toLowerCase().includes(q) ||
        hub.description?.toLowerCase().includes(q) ||
        hub.amenities?.some(a => a.toLowerCase().includes(q));
      if (!matches) return false;
    }

    // Quick filter pills matching sketch
    if (quickFilter === 'chai') return hub.hasChai || hub.amenities?.some(a => a.toLowerCase().includes('chai'));
    if (quickFilter === 'ev') return hub.hasEv || hub.amenities?.some(a => a.toLowerCase().includes('charge') || a.toLowerCase().includes('ev'));
    if (quickFilter === 'washroom') return hub.hasWashroom || hub.amenities?.some(a => a.toLowerCase().includes('washroom'));
    if (quickFilter === 'empty') return hub.crowdingStatus === 'EMPTY';
    if (quickFilter === 'nearby') return hub.distanceKm <= 1.0;
    
    return true;
  });

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentUserPos.lat, currentUserPos.lng],
        zoom: 15,
        zoomControl: false,
      });

      // Light CartoDB tiles keep the map consistent with the light interface.
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Yellow pulsating user location pin (matches Image 2 yellow dot with pulsing radar!)
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-amber-400/40 animate-ping"></div>
          <div class="w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-xl shadow-amber-400/50"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker([currentUserPos.lat, currentUserPos.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(`<b style="color:#f59e0b;">Your Location</b><br/>${userLocation?.address || 'Connaught Place, New Delhi'}`);
    
    markersRef.current.push(userMarker);

    // Custom pins for hubs matching Image 1 & 2
    filteredHubs.forEach(hub => {
      const isSelected = selectedHubCard?.id === hub.id;
      const isSharma = hub.id === 'hub_sharma';

      // Pin style: Green circular pin with store icon for Sharma Dhaba (like Image 2), or fuel/hub icon
      const pinColor = isSharma ? 'bg-emerald-500 border-emerald-300' : 
                       hub.hasEv ? 'bg-blue-500 border-blue-300' : 'bg-slate-800 border-slate-600';

      const iconSymbol = isSharma ? '🏪' : hub.hasEv ? '⛽' : '☕';

      const hubIcon = L.divIcon({
        className: 'custom-hub-marker',
        html: `
          <div class="relative group cursor-pointer transition-transform transform ${isSelected ? 'scale-125 z-40' : 'hover:scale-110'}">
            <div class="w-10 h-10 rounded-full ${pinColor} border-2 shadow-2xl flex items-center justify-center text-white text-base font-bold shadow-emerald-500/30">
              ${iconSymbol}
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-slate-700 whitespace-nowrap shadow flex items-center gap-0.5">
              <span class="w-1.5 h-1.5 rounded-full ${hub.crowdingStatus === 'EMPTY' ? 'bg-emerald-400' : hub.crowdingStatus === 'CROWDED' ? 'bg-rose-500' : 'bg-amber-400'}"></span>
              ${hub.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 48],
      });

      const marker = L.marker([hub.lat, hub.lng], { icon: hubIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedHubCard(hub);
          map.panTo([hub.lat, hub.lng]);
        });

      markersRef.current.push(marker);
    });

  }, [filteredHubs, selectedHubCard, currentUserPos]);

  // Handle START ROUTE (Polyline on map + navigation HUD)
  const handleStartRoute = (hub) => {
    setIsNavigating(true);
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;

    // Remove existing route line if any
    if (routeLineRef.current) {
      routeLineRef.current.remove();
    }

    // Polyline coordinates from user to hub
    const latlngs = [
      [currentUserPos.lat, currentUserPos.lng],
      [
        (currentUserPos.lat + hub.lat) / 2 + 0.0004, 
        (currentUserPos.lng + hub.lng) / 2 - 0.0003
      ],
      [hub.lat, hub.lng]
    ];

    const polyline = L.polyline(latlngs, {
      color: '#facc15', // Amber-400 matching start route button
      weight: 5,
      dashArray: '8, 8',
      opacity: 0.9
    }).addTo(map);

    routeLineRef.current = polyline;
    map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
  };

  const handleStopRoute = () => {
    setIsNavigating(false);
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }
  };

  // Recenter Map
  const handleRecenter = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([currentUserPos.lat, currentUserPos.lng], 15);
    }
  };

  // Simulate movement
  const handleSimulateMove = () => {
    setIsSimulatingLocation(true);
    const newLat = currentUserPos.lat + (Math.random() - 0.5) * 0.003;
    const newLng = currentUserPos.lng + (Math.random() - 0.5) * 0.003;
    setCurrentUserPos({ lat: newLat, lng: newLng });
    setTimeout(() => setIsSimulatingLocation(false), 600);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-950 font-sans">
      
      {/* ========================================================
          TOP FLOATING SEARCH & FILTER BAR (EXACT WIREFRAME DESIGN)
         ======================================================== */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-[460px] z-30 space-y-2 pointer-events-auto">
        
        {/* Main Search Bar with Profile Icon and Filter Button */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-full px-3 py-2 shadow-2xl">
          
          {/* User Profile Avatar / Trigger */}
          <button 
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition shrink-0"
            title="Profile & Authentication"
          >
            <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center">
              <span className="text-[10px]">👤</span>
            </div>
          </button>

          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hubs, dhabas..."
              className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Clear Search */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-white transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
              onClick={() => setShowCategoryFilters(open => !open)}
              className={`p-1.5 rounded-full border transition ${
                showCategoryFilters || selectedCategoryFilter !== 'all'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Filter by place category"
              aria-label="Filter by place category"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
        </div>

        {showCategoryFilters && (
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl">
            {[
              ['all', 'All Places'],
              ['cafe', 'Cafe'],
              ['restaurant', 'Restaurant'],
              ['rest', 'Rest areas'],
              ['hotel', 'Hotel'],
              ['other', 'Other']
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSelectedCategoryFilter(value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCategoryFilter === value
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Quick Filter Pills Under Search (Chai, EV Charge, Washroom, Empty) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
          <button
            onClick={() => setQuickFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition backdrop-blur-md shadow-md ${
              quickFilter === 'all'
                ? 'bg-white text-slate-950 font-bold'
                : 'bg-slate-900/80 text-slate-300 border border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setQuickFilter(quickFilter === 'chai' ? 'all' : 'chai')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition backdrop-blur-md shadow-md flex items-center gap-1.5 ${
              quickFilter === 'chai'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-900/80 text-slate-300 border border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span>☕</span>
            <span>Chai</span>
          </button>

          <button
            onClick={() => setQuickFilter(quickFilter === 'ev' ? 'all' : 'ev')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition backdrop-blur-md shadow-md flex items-center gap-1.5 ${
              quickFilter === 'ev'
                ? 'bg-blue-400 text-slate-950 font-bold'
                : 'bg-slate-900/80 text-slate-300 border border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span>⛽</span>
            <span>EV Charge</span>
          </button>

          <button
            onClick={() => setQuickFilter(quickFilter === 'washroom' ? 'all' : 'washroom')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition backdrop-blur-md shadow-md flex items-center gap-1.5 ${
              quickFilter === 'washroom'
                ? 'bg-purple-400 text-slate-950 font-bold'
                : 'bg-slate-900/80 text-slate-300 border border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span>🚻</span>
            <span>Washroom</span>
          </button>

          <button
            onClick={() => setQuickFilter(quickFilter === 'empty' ? 'all' : 'empty')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition backdrop-blur-md shadow-md flex items-center gap-1.5 ${
              quickFilter === 'empty'
                ? 'bg-emerald-400 text-slate-950 font-bold'
                : 'bg-slate-900/80 text-slate-300 border border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Empty Only</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          ACTIVE ROUTE NAVIGATION HUD BANNER (When START ROUTE clicked)
         ======================================================== */}
      {isNavigating && selectedHubCard && (
        <div className="absolute top-28 left-4 right-4 sm:left-6 sm:w-[460px] z-30 animate-fadeIn pointer-events-auto">
          <div className="bg-amber-400 text-slate-950 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-sm">
                ▲
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                  Live Route Active • {selectedHubCard.distanceKm * 1000}m
                </p>
                <p className="text-xs font-extrabold leading-tight">
                  Heading to {selectedHubCard.name} • Straight on NH-48 Express
                </p>
              </div>
            </div>

            <button
              onClick={handleStopRoute}
              className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-950 text-white hover:bg-slate-800 transition"
            >
              End Route
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MAP CANVAS (LEAFLET DOM)
         ======================================================== */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating GPS Recenter & Movement simulation */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white hover:text-emerald-400 border border-slate-700/80 shadow-xl transition flex items-center justify-center"
          title="Recenter to My Location"
        >
          <Navigation className="w-4 h-4 text-emerald-400" />
        </button>

        <button
          onClick={handleSimulateMove}
          className={`p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md text-slate-300 hover:text-amber-400 border border-slate-700/80 shadow-xl transition flex items-center justify-center ${
            isSimulatingLocation ? 'animate-spin text-amber-400' : ''
          }`}
          title="Simulate GPS movement"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* ========================================================
          BOTTOM FLOATING HUB CARD (MATCHING USER WIREFRAME & MOCKUP)
         ======================================================== */}
      {selectedHubCard && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:w-[440px] z-30 animate-fadeIn pointer-events-auto">
          <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200">
            
            {/* Top row: Hub Name & Bookmark icon */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold font-outfit text-slate-950">
                  {selectedHubCard.name}
                </h3>
                
                {/* Status Badge & Distance row */}
                <div className="flex items-center space-x-3 mt-1.5">
                  
                  {/* Traffic Light Crowding Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${
                    selectedHubCard.crowdingStatus === 'EMPTY'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : selectedHubCard.crowdingStatus === 'CROWDED'
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedHubCard.crowdingStatus === 'EMPTY' ? 'bg-emerald-500 animate-pulse' :
                      selectedHubCard.crowdingStatus === 'CROWDED' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}></span>
                    {selectedHubCard.crowdingStatus || 'EMPTY'}
                  </span>

                  {/* Distance */}
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                    <span>🚶</span>
                    <span>{selectedHubCard.distanceKm * 1000}m away</span>
                  </span>
                </div>
              </div>

              {/* Bookmark Button */}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-xl transition ${
                  isBookmarked 
                    ? 'text-amber-500 bg-amber-50' 
                    : 'text-slate-400 hover:text-slate-700 bg-slate-50'
                }`}
                title="Save Hub"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>
            </div>

            {/* Amenity Pills matching mockup (Free Charging, Chilled Water, Chai, etc.) */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center space-x-2 bg-slate-100/90 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">Free Charging</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-100/90 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800">
                <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="truncate">Chilled Water</span>
              </div>
            </div>

            {/* Secondary actions (Hub Details / Apply for shift) */}
            <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                ★ {selectedHubCard.rating} ({selectedHubCard.reviewsCount} reviews)
              </span>
              <button 
                onClick={() => onSelectHub(selectedHubCard)}
                className="text-emerald-700 font-bold hover:underline"
              >
                View Hub Details & Ratings →
              </button>
            </div>

            {/* BIG PROMINENT YELLOW CTA BUTTON (MATCHING WIREFRAME & MOCKUP) */}
            <div className="mt-4">
              <button
                onClick={() => handleStartRoute(selectedHubCard)}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-400/30 transition"
              >
                <span className="text-base font-black">▲</span>
                <span>START ROUTE</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
