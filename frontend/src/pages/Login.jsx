import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import IndhanLogo from '../components/IndhanLogo';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@indhan.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/v1/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-shell flex flex-col justify-center items-center p-6 bg-slate-50 relative overflow-hidden">
      
      {/* Decorative background art: Abstract Energy Flow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="flow2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M-100 200 C300 0, 500 500, 1200 100 L1200 800 L-100 800 Z" fill="url(#flow1)" />
          <path d="M-100 500 C400 800, 700 200, 1200 400 L1200 800 L-100 800 Z" fill="url(#flow2)" />
        </svg>
      </div>
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-8 sm:p-12 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] relative z-10 overflow-hidden">
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center p-5 bg-red-50 border border-red-100 rounded-2xl mb-6 shadow-sm">
            <IndhanLogo variant="icon" className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-4xl font-display font-bold tracking-widest text-slate-900 mb-3">INDHAN</h2>
          <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Energy Infrastructure OS</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] uppercase tracking-widest text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-slate-300" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-mono text-sm font-bold placeholder:text-slate-300 shadow-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Authentication Key</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-slate-300" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-mono text-sm font-bold placeholder:text-slate-300 shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 px-4 rounded-2xl flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed group mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-red-200/30 border-t-red-100 rounded-full animate-spin"></div>
            ) : (
              <>
                Initialize Session
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
