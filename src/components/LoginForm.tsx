import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { beautyService } from '../lib/client';

interface LoginFormProps {
  onSuccess: (user: any) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const user = await beautyService.login(email, password);
      onSuccess(user);
      navigate('/appointments');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gold-200/40">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-charcoal">Welcome Back</h2>
        <p className="text-sm text-charcoal/60 mt-1">
          Access your personal styling profile and appointments
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs flex items-start gap-2.5 mb-6 border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/70 mb-2">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-charcoal/40 pointer-events-none">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-cream/50 text-charcoal pl-10 pr-4 py-3 rounded-xl text-sm border border-gold-200/30 focus:outline-none focus:border-gold-400 focus:bg-white transition-all"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/70">
              Password
            </label>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-charcoal/40 pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-cream/50 text-charcoal pl-10 pr-4 py-3 rounded-xl text-sm border border-gold-200/30 focus:outline-none focus:border-gold-400 focus:bg-white transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-charcoal text-gold-300 hover:bg-gold-500 hover:text-charcoal disabled:opacity-50 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 mt-2 shadow-md cursor-pointer"
        >
          {loading ? (
            <span>Signing In...</span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gold-200/30 text-center">
        <p className="text-xs text-charcoal/60">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold-600 font-semibold hover:underline">
            Create Profile
          </Link>
        </p>
      </div>

      <div className="mt-6 p-3.5 bg-gold-100/50 rounded-xl border border-gold-200/30 flex items-start gap-2 text-[10px] text-gold-800 leading-relaxed">
        <ShieldCheck className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Secured by ApexKit SSO:</span> Fully integrated with database auth.
        </div>
      </div>
    </div>
  );
}
