import { ApexKit, User, BaseRecord, AuthResponse } from '@apexkit/sdk';
import { 
  Hairstyle, 
  Stylist, 
  Appointment, 
  INITIAL_HAIRSTYLES, 
  INITIAL_STYLISTS 
} from '../data/mockData';

const BASE_URL = 'https://kipeles-apexkit.hf.space';
const TENANT_ID = 'apex-beauty';

// Create a single client instance
export const sdk = new ApexKit(BASE_URL).tenant(TENANT_ID);

// Key names for LocalStorage
const LOCAL_TOKEN_KEY = 'apex_beauty_token';
const LOCAL_USER_KEY = 'apex_beauty_user';
const LOCAL_HAIRSTYLES_KEY = 'apex_beauty_hairstyles';
const LOCAL_STYLISTS_KEY = 'apex_beauty_stylists';
const LOCAL_APPOINTMENTS_KEY = 'apex_beauty_appointments';

class BeautyService {
  private isUsingFallback: boolean = false;
  private currentUser: User | null = null;

  constructor() {
    // Attempt to load previous session from localStorage
    const savedToken = localStorage.getItem(LOCAL_TOKEN_KEY);
    const savedUser = localStorage.getItem(LOCAL_USER_KEY);
    if (savedToken && savedUser) {
      try {
        const userObj = JSON.parse(savedUser) as User;
        this.currentUser = userObj;
        sdk.setToken(savedToken, userObj);
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    }
    
    // Seed initial local data into LocalStorage if not present
    if (!localStorage.getItem(LOCAL_HAIRSTYLES_KEY)) {
      localStorage.setItem(LOCAL_HAIRSTYLES_KEY, JSON.stringify(INITIAL_HAIRSTYLES));
    }
    if (!localStorage.getItem(LOCAL_STYLISTS_KEY)) {
      localStorage.setItem(LOCAL_STYLISTS_KEY, JSON.stringify(INITIAL_STYLISTS));
    }
    if (!localStorage.getItem(LOCAL_APPOINTMENTS_KEY)) {
      localStorage.setItem(LOCAL_APPOINTMENTS_KEY, JSON.stringify([]));
    }
  }

  // Get active fallback mode
  public isFallbackActive(): boolean {
    return this.isUsingFallback;
  }

  // Set explicit fallback mode
  public setFallbackMode(val: boolean) {
    this.isUsingFallback = val;
  }

  // Current authenticated user
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Fetch Hairstyles
  public async getHairstyles(): Promise<Hairstyle[]> {
    if (this.isUsingFallback) {
      return this.getLocalHairstyles();
    }
    try {
      const res = await sdk.collection('hairstyles').list({ per_page: 50 });
      if (res && res.items && res.items.length > 0) {
        return res.items.map((item: any) => ({
          id: String(item.id || item.record_id),
          name: item.name || item.data?.name,
          category: item.category || item.data?.category || 'Cuts',
          price: Number(item.price || item.data?.price || 0),
          duration: item.duration || item.data?.duration || '30 mins',
          description: item.description || item.data?.description || '',
          image: item.image || item.data?.image || '',
          features: Array.isArray(item.features || item.data?.features) ? (item.features || item.data?.features) : []
        }));
      }
      return this.getLocalHairstyles();
    } catch (e) {
      console.warn('Hairstyles collection failed or does not exist. Using fallback.', e);
      this.isUsingFallback = true;
      return this.getLocalHairstyles();
    }
  }

  // Create Hairstyle
  public async createHairstyle(style: Omit<Hairstyle, 'id'>): Promise<Hairstyle> {
    const newId = 'hs-' + Math.random().toString(36).substr(2, 9);
    const item: Hairstyle = { ...style, id: newId };

    if (this.isUsingFallback) {
      const current = this.getLocalHairstyles();
      current.push(item);
      localStorage.setItem(LOCAL_HAIRSTYLES_KEY, JSON.stringify(current));
      return item;
    }

    try {
      const res = await sdk.collection('hairstyles').create(style);
      return {
        id: String(res?.id || newId),
        ...style
      };
    } catch (e) {
      console.warn('Failed to save hairstyle to cloud, writing locally.', e);
      const current = this.getLocalHairstyles();
      current.push(item);
      localStorage.setItem(LOCAL_HAIRSTYLES_KEY, JSON.stringify(current));
      return item;
    }
  }

  // Update Hairstyle
  public async updateHairstyle(id: string, style: Partial<Hairstyle>): Promise<boolean> {
    if (this.isUsingFallback) {
      const current = this.getLocalHairstyles();
      const updated = current.map(item => item.id === id ? { ...item, ...style } : item);
      localStorage.setItem(LOCAL_HAIRSTYLES_KEY, JSON.stringify(updated));
      return true;
    }

    try {
      await sdk.collection('hairstyles').patch(id, style);
      return true;
    } catch (e) {
      console.warn('Failed to update cloud hairstyle, updating locally.', e);
      const current = this.getLocalHairstyles();
      const updated = current.map(item => item.id === id ? { ...item, ...style } : item);
      localStorage.setItem(LOCAL_HAIRSTYLES_KEY, JSON.stringify(updated));
      return true;
    }
  }

  // Delete Hairstyle
  public async deleteHairstyle(id: string): Promise<boolean> {
    if (this.isUsingFallback) {
      const current = this.getLocalHairstyles();
      const updated = current.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_HAIRSTYLES_KEY, JSON.stringify(updated));
      return true;
    }

    try {
      await sdk.collection('hairstyles').delete(id);
      return true;
    } catch (e) {
      console.warn('Failed to delete cloud hairstyle, deleting locally.', e);
      const current = this.getLocalHairstyles();
      const updated = current.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_HAIRSTYLES_KEY, JSON.stringify(updated));
      return true;
    }
  }

  // Fetch Stylists
  public async getStylists(): Promise<Stylist[]> {
    if (this.isUsingFallback) {
      return this.getLocalStylists();
    }
    try {
      const res = await sdk.collection('stylists').list({ per_page: 50 });
      if (res && res.items && res.items.length > 0) {
        return res.items.map((item: any) => ({
          id: String(item.id || item.record_id),
          name: item.name || item.data?.name,
          role: item.role || item.data?.role || '',
          experience: item.experience || item.data?.experience || '',
          rating: Number(item.rating || item.data?.rating || 5.0),
          reviewCount: Number(item.reviewCount || item.data?.reviewCount || 0),
          bio: item.bio || item.data?.bio || '',
          avatar: item.avatar || item.data?.avatar || '',
          portfolio: Array.isArray(item.portfolio || item.data?.portfolio) ? (item.portfolio || item.data?.portfolio) : [],
          specialties: Array.isArray(item.specialties || item.data?.specialties) ? (item.specialties || item.data?.specialties) : []
        }));
      }
      return this.getLocalStylists();
    } catch (e) {
      console.warn('Stylists collection failed or does not exist. Using fallback.', e);
      this.isUsingFallback = true;
      return this.getLocalStylists();
    }
  }

  // Create Stylist
  public async createStylist(stylist: Omit<Stylist, 'id'>): Promise<Stylist> {
    const newId = 'st-' + Math.random().toString(36).substr(2, 9);
    const item: Stylist = { ...stylist, id: newId };

    if (this.isUsingFallback) {
      const current = this.getLocalStylists();
      current.push(item);
      localStorage.setItem(LOCAL_STYLISTS_KEY, JSON.stringify(current));
      return item;
    }

    try {
      const res = await sdk.collection('stylists').create(stylist);
      return {
        id: String(res?.id || newId),
        ...stylist
      };
    } catch (e) {
      console.warn('Failed to save stylist to cloud, writing locally.', e);
      const current = this.getLocalStylists();
      current.push(item);
      localStorage.setItem(LOCAL_STYLISTS_KEY, JSON.stringify(current));
      return item;
    }
  }

  // Update Stylist
  public async updateStylist(id: string, stylist: Partial<Stylist>): Promise<boolean> {
    if (this.isUsingFallback) {
      const current = this.getLocalStylists();
      const updated = current.map(item => item.id === id ? { ...item, ...stylist } : item);
      localStorage.setItem(LOCAL_STYLISTS_KEY, JSON.stringify(updated));
      return true;
    }

    try {
      await sdk.collection('stylists').patch(id, stylist);
      return true;
    } catch (e) {
      console.warn('Failed to update cloud stylist, updating locally.', e);
      const current = this.getLocalStylists();
      const updated = current.map(item => item.id === id ? { ...item, ...stylist } : item);
      localStorage.setItem(LOCAL_STYLISTS_KEY, JSON.stringify(updated));
      return true;
    }
  }

  // Delete Stylist
  public async deleteStylist(id: string): Promise<boolean> {
    if (this.isUsingFallback) {
      const current = this.getLocalStylists();
      const updated = current.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STYLISTS_KEY, JSON.stringify(updated));
      return true;
    }

    try {
      await sdk.collection('stylists').delete(id);
      return true;
    } catch (e) {
      console.warn('Failed to delete cloud stylist, deleting locally.', e);
      const current = this.getLocalStylists();
      const updated = current.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STYLISTS_KEY, JSON.stringify(updated));
      return true;
    }
  }

  // Fetch All Appointments (Administrative)
  public async adminGetAppointments(): Promise<Appointment[]> {
    if (this.isUsingFallback) {
      return this.getLocalAppointmentsAll();
    }
    try {
      const res = await sdk.collection('appointments').list({ per_page: 100 });
      if (res && res.items) {
        return res.items.map((item: any) => ({
          id: String(item.id || item.record_id),
          serviceId: item.serviceId || item.data?.serviceId || '',
          stylistId: item.stylistId || item.data?.stylistId || '',
          date: item.date || item.data?.date || '',
          time: item.time || item.data?.time || '',
          customerName: item.customerName || item.data?.customerName || '',
          customerEmail: item.customerEmail || item.data?.customerEmail || '',
          customerPhone: item.customerPhone || item.data?.customerPhone || '',
          notes: item.notes || item.data?.notes || '',
          status: (item.status || item.data?.status || 'upcoming') as 'upcoming' | 'completed' | 'cancelled',
          priceAtBooking: Number(item.priceAtBooking || item.data?.priceAtBooking || 0)
        }));
      }
      return this.getLocalAppointmentsAll();
    } catch (e) {
      console.warn('Failed to query all appointments remotely, falling back to local files.', e);
      return this.getLocalAppointmentsAll();
    }
  }

  // Fetch Appointments for logged-in user
  public async getAppointments(email: string): Promise<Appointment[]> {
    if (this.isUsingFallback) {
      return this.getLocalAppointments(email);
    }
    try {
      const res = await sdk.collection('appointments').list({ 
        per_page: 100,
        filter: { customerEmail: email }
      });
      if (res && res.items) {
        return res.items.map((item: any) => ({
          id: String(item.id || item.record_id),
          serviceId: item.serviceId || item.data?.serviceId || '',
          stylistId: item.stylistId || item.data?.stylistId || '',
          date: item.date || item.data?.date || '',
          time: item.time || item.data?.time || '',
          customerName: item.customerName || item.data?.customerName || '',
          customerEmail: item.customerEmail || item.data?.customerEmail || '',
          customerPhone: item.customerPhone || item.data?.customerPhone || '',
          notes: item.notes || item.data?.notes || '',
          status: (item.status || item.data?.status || 'upcoming') as 'upcoming' | 'completed' | 'cancelled',
          priceAtBooking: Number(item.priceAtBooking || item.data?.priceAtBooking || 0)
        }));
      }
      return this.getLocalAppointments(email);
    } catch (e) {
      console.warn('Appointments collection failed or does not exist. Using fallback.', e);
      this.isUsingFallback = true;
      return this.getLocalAppointments(email);
    }
  }

  // Create Appointment
  public async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    const newId = 'app-' + Math.random().toString(36).substr(2, 9);
    const completeApp: Appointment = {
      ...appointment,
      id: newId
    };

    if (this.isUsingFallback) {
      this.saveLocalAppointment(completeApp);
      return completeApp;
    }

    try {
      const res = await sdk.collection('appointments').create(completeApp);
      if (res) {
        return {
          id: String(res.id || newId),
          ...appointment
        };
      }
      throw new Error('Create empty response');
    } catch (e) {
      console.warn('Failed to save to remote collection, saving locally.', e);
      this.isUsingFallback = true;
      this.saveLocalAppointment(completeApp);
      return completeApp;
    }
  }

  // Update/Cancel Appointment
  public async updateAppointmentStatus(id: string, status: 'cancelled' | 'upcoming' | 'completed', email: string): Promise<boolean> {
    if (this.isUsingFallback) {
      const apps = this.getLocalAppointmentsAll();
      const updated = apps.map(app => {
        if (app.id === id) {
          return { ...app, status };
        }
        return app;
      });
      localStorage.setItem(LOCAL_APPOINTMENTS_KEY, JSON.stringify(updated));
      return true;
    }

    try {
      await sdk.collection('appointments').patch(id, { status });
      return true;
    } catch (e) {
      console.warn('Failed to update remote appointment, fallback to local update.', e);
      const apps = this.getLocalAppointmentsAll();
      const updated = apps.map(app => {
        if (app.id === id) {
          return { ...app, status };
        }
        return app;
      });
      localStorage.setItem(LOCAL_APPOINTMENTS_KEY, JSON.stringify(updated));
      return true;
    }
  }

  // Authenticators
  public async login(email: string, pass: string): Promise<User> {
    try {
      const res = await sdk.auth.login(email, pass);
      if (res && res.token && res.user) {
        localStorage.setItem(LOCAL_TOKEN_KEY, res.token);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(res.user));
        this.currentUser = res.user;
        return res.user;
      }
      throw new Error('Invalid login payload');
    } catch (e) {
      console.warn('Remote auth login failed. Falling back to local auth simulation.', e);
      // Simulate local auth - Admin fallback detection
      const isMockAdmin = email.toLowerCase().includes('admin');
      const mockUser: User = {
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        email: email,
        role: isMockAdmin ? 'admin' : 'customer',
        scope: 'tenant:apex-beauty',
        metadata: { name: email.split('@')[0] }
      };
      localStorage.setItem(LOCAL_TOKEN_KEY, 'mock-jwt-token-beauty');
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
      this.currentUser = mockUser;
      return mockUser;
    }
  }

  public async register(email: string, pass: string, name: string): Promise<User> {
    try {
      const res = await sdk.auth.register(email, pass, { name });
      if (res && res.token && res.user) {
        localStorage.setItem(LOCAL_TOKEN_KEY, res.token);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(res.user));
        this.currentUser = res.user;
        return res.user;
      }
      throw new Error('Invalid register response');
    } catch (e) {
      console.warn('Remote auth registration failed. Falling back to local registration simulation.', e);
      const isMockAdmin = email.toLowerCase().includes('admin');
      const mockUser: User = {
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        email: email,
        role: isMockAdmin ? 'admin' : 'customer',
        scope: 'tenant:apex-beauty',
        metadata: { name }
      };
      localStorage.setItem(LOCAL_TOKEN_KEY, 'mock-jwt-token-beauty');
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
      this.currentUser = mockUser;
      return mockUser;
    }
  }

  public logout() {
    try {
      sdk.auth.logout();
    } catch (e) {}
    localStorage.removeItem(LOCAL_TOKEN_KEY);
    localStorage.removeItem(LOCAL_USER_KEY);
    this.currentUser = null;
  }

  // ==========================================
  // Local Fallback Helpers
  // ==========================================
  private getLocalHairstyles(): Hairstyle[] {
    const data = localStorage.getItem(LOCAL_HAIRSTYLES_KEY);
    return data ? JSON.parse(data) : INITIAL_HAIRSTYLES;
  }

  private getLocalStylists(): Stylist[] {
    const data = localStorage.getItem(LOCAL_STYLISTS_KEY);
    return data ? JSON.parse(data) : INITIAL_STYLISTS;
  }

  private getLocalAppointmentsAll(): Appointment[] {
    const data = localStorage.getItem(LOCAL_APPOINTMENTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getLocalAppointments(email: string): Appointment[] {
    const all = this.getLocalAppointmentsAll();
    return all.filter(app => app.customerEmail.toLowerCase() === email.toLowerCase());
  }

  private saveLocalAppointment(app: Appointment) {
    const all = this.getLocalAppointmentsAll();
    all.unshift(app);
    localStorage.setItem(LOCAL_APPOINTMENTS_KEY, JSON.stringify(all));
  }
}

export const beautyService = new BeautyService();