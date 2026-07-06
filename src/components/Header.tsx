import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Scissors, User as UserIcon, LogOut, Calendar, Menu, X, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { beautyService } from '../lib/client';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  isFallback: boolean;
}

export default function Header({ user, onLogout, isFallback }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-gold-200/40">
      {isFallback && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-center text-xs text-amber-800 font-medium flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Demo Mode: Using high-fidelity local database with offline fallback. Feel free to fully interact!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-charcoal text-gold-300 p-2.5 rounded-full transition-transform duration-300 group-hover:rotate-12">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-wider text-charcoal block">
                APEX BEAUTY
              </span>
              <span className="text-[10px] tracking-widest text-gold-500 uppercase block -mt-1 font-medium">
                Salon &amp; Spa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-medium text-sm tracking-wide transition-colors duration-200 ${
                isActive('/') ? 'text-gold-500 font-semibold' : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              Home
            </Link>
            <Link
              to="/styles"
              className={`font-medium text-sm tracking-wide transition-colors duration-200 ${
                isActive('/styles') ? 'text-gold-500 font-semibold' : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              Hairstyles &amp; Pricing
            </Link>
            <Link
              to="/stylists"
              className={`font-medium text-sm tracking-wide transition-colors duration-200 ${
                isActive('/stylists') ? 'text-gold-500 font-semibold' : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              Our Stylists
            </Link>
          </nav>

          {/* User Auth Controls / Call To Action */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/appointments"
                  className={`flex items-center gap-1.5 font-medium text-sm tracking-wide transition-colors duration-200 ${
                    isActive('/appointments') ? 'text-gold-500 font-semibold' : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-gold-400" />
                  <span>My Appointments</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="p-2 text-charcoal/50 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="font-medium text-sm text-charcoal/70 hover:text-charcoal px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/book"
              className="bg-charcoal text-gold-300 hover:bg-gold-500 hover:text-charcoal px-6 py-2.5 rounded-full font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/book"
              className="bg-charcoal text-gold-300 px-4 py-2 rounded-full font-semibold text-[10px] uppercase tracking-wider transition-all duration-300"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-charcoal p-1.5 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-gold-200/30 px-4 pt-2 pb-6 flex flex-col gap-4 shadow-inner">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 text-base font-medium ${
              isActive('/') ? 'text-gold-500 font-semibold' : 'text-charcoal/70'
            }`}
          >
            Home
          </Link>
          <Link
            to="/styles"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 text-base font-medium ${
              isActive('/styles') ? 'text-gold-500 font-semibold' : 'text-charcoal/70'
            }`}
          >
            Hairstyles &amp; Pricing
          </Link>
          <Link
            to="/stylists"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 text-base font-medium ${
              isActive('/stylists') ? 'text-gold-500 font-semibold' : 'text-charcoal/70'
            }`}
          >
            Our Stylists
          </Link>

          <hr className="border-gold-200/30" />

          {user ? (
            <div className="flex flex-col gap-4">
              <Link
                to="/appointments"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 py-2 text-base font-medium ${
                  isActive('/appointments') ? 'text-gold-500 font-semibold' : 'text-charcoal/70'
                }`}
              >
                <UserIcon className="w-5 h-5 text-gold-400" />
                <span>My Appointments</span>
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2 text-left text-base font-medium text-red-500"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-medium text-charcoal/70"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
