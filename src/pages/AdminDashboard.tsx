import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scissors, User, Calendar, Plus, Trash2, Edit2, Check, X, 
  DollarSign, Clock, LayoutGrid, Award, Settings, ShieldAlert, Sparkles, AlertCircle 
} from 'lucide-react';
import { beautyService } from '../lib/client';
import { Hairstyle, Stylist, Appointment } from '../data/mockData';
import SEO from '../components/SEO';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'appointments' | 'hairstyles' | 'stylists'>('appointments');
  
  // Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Management States
  const [styleForm, setStyleForm] = useState<Omit<Hairstyle, 'id'> & { id?: string }>({
    name: '',
    category: 'Cuts',
    price: 0,
    duration: '',
    description: '',
    image: '',
    features: []
  });
  
  const [stylistForm, setStylistForm] = useState<Omit<Stylist, 'id'> & { id?: string }>({
    name: '',
    role: '',
    experience: '',
    rating: 5.0,
    reviewCount: 0,
    bio: '',
    avatar: '',
    portfolio: [],
    specialties: []
  });

  const [featureInput, setFeatureInput] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [portfolioInput, setPortfolioInput] = useState('');
  
  const [editingStyleId, setEditingStyleId] = useState<string | null>(null);
  const [editingStylistId, setEditingStylistId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Check admin authorization
  const currentUser = beautyService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    loadAdminData();
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [appRes, stylesRes, stylistsRes] = await Promise.all([
        beautyService.adminGetAppointments(),
        beautyService.getHairstyles(),
        beautyService.getStylists()
      ]);
      setAppointments(appRes);
      setHairstyles(stylesRes);
      setStylists(stylistsRes);
    } catch (e) {
      console.error('Failed to load admin dataset', e);
      setErrorMsg('Failed to query administrative resources.');
    } finally {
      setLoading(false);
    }
  };

  // Appointment Status Modification
  const handleUpdateStatus = async (id: string, status: 'cancelled' | 'upcoming' | 'completed') => {
    try {
      const ok = await beautyService.updateAppointmentStatus(id, status, currentUser?.email || '');
      if (ok) {
        setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
      }
    } catch (e) {
      console.error('Status update failed', e);
    }
  };

  // Hairstyle CRUD
  const handleSaveStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!styleForm.name || !styleForm.price) {
      setErrorMsg('Name and price are required.');
      return;
    }

    try {
      if (editingStyleId) {
        await beautyService.updateHairstyle(editingStyleId, styleForm);
        setHairstyles(prev => prev.map(h => h.id === editingStyleId ? { ...h, ...styleForm } : h));
      } else {
        const added = await beautyService.createHairstyle(styleForm);
        setHairstyles(prev => [...prev, added]);
      }
      resetStyleForm();
    } catch (err) {
      setErrorMsg('Failed to save hairstyle.');
    }
  };

  const handleEditStyle = (style: Hairstyle) => {
    setEditingStyleId(style.id);
    setStyleForm({
      name: style.name,
      category: style.category,
      price: style.price,
      duration: style.duration,
      description: style.description,
      image: style.image,
      features: style.features
    });
    setIsFormOpen(true);
  };

  const handleDeleteStyle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hairstyle?')) return;
    try {
      await beautyService.deleteHairstyle(id);
      setHairstyles(prev => prev.filter(h => h.id !== id));
    } catch (e) {
      setErrorMsg('Failed to remove hairstyle.');
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setStyleForm(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setStyleForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const resetStyleForm = () => {
    setStyleForm({
      name: '',
      category: 'Cuts',
      price: 0,
      duration: '',
      description: '',
      image: '',
      features: []
    });
    setEditingStyleId(null);
    setIsFormOpen(false);
  };

  // Stylist CRUD
  const handleSaveStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stylistForm.name || !stylistForm.role) {
      setErrorMsg('Name and role are required.');
      return;
    }

    try {
      if (editingStylistId) {
        await beautyService.updateStylist(editingStylistId, stylistForm);
        setStylists(prev => prev.map(s => s.id === editingStylistId ? { ...s, ...stylistForm } : s));
      } else {
        const added = await beautyService.createStylist(stylistForm);
        setStylists(prev => [...prev, added]);
      }
      resetStylistForm();
    } catch (err) {
      setErrorMsg('Failed to save stylist portfolio.');
    }
  };

  const handleEditStylist = (stylist: Stylist) => {
    setEditingStylistId(stylist.id);
    setStylistForm({
      name: stylist.name,
      role: stylist.role,
      experience: stylist.experience,
      rating: stylist.rating,
      reviewCount: stylist.reviewCount,
      bio: stylist.bio,
      avatar: stylist.avatar,
      portfolio: stylist.portfolio,
      specialties: stylist.specialties
    });
    setIsFormOpen(true);
  };

  const handleDeleteStylist = async (id: string) => {
    if (!confirm('Are you sure you want to remove this stylist profile?')) return;
    try {
      await beautyService.deleteStylist(id);
      setStylists(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      setErrorMsg('Failed to delete stylist profile.');
    }
  };

  const addSpecialty = () => {
    if (!specialtyInput.trim()) return;
    setStylistForm(prev => ({ ...prev, specialties: [...prev.specialties, specialtyInput.trim()] }));
    setSpecialtyInput('');
  };

  const removeSpecialty = (idx: number) => {
    setStylistForm(prev => ({ ...prev, specialties: prev.specialties.filter((_, i) => i !== idx) }));
  };

  const addPortfolioUrl = () => {
    if (!portfolioInput.trim()) return;
    setStylistForm(prev => ({ ...prev, portfolio: [...prev.portfolio, portfolioInput.trim()] }));
    setPortfolioInput('');
  };

  const removePortfolioUrl = (idx: number) => {
    setStylistForm(prev => ({ ...prev, portfolio: prev.portfolio.filter((_, i) => i !== idx) }));
  };

  const resetStylistForm = () => {
    setStylistForm({
      name: '',
      role: '',
      experience: '',
      rating: 5.0,
      reviewCount: 0,
      bio: '',
      avatar: '',
      portfolio: [],
      specialties: []
    });
    setEditingStylistId(null);
    setIsFormOpen(false);
  };

  // Interactive Admin login helper for demo environments
  const handleAutoLoginAdmin = async () => {
    setLoading(true);
    try {
      await beautyService.login('admin@apexkit.io', 'password');
      window.location.reload();
    } catch (e) {
      setErrorMsg('Administrative simulation trigger failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <SEO title="Admin Authorization Required" description="Administrative panel permission check." />
        <div className="bg-white rounded-3xl p-8 border border-gold-200 shadow-xl space-y-6">
          <ShieldAlert className="w-16 h-16 text-gold-500 mx-auto animate-bounce" />
          <h2 className="font-display font-extrabold text-xl text-charcoal">Admin Access Required</h2>
          <p className="text-xs text-charcoal/65 leading-relaxed">
            You do not currently possess admin rights to modify catalog entries or view comprehensive guest books.
          </p>
          <div className="bg-cream p-4 rounded-2xl border border-gold-200/50 text-left text-xs space-y-2">
            <span className="font-bold text-gold-800 block">✨ Sandbox Simulator Pass:</span>
            <p className="text-charcoal/70">
              Click the button below to sign in instantly with seeded administrative credentials.
            </p>
          </div>
          <button
            onClick={handleAutoLoginAdmin}
            className="w-full bg-charcoal text-gold-300 hover:bg-gold-500 hover:text-charcoal py-3 rounded-xl text-xs uppercase tracking-widest font-extrabold transition-all duration-300 shadow-md cursor-pointer"
          >
            Authenticate as Admin
          </button>
        </div>
      </div>
    );
  }

  // Statistics summaries
  const totalRevenue = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.priceAtBooking, 0);

  const pendingBookings = appointments.filter(a => a.status === 'upcoming').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO title="Administrative Styling Lounge Control" description="Manage hairstyles catalog, master stylists portfolios, and appointments portfolio." />
      
      {/* Upper Title Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gold-200/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-gold-500 font-bold uppercase tracking-widest text-xs">
            <Settings className="w-4 h-4 animate-spin-slow" />
            <span>Apex Beauty Control Tower</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-charcoal mt-1">Salon Operations Lounge</h1>
        </div>

        {/* Action button to create items */}
        {activeTab !== 'appointments' && (
          <button
            onClick={() => {
              if (activeTab === 'hairstyles') resetStyleForm();
              if (activeTab === 'stylists') resetStylistForm();
              setIsFormOpen(true);
            }}
            className="bg-charcoal text-gold-300 hover:bg-gold-500 hover:text-charcoal px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab === 'hairstyles' ? 'Hairstyle' : 'Stylist'}</span>
          </button>
        )}
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gold-200/30 shadow-sm">
          <span className="text-[10px] text-charcoal/40 uppercase tracking-widest font-extrabold block">Total Bookings</span>
          <span className="text-2xl font-display font-black text-charcoal mt-1 block">{appointments.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gold-200/30 shadow-sm">
          <span className="text-[10px] text-amber-600 uppercase tracking-widest font-extrabold block">Pending Sessions</span>
          <span className="text-2xl font-display font-black text-amber-600 mt-1 block">{pendingBookings}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gold-200/30 shadow-sm">
          <span className="text-[10px] text-gold-600 uppercase tracking-widest font-extrabold block">Simulated Revenue</span>
          <span className="text-2xl font-display font-black text-gold-600 mt-1 block">${totalRevenue}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gold-200/30 shadow-sm">
          <span className="text-[10px] text-charcoal/40 uppercase tracking-widest font-extrabold block">Stylists Portfolio</span>
          <span className="text-2xl font-display font-black text-charcoal mt-1 block">{stylists.length} Experts</span>
        </div>
      </div>

      {/* Error display */}
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs flex items-center justify-between border border-red-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-700 font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Primary tab switcher */}
      <div className="flex border-b border-gold-200/20 gap-2">
        <button
          onClick={() => { setActiveTab('appointments'); setIsFormOpen(false); }}
          className={`py-3 px-6 text-xs uppercase tracking-widest font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'appointments' ? 'border-gold-500 text-gold-600' : 'border-transparent text-charcoal/50 hover:text-charcoal'
          }`}
        >
          Appointments Guestbook
        </button>
        <button
          onClick={() => { setActiveTab('hairstyles'); setIsFormOpen(false); }}
          className={`py-3 px-6 text-xs uppercase tracking-widest font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'hairstyles' ? 'border-gold-500 text-gold-600' : 'border-transparent text-charcoal/50 hover:text-charcoal'
          }`}
        >
          Styles Catalog
        </button>
        <button
          onClick={() => { setActiveTab('stylists'); setIsFormOpen(false); }}
          className={`py-3 px-6 text-xs uppercase tracking-widest font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'stylists' ? 'border-gold-500 text-gold-600' : 'border-transparent text-charcoal/50 hover:text-charcoal'
          }`}
        >
          Stylists List
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-semibold text-charcoal/60">Retrieving operational parameters...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-2xl border border-gold-200/20 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/55 text-charcoal/70 uppercase tracking-wider font-extrabold border-b border-gold-100">
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Service &amp; Price</th>
                      <th className="p-4">Date &amp; Slot</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((app) => (
                      <tr key={app.id} className="border-b border-gold-100/40 hover:bg-cream/10">
                        <td className="p-4">
                          <span className="font-bold text-charcoal block">{app.customerName}</span>
                          <span className="text-charcoal/60 block text-[11px]">{app.customerEmail}</span>
                          {app.customerPhone && <span className="text-charcoal/50 block text-[10px]">{app.customerPhone}</span>}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-charcoal block">
                            {hairstyles.find(h => h.id === app.serviceId)?.name || 'Custom Cut'}
                          </span>
                          <span className="text-gold-600 font-extrabold block text-[11px]">${app.priceAtBooking}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-charcoal block">{app.date}</span>
                          <span className="text-charcoal/60 text-[11px]">{app.time}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${
                            app.status === 'upcoming' ? 'bg-green-50 text-green-700 border border-green-200/40' :
                            app.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-200/40' :
                            'bg-gold-100 text-gold-800'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {app.status === 'upcoming' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(app.id, 'completed')}
                                  className="bg-gold-400 hover:bg-gold-500 text-charcoal px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer"
                                  title="Mark as completed"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app.id, 'cancelled')}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer"
                                  title="Cancel Appointment"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-charcoal/50 italic">
                          No appointments have been logged in the salon database yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HAIRSTYLES FORM/MODAL COMPONENT */}
          {activeTab === 'hairstyles' && isFormOpen && (
            <div className="bg-white p-6 rounded-2xl border border-gold-300 shadow-md space-y-4 max-w-2xl">
              <h3 className="font-display font-bold text-base text-charcoal">
                {editingStyleId ? 'Edit Hairstyle Portfolio Entry' : 'Create New Hairstyle Portfolio'}
              </h3>
              <form onSubmit={handleSaveStyle} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal/70 mb-1.5">Hairstyle Title</label>
                  <input
                    type="text"
                    value={styleForm.name}
                    onChange={e => setStyleForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200"
                    placeholder="E.g., Platinum Shag Cut"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal/70 mb-1.5">Pricing (USD)</label>
                  <input
                    type="number"
                    value={styleForm.price}
                    onChange={e => setStyleForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal/70 mb-1.5">Category</label>
                  <select
                    value={styleForm.category}
                    onChange={e => setStyleForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200"
                  >
                    <option>Cuts</option>
                    <option>Color &amp; Balayage</option>
                    <option>Styling &amp; Updos</option>
                    <option>Treatments &amp; Care</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-charcoal/70 mb-1.5">Treatment Duration</label>
                  <input
                    type="text"
                    value={styleForm.duration}
                    onChange={e => setStyleForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200"
                    placeholder="E.g., 90 mins"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold text-charcoal/70 mb-1.5">Image Asset URL</label>
                  <input
                    type="text"
                    value={styleForm.image}
                    onChange={e => setStyleForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold text-charcoal/70 mb-1.5">Description Summary</label>
                  <textarea
                    value={styleForm.description}
                    onChange={e => setStyleForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200 min-h-[80px]"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block font-bold text-charcoal/70">Signature Features (Bullet points)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={e => setFeatureInput(e.target.value)}
                      className="flex-1 bg-cream/40 p-2 rounded-lg border border-gold-200"
                      placeholder="E.g., Olaplex bond rebuilders included"
                    />
                    <button type="button" onClick={addFeature} className="bg-charcoal text-gold-300 px-4 py-2 rounded-lg font-bold uppercase cursor-pointer">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {styleForm.features.map((feat, i) => (
                      <span key={i} className="bg-gold-100/50 text-gold-800 text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                        <span>{feat}</span>
                        <X onClick={() => removeFeature(i)} className="w-3.5 h-3.5 cursor-pointer text-red-500 hover:scale-110" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-gold-100 flex justify-end gap-2">
                  <button type="button" onClick={resetStyleForm} className="border border-charcoal/20 px-4 py-2 rounded-lg font-bold uppercase cursor-pointer">Cancel</button>
                  <button type="submit" className="bg-charcoal text-gold-300 hover:bg-gold-500 hover:text-charcoal px-6 py-2 rounded-lg font-bold uppercase cursor-pointer">Save Style</button>
                </div>
              </form>
            </div>
          )}

          {/* STYLISTS FORM/MODAL COMPONENT */}
          {activeTab === 'stylists' && isFormOpen && (
            <div className="bg-white p-6 rounded-2xl border border-gold-300 shadow-md space-y-4 max-w-2xl">
              <h3 className="font-display font-bold text-base text-charcoal">
                {editingStylistId ? 'Edit Master Stylist Portfolio' : 'Register New Master Stylist'}
              </h3>
              <form onSubmit={handleSaveStylist} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal/70 mb-1.5">Stylist Full Name</label>
                  <input
                    type="text"
                    value={stylistForm.name}
                    onChange={e => setStylistForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200"
                    placeholder="E.g., Marcus Vance"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal/70 mb-1.5">Professional Role Title</label>
                  <input
                    type="text"
                    value={stylistForm.role}
                    onChange={e => setStylistForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200"
                    placeholder="E.g., Creative Director &amp; Color Sculptor"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal/70 mb-1.5">Experience Duration</label>
                  <input
                    type="text"
                    value={stylistForm.experience}
                    onChange={e => setStylistForm(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200"
                    placeholder="E.g., 9 years"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal/70 mb-1.5">Avatar Image URL</label>
                  <input
                    type="text"
                    value={stylistForm.avatar}
                    onChange={e => setStylistForm(prev => ({ ...prev, avatar: e.target.value }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold text-charcoal/70 mb-1.5">Stylist Biography</label>
                  <textarea
                    value={stylistForm.bio}
                    onChange={e => setStylistForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-cream/40 p-2.5 rounded-lg border border-gold-200 min-h-[80px]"
                  />
                </div>

                {/* Specialties */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block font-bold text-charcoal/70">Masteries &amp; Specialties</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={specialtyInput}
                      onChange={e => setSpecialtyInput(e.target.value)}
                      className="flex-1 bg-cream/40 p-2 rounded-lg border border-gold-200"
                      placeholder="E.g., French Balayage"
                    />
                    <button type="button" onClick={addSpecialty} className="bg-charcoal text-gold-300 px-4 py-2 rounded-lg font-bold uppercase cursor-pointer">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stylistForm.specialties.map((spec, i) => (
                      <span key={i} className="bg-gold-100/50 text-gold-800 text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                        <span>{spec}</span>
                        <X onClick={() => removeSpecialty(i)} className="w-3.5 h-3.5 cursor-pointer text-red-500 hover:scale-110" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portfolio Showcase URLs */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block font-bold text-charcoal/70">Portfolio / Lookbook Image Assets URLs</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={portfolioInput}
                      onChange={e => setPortfolioInput(e.target.value)}
                      className="flex-1 bg-cream/40 p-2 rounded-lg border border-gold-200"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <button type="button" onClick={addPortfolioUrl} className="bg-charcoal text-gold-300 px-4 py-2 rounded-lg font-bold uppercase cursor-pointer">Add</button>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 max-h-[120px] overflow-y-auto pt-1">
                    {stylistForm.portfolio.map((url, i) => (
                      <div key={i} className="flex justify-between items-center bg-cream/40 p-2 rounded-lg border border-gold-200">
                        <span className="truncate text-charcoal/70 font-mono text-[10px] max-w-sm">{url}</span>
                        <X onClick={() => removePortfolioUrl(i)} className="w-4 h-4 cursor-pointer text-red-500 hover:scale-110 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-gold-100 flex justify-end gap-2">
                  <button type="button" onClick={resetStylistForm} className="border border-charcoal/20 px-4 py-2 rounded-lg font-bold uppercase cursor-pointer">Cancel</button>
                  <button type="submit" className="bg-charcoal text-gold-300 hover:bg-gold-500 hover:text-charcoal px-6 py-2 rounded-lg font-bold uppercase cursor-pointer">Save Stylist</button>
                </div>
              </form>
            </div>
          )}

          {/* HAIRSTYLES LISTINGS */}
          {activeTab === 'hairstyles' && !isFormOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hairstyles.map((style) => (
                <div key={style.id} className="bg-white rounded-2xl overflow-hidden border border-gold-200/20 shadow-sm p-4 flex gap-4">
                  <img src={style.image} alt={style.name} className="w-24 h-24 object-cover rounded-xl border border-gold-100" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-display font-bold text-sm text-charcoal truncate">{style.name}</h4>
                        <span className="font-extrabold text-gold-600 text-sm">${style.price}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-gold-500 block mt-0.5">{style.category}</span>
                      <p className="text-[11px] text-charcoal/60 line-clamp-2 mt-1.5">{style.description}</p>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-gold-100/30">
                      <button onClick={() => handleEditStyle(style)} className="p-1.5 text-charcoal/50 hover:text-gold-500 hover:bg-gold-50 rounded cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteStyle(style.id)} className="p-1.5 text-charcoal/50 hover:text-red-500 hover:bg-red-50 rounded cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STYLISTS LISTINGS */}
          {activeTab === 'stylists' && !isFormOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stylists.map((stylist) => (
                <div key={stylist.id} className="bg-white rounded-2xl border border-gold-200/20 shadow-sm p-5 flex flex-col items-center text-center justify-between">
                  <div className="flex flex-col items-center">
                    <img src={stylist.avatar} alt={stylist.name} className="w-16 h-16 object-cover rounded-full border border-gold-200 mb-3" />
                    <h4 className="font-display font-bold text-sm text-charcoal">{stylist.name}</h4>
                    <span className="text-[10px] text-gold-600 font-bold block mt-0.5 uppercase tracking-wide">{stylist.role}</span>
                    <p className="text-[11px] text-charcoal/60 mt-3 line-clamp-3 leading-relaxed">{stylist.bio}</p>
                  </div>
                  <div className="w-full flex justify-end gap-2 pt-3 border-t border-gold-100/30 mt-4">
                    <button onClick={() => handleEditStylist(stylist)} className="p-1.5 text-charcoal/50 hover:text-gold-500 hover:bg-gold-50 rounded cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteStylist(stylist.id)} className="p-1.5 text-charcoal/50 hover:text-red-500 hover:bg-red-50 rounded cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}