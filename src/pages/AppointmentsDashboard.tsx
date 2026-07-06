import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, Scissors, AlertCircle, Trash2, CalendarX, 
  CheckCircle, PlusCircle, UserCheck, Sparkles, Smile, MessageSquare, AlertTriangle 
} from 'lucide-react';
import { beautyService } from '../lib/client';
import { Appointment, Hairstyle, Stylist, INITIAL_HAIRSTYLES, INITIAL_STYLISTS } from '../data/mockData';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import SEO from '../components/SEO';

interface AppointmentsDashboardProps {
  user: any;
  onLoginSuccess: (user: any) => void;
}

export default function AppointmentsDashboard({ user, onLoginSuccess }: AppointmentsDashboardProps) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  
  // Auth view toggles if not logged in
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Load resources
  useEffect(() => {
    async function loadData() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [appRes, stylesRes, stylistsRes] = await Promise.all([
          beautyService.getAppointments(user.email),
          beautyService.getHairstyles(),
          beautyService.getStylists()
        ]);
        setAppointments(appRes);
        setHairstyles(stylesRes);
        setStylists(stylistsRes);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleCancelAppointment = async (id: string) => {
    if (!user) return;
    if (!window.confirm('Are you absolutely certain you want to cancel this scheduled styling session?')) {
      return;
    }

    setCancellingId(id);
    try {
      const ok = await beautyService.updateAppointmentStatus(id, 'cancelled', user.email);
      if (ok) {
        // Refresh appointment state locally
        setAppointments(prev => prev.map(app => {
          if (app.id === id) {
            return { ...app, status: 'cancelled' };
          }
          return app;
        }));
      }
    } catch (e) {
      console.error('Failed to cancel appointment', e);
    } finally {
      setCancellingId(null);
    }
  };

  const handleCompleteAppointment = async (id: string) => {
    if (!user) return;
    setCompletingId(id);
    try {
      const ok = await beautyService.updateAppointmentStatus(id, 'completed', user.email);
      if (ok) {
        // Refresh appointment state locally
        setAppointments(prev => prev.map(app => {
          if (app.id === id) {
            return { ...app, status: 'completed' };
          }
          return app;
        }));
      }
    } catch (e) {
      console.error('Failed to complete appointment', e);
    } finally {
      setCompletingId(null);
    }
  };

  // Match helpers
  const getStyleName = (id: string) => {
    const style = hairstyles.find(h => h.id === id) || INITIAL_HAIRSTYLES.find(h => h.id === id);
    return style ? style.name : 'Salon Specialty Service';
  };

  const getStyleImage = (id: string) => {
    const style = hairstyles.find(h => h.id === id) || INITIAL_HAIRSTYLES.find(h => h.id === id);
    return style ? style.image : 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=200';
  };

  const getStylistName = (id: string) => {
    const stylist = stylists.find(s => s.id === id) || INITIAL_STYLISTS.find(s => s.id === id);
    return stylist ? stylist.name : 'Master Stylist';
  };

  // Loyalty Program calculation: 100 bonus starter points + 1 point per $1 spent on completed appointments
  const completedAppointments = appointments.filter(app => app.status === 'completed');
  const points = 100 + completedAppointments.reduce((acc, app) => acc + Math.round(app.priceAtBooking), 0);

  let tierName = 'Bronze';
  let nextTierName = 'Silver';
  let nextTierPoints = 180;

  if (points >= 500) {
    tierName = 'Diamond VIP';
    nextTierName = 'Max Tier';
    nextTierPoints = 500;
  } else if (points >= 300) {
    tierName = 'Gold Elite';
    nextTierName = 'Diamond VIP';
    nextTierPoints = 500;
  } else if (points >= 180) {
    tierName = 'Silver';
    nextTierName = 'Gold Elite';
    nextTierPoints = 300;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <SEO 
          title="Sign In / Join Portfolio"
          description="Log in or create an account to access your personalized hair booking calendar, save favorite stylists, and track appointment histories."
          schemaType="Website"
        />
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gold-200/20">
          <div className="flex border-b border-gold-100">
            <button
              onClick={() => setAuthTab('login')}
              className={`w-1/2 py-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                authTab === 'login' ? 'bg-cream text-gold-600 border-b-2 border-gold-400' : 'text-charcoal/40 hover:bg-cream/30'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthTab('register')}
              className={`w-1/2 py-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                authTab === 'register' ? 'bg-cream text-gold-600 border-b-2 border-gold-400' : 'text-charcoal/40 hover:bg-cream/30'
              }`}
            >
              Create Profile
            </button>
          </div>
          <div className="p-6">
            <p className="text-xs text-charcoal/60 text-center mb-6 leading-relaxed">
              To schedule appointments and view your active booking portfolio in real-time, please sign in or create an account.
            </p>
            {authTab === 'login' ? (
              <LoginForm onSuccess={onLoginSuccess} />
            ) : (
              <RegisterForm onSuccess={onLoginSuccess} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEO 
        title="Your Appointments Portfolio"
        description="View, manage, and book your custom hair styling reservations at Apex Beauty Salon."
        schemaType="Website"
      />
      {/* Top Banner and Loyalty Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Banner */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-white p-6 sm:p-8 rounded-3xl border border-gold-200/20 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-gold-500" />
              <span className="text-xs uppercase tracking-widest font-bold text-gold-500">Guest Profile</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal">
              Welcome back, {user.metadata?.name || user.email.split('@')[0]}
            </h1>
            <p className="text-xs text-charcoal/60 font-medium max-w-xl leading-relaxed">
              Manage your luxury hair styling session portfolio, review stylist notes, and track your Elite rewards.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/book"
              className="bg-charcoal text-gold-300 hover:bg-gold-500 hover:text-charcoal px-6 py-3 rounded-full font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book New Session</span>
            </Link>
          </div>
        </div>

        {/* Loyalty Program Display Card */}
        <div className="bg-charcoal text-white p-6 sm:p-8 rounded-3xl border border-gold-500/20 shadow-lg flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-gold-400 font-bold uppercase tracking-widest text-[10px]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Apex Elite Rewards</span>
              </div>
              <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                points >= 500 ? 'bg-amber-400 text-charcoal' :
                points >= 300 ? 'bg-gold-500 text-charcoal' :
                points >= 180 ? 'bg-zinc-300 text-charcoal' :
                'bg-amber-700 text-white'
              }`}>
                {tierName} Member
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-gold-400">{points}</span>
              <span className="text-xs text-zinc-400 font-medium">Loyalty Points</span>
            </div>

            {/* Progress Bar towards Next Tier or Blowout reward */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                <span>{points < 500 ? `Next Tier: ${nextTierName}` : 'Max Tier Reached!'}</span>
                <span>{points < 500 ? `${points}/${nextTierPoints} pts` : `${points} pts`}</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gold-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (points / nextTierPoints) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-zinc-400 mt-6 pt-3 border-t border-zinc-800 leading-relaxed relative z-10">
            <span className="font-semibold text-gold-400 block mb-1">Loyalty Lounge Rules:</span>
            Earn 1 point per $1 spent on completed appointments + 100 bonus sign-up points. Unlock a <strong className="text-white font-semibold">Free Signature Botanical Blowout</strong> at 300 points!
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-semibold text-charcoal/60">Fetching your appointment dossier...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gold-200/25 p-12 text-center max-w-lg mx-auto shadow-sm">
          <CalendarX className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-lg text-charcoal">No Active Appointments</h2>
          <p className="text-xs text-charcoal/60 mt-1.5 leading-relaxed">
            You don't have any appointments scheduled yet. Select your hair style, match with an elite stylist, and register your secure slot today!
          </p>
          <div className="mt-6">
            <Link
              to="/book"
              className="bg-cream border border-charcoal/10 hover:bg-charcoal hover:text-gold-300 py-3 px-6 rounded-full text-xs uppercase tracking-widest font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
            >
              <Scissors className="w-4 h-4" />
              <span>Browse Styling Menu</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Appointment Cards Grid */
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-lg text-charcoal border-b border-gold-200/20 pb-2">
            Your Appointments Portfolio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((app) => {
              const isUpcoming = app.status === 'upcoming';
              const isCancelled = app.status === 'cancelled';
              const isCompleted = app.status === 'completed';

              return (
                <div
                  key={app.id}
                  className={`bg-white rounded-3xl overflow-hidden border border-gold-200/25 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all ${
                    isCancelled ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={getStyleImage(app.serviceId)}
                      alt="Service"
                      className="w-16 h-16 object-cover rounded-xl border border-gold-200/40 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-display font-bold text-sm text-charcoal truncate">
                          {getStyleName(app.serviceId)}
                        </h3>
                        <span
                          className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                            isUpcoming ? 'bg-green-50 text-green-700 border border-green-200/30' :
                            isCancelled ? 'bg-red-50 text-red-600 border border-red-200/30' :
                            'bg-gold-100 text-gold-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-charcoal/60 space-y-1 pt-1.5">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Scissors className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span>Stylist: <strong className="text-charcoal/80">{getStylistName(app.stylistId)}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span>Date: <strong className="text-charcoal/80">{app.date}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span>Time: <strong className="text-charcoal/80">{app.time}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action overlay */}
                  <div className="mt-6 pt-4 border-t border-gold-100/50 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-charcoal/40 block uppercase tracking-wider font-bold">Session Cost</span>
                      <span className="font-display font-extrabold text-sm text-gold-600">${app.priceAtBooking}</span>
                    </div>

                    {isUpcoming && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCompleteAppointment(app.id)}
                          disabled={completingId === app.id || cancellingId === app.id}
                          className="bg-cream border border-gold-300 hover:bg-gold-500 hover:text-charcoal px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold text-gold-700 transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Simulate service completion to earn loyalty points"
                        >
                          {completingId === app.id ? (
                            <div className="w-3 h-3 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Complete</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleCancelAppointment(app.id)}
                          disabled={cancellingId === app.id || completingId === app.id}
                          className="p-2 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-full transition-all flex items-center justify-center cursor-pointer"
                          title="Cancel Appointment"
                        >
                          {cancellingId === app.id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4.5 h-4.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {isCancelled && (
                      <div className="flex items-center gap-1 text-[10px] text-red-500 font-semibold uppercase tracking-wider">
                        <CalendarX className="w-3.5 h-3.5" />
                        <span>Cancelled</span>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="flex items-center gap-1 text-[10px] text-gold-600 font-semibold uppercase tracking-wider">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
