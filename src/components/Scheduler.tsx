import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Scissors, User as UserIcon, Calendar as CalIcon, Clock, Sparkles, Check, 
  ArrowLeft, ArrowRight, NotebookText, HelpCircle, AlertCircle, Sparkle 
} from 'lucide-react';
import { beautyService } from '../lib/client';
import { Hairstyle, Stylist, TIME_SLOTS } from '../data/mockData';
import SEO from './SEO';

interface SchedulerProps {
  user: any;
  onBookingSuccess: () => void;
}

export default function Scheduler({ user, onBookingSuccess }: SchedulerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Load styles and stylists
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Wizard Steps: 1 = Style, 2 = Stylist, 3 = Date/Time, 4 = Details, 5 = Confirm
  const [step, setStep] = useState(1);

  // Selected State
  const [selectedStyle, setSelectedStyle] = useState<Hairstyle | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Execution State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic Date List (next 14 days)
  const [availableDates, setAvailableDates] = useState<{ dayName: string; dateStr: string; dayNum: number; monthStr: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [stylesRes, stylistsRes] = await Promise.all([
          beautyService.getHairstyles(),
          beautyService.getStylists()
        ]);
        setHairstyles(stylesRes);
        setStylists(stylistsRes);

        // Handle pre-selected states via state/location
        const state = location.state as any;
        if (state) {
          if (state.styleId) {
            const foundStyle = stylesRes.find(s => s.id === state.styleId);
            if (foundStyle) setSelectedStyle(foundStyle);
          }
          if (state.stylistId) {
            const foundStylist = stylistsRes.find(s => s.id === state.stylistId);
            if (foundStylist) setSelectedStylist(foundStylist);
          }
          if (state.startStep) {
            setStep(state.startStep);
          }
        }
      } catch (e) {
        console.error('Failed to load scheduler resources', e);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();

    // Generate next 14 days of calendar
    const dates = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      
      // Skip Sundays (salon closed)
      if (nextDate.getDay() === 0) continue;

      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');

      dates.push({
        dayName: days[nextDate.getDay()],
        dateStr: `${yyyy}-${mm}-${dd}`,
        dayNum: nextDate.getDate(),
        monthStr: months[nextDate.getMonth()]
      });
    }
    setAvailableDates(dates);
  }, [location]);

  // Autofill if logged in
  useEffect(() => {
    if (user) {
      setClientName(user.metadata?.name || user.email.split('@')[0]);
      setClientEmail(user.email);
    }
  }, [user]);

  const handleNext = () => {
    if (step === 1 && !selectedStyle) {
      setErrorMsg('Please select a hairstyle to proceed.');
      return;
    }
    if (step === 2 && !selectedStylist) {
      setErrorMsg('Please select your expert stylist to proceed.');
      return;
    }
    if (step === 3 && (!selectedDate || !selectedTime)) {
      setErrorMsg('Please choose an available date and time slot.');
      return;
    }
    if (step === 4 && (!clientName || !clientEmail)) {
      setErrorMsg('Name and Email are required.');
      return;
    }

    setErrorMsg(null);
    setStep(step + 1);
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setStep(step - 1);
  };

  const handleBookNow = async () => {
    if (!selectedStyle || !selectedStylist || !selectedDate || !selectedTime || !clientName || !clientEmail) {
      setErrorMsg('Missing key scheduling parameters. Please verify steps.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await beautyService.createAppointment({
        serviceId: selectedStyle.id,
        stylistId: selectedStylist.id,
        date: selectedDate,
        time: selectedTime,
        customerName: clientName,
        customerEmail: clientEmail,
        customerPhone: clientPhone,
        notes: notes,
        status: 'upcoming',
        priceAtBooking: selectedStyle.price
      });

      // Show success
      onBookingSuccess();
      navigate('/appointments');
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-charcoal/70">Assembling portfolio stylists &amp; pricing catalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gold-200/30 overflow-hidden">
      <SEO 
        title="Schedule Hair Appointment | Online Booking Portal"
        description="Schedule your luxury hair styling session, French balayage, or deep cellular botanical spa with our elite master stylists. Real-time availability booking."
        keywords="book hair salon New York, schedule balayage appointment, hair cut reservation, luxury salon booking online"
        schemaType="Website"
      />
      {/* Header Progress Bar */}
      <div className="bg-charcoal px-6 py-4 flex justify-between items-center text-white">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-gold-400 block font-bold">Step {step} of 5</span>
          <h2 className="font-display font-bold text-lg">
            {step === 1 && 'Select Hair Style & Service'}
            {step === 2 && 'Select Stylist'}
            {step === 3 && 'Choose Date & Time Slot'}
            {step === 4 && 'Customer Contact Profile'}
            {step === 5 && 'Verify & Finalize Booking'}
          </h2>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s} 
              className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-gold-400' : 'bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 min-h-[400px]">
        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs flex items-start gap-2.5 mb-6 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: SELECT STYLE */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-sm text-charcoal/70 leading-relaxed">
              Explore our pristine selection of precision haircuts, advanced multi-dimensional color treatments, organic smoothing processes, and luxurious botanical hair spa experiences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hairstyles.map((style) => {
                const isSel = selectedStyle?.id === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => {
                      setSelectedStyle(style);
                      setErrorMsg(null);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 ${
                      isSel 
                        ? 'border-gold-500 bg-gold-100/30 shadow-md' 
                        : 'border-gold-200/40 hover:border-gold-300 bg-cream/30'
                    }`}
                  >
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-20 h-20 object-cover rounded-xl shrink-0"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="inline-block text-[9px] uppercase tracking-wider font-semibold text-gold-600 bg-gold-100 px-2 py-0.5 rounded">
                        {style.category}
                      </span>
                      <h3 className="font-display font-bold text-sm text-charcoal truncate">{style.name}</h3>
                      <p className="text-[11px] text-charcoal/60 line-clamp-2 leading-relaxed">{style.description}</p>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs font-semibold text-charcoal/80">{style.duration}</span>
                        <span className="font-display font-extrabold text-base text-gold-600">${style.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT STYLIST */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-gold-100/40 p-4 rounded-2xl border border-gold-200/30">
              <Sparkles className="w-5 h-5 text-gold-500 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold block text-gold-800">Selected Service:</span>
                <span className="text-charcoal/80">{selectedStyle?.name} — </span>
                <span className="font-extrabold text-gold-600">${selectedStyle?.price}</span>
              </div>
            </div>

            <p className="text-sm text-charcoal/70 leading-relaxed">
              Match with our Beverly Hills trained master craftsmen and specialists. Each artist features custom specialties and a full client showcase.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stylists.map((stylist) => {
                const isSel = selectedStylist?.id === stylist.id;
                return (
                  <div
                    key={stylist.id}
                    onClick={() => {
                      setSelectedStylist(stylist);
                      setErrorMsg(null);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                      isSel 
                        ? 'border-gold-500 bg-gold-100/30 shadow-md' 
                        : 'border-gold-200/40 hover:border-gold-300 bg-cream/30'
                    }`}
                  >
                    <img
                      src={stylist.avatar}
                      alt={stylist.name}
                      className="w-20 h-20 object-cover rounded-full border-2 border-gold-300 mb-3.5"
                    />
                    <h3 className="font-display font-bold text-sm text-charcoal">{stylist.name}</h3>
                    <p className="text-[11px] text-gold-600 font-medium mb-2">{stylist.role}</p>
                    <p className="text-[10px] text-charcoal/60 line-clamp-3 leading-relaxed mb-4">
                      {stylist.bio}
                    </p>
                    
                    <div className="mt-auto w-full pt-3 border-t border-gold-200/20 flex justify-between items-center text-[11px] text-charcoal/70 font-medium">
                      <span>Exp: {stylist.experience}</span>
                      <span className="text-gold-600 font-bold">★ {stylist.rating}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: SELECT DATE & TIME */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between gap-4 p-4 rounded-2xl bg-gold-100/40 border border-gold-200/30 text-xs">
              <div>
                <span className="font-semibold text-gold-800 block">Service Style:</span>
                <span className="text-charcoal/80">{selectedStyle?.name}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gold-800 block">Master Stylist:</span>
                <span className="text-charcoal/80">{selectedStylist?.name}</span>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal/70 mb-3 flex items-center gap-1.5">
                <CalIcon className="w-4 h-4 text-gold-400" />
                <span>Select Appointment Date</span>
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {availableDates.map((d) => {
                  const isSel = selectedDate === d.dateStr;
                  return (
                    <button
                      key={d.dateStr}
                      onClick={() => {
                        setSelectedDate(d.dateStr);
                        setErrorMsg(null);
                      }}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 min-w-[70px] shrink-0 transition-all ${
                        isSel 
                          ? 'border-gold-500 bg-gold-500 text-white shadow-md' 
                          : 'border-gold-200/30 bg-cream/30 hover:border-gold-300'
                      }`}
                    >
                      <span className={`text-[10px] uppercase tracking-wider ${isSel ? 'text-white/80' : 'text-charcoal/50'}`}>
                        {d.dayName}
                      </span>
                      <span className="font-display font-extrabold text-lg my-0.5">
                        {d.dayNum}
                      </span>
                      <span className={`text-[10px] ${isSel ? 'text-white/80' : 'text-charcoal/60'}`}>
                        {d.monthStr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            {selectedDate && (
              <div className="pt-2">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal/70 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gold-400" />
                  <span>Select Time Slot</span>
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {TIME_SLOTS.map((t) => {
                    const isSel = selectedTime === t;
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          setSelectedTime(t);
                          setErrorMsg(null);
                        }}
                        className={`py-3 px-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                          isSel 
                            ? 'border-gold-500 bg-charcoal text-gold-300 shadow-md' 
                            : 'border-gold-200/40 bg-cream/30 hover:border-gold-300 text-charcoal/80'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: CONTACT & DETAILS */}
        {step === 4 && (
          <div className="space-y-6">
            <p className="text-sm text-charcoal/70 leading-relaxed">
              We need a few contact details to secure your reservation. If you are signed in, this profile is synchronized automatically.
            </p>

            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/70 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-charcoal/40 pointer-events-none">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full bg-cream/50 text-charcoal pl-10 pr-4 py-3 rounded-xl text-sm border border-gold-200/30 focus:outline-none focus:border-gold-400 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/70 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-charcoal/40 pointer-events-none">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-cream/50 text-charcoal pl-10 pr-4 py-3 rounded-xl text-sm border border-gold-200/30 focus:outline-none focus:border-gold-400 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/70 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+1 (310) 555-0100"
                  className="w-full bg-cream/50 text-charcoal px-4 py-3 rounded-xl text-sm border border-gold-200/30 focus:outline-none focus:border-gold-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/70 mb-1.5">
                  Special Notes / Styling Requests
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., hair length details, specific coloring notes, or scalp sensitivities."
                  className="w-full bg-cream/50 text-charcoal px-4 py-3 rounded-xl text-sm border border-gold-200/30 focus:outline-none focus:border-gold-400 focus:bg-white min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: VERIFY & FINALIZE */}
        {step === 5 && (
          <div className="space-y-6">
            <p className="text-sm text-charcoal/70 leading-relaxed">
              Please review your luxury scheduling details. Click "Finalize Booking" to record your appointment. No pre-payment is required.
            </p>

            <div className="bg-cream/40 border border-gold-200/50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
              <div className="space-y-4">
                <h3 className="font-display font-extrabold text-sm text-gold-800 uppercase tracking-wider border-b border-gold-200/20 pb-2">
                  Service &amp; Styling Details
                </h3>
                
                <div className="flex gap-4">
                  <img
                    src={selectedStyle?.image}
                    alt={selectedStyle?.name}
                    className="w-16 h-16 object-cover rounded-xl border border-gold-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-charcoal">{selectedStyle?.name}</h4>
                    <p className="text-[11px] text-charcoal/60 mt-0.5">{selectedStyle?.duration} treatment</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Expert Stylist:</span>
                    <span className="font-bold text-charcoal">{selectedStylist?.name}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Appointment Date:</span>
                    <span className="font-bold text-charcoal">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Assigned Time:</span>
                    <span className="font-bold text-charcoal">{selectedTime}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-display font-extrabold text-sm text-gold-800 uppercase tracking-wider border-b border-gold-200/20 pb-2">
                  Client Contact Profile
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-charcoal/50 block">Name</span>
                    <span className="font-bold text-charcoal text-sm">{clientName}</span>
                  </div>
                  <div>
                    <span className="text-charcoal/50 block">Email Address</span>
                    <span className="font-bold text-charcoal">{clientEmail}</span>
                  </div>
                  {clientPhone && (
                    <div>
                      <span className="text-charcoal/50 block">Phone Number</span>
                      <span className="font-bold text-charcoal">{clientPhone}</span>
                    </div>
                  )}
                  {notes && (
                    <div>
                      <span className="text-charcoal/50 block">Special Styling Notes</span>
                      <p className="text-charcoal/70 leading-relaxed italic bg-white/40 p-2 rounded-lg border border-gold-200/20 mt-1">
                        "{notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Receipt */}
            <div className="bg-charcoal text-white rounded-2xl p-5 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest block">Total Estimated Cost</span>
                <span className="text-xs text-white/60">Pay at the salon after your styling session</span>
              </div>
              <div className="font-display font-extrabold text-3xl text-gold-300">
                ${selectedStyle?.price}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="bg-cream/50 px-6 py-5 border-t border-gold-200/20 flex justify-between items-center">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-charcoal/70 hover:text-charcoal py-2 px-4 rounded-lg hover:bg-gold-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold bg-charcoal text-gold-300 hover:bg-gold-500 hover:text-charcoal py-2.5 px-6 rounded-full transition-colors shadow-sm ml-auto cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleBookNow}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold bg-gold-400 text-charcoal hover:bg-gold-500 disabled:opacity-50 py-3 px-8 rounded-full transition-all shadow-md ml-auto cursor-pointer"
          >
            {isSubmitting ? (
              <span>Scheduling...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Finalize Booking</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
