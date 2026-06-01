import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  TrendingUp,
  User,
  Package,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Loader2,
  ChevronDown,
} from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot';

export default function LoginPage() {
  const { login, register, resetPassword, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      if (!email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      const result = await login(email, password);
      if (!result.success) setError(result.error ?? 'Login failed.');
    } else if (mode === 'register') {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      const result = await register(name, email, password);
      if (!result.success) setError(result.error ?? 'Registration failed.');
    } else if (mode === 'forgot') {
      if (!email) {
        setError('Please enter your email address.');
        return;
      }
      const result = await resetPassword(email);
      if (result.success) {
        setSuccess('Password reset link sent! Check your email.');
        setTimeout(() => setMode('login'), 2000);
      }
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  const fillDemoCredentials = (emailVal: string, passVal: string) => {
    setEmail(emailVal);
    setPassword(passVal);
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-48 -right-32 h-[28rem] w-[28rem] rounded-full bg-purple-500/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.5s ease-out; }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* Left Panel - Branding */}
      <div className="relative hidden w-full flex-col justify-between overflow-hidden p-8 lg:flex lg:w-1/2">
        {/* Brand */}
        <div className="animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">StockFlow</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Inventory Management
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Made Effortless
            </span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-300">
            Streamline your inventory operations with real-time tracking, smart alerts, and powerful analytics — all in one beautiful dashboard.
          </p>

          {/* Feature Cards */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <FeatureCard icon={<Package className="h-5 w-5" />} title="Real-time Tracking" desc="Monitor stock levels instantly" />
            <FeatureCard icon={<AlertTriangle className="h-5 w-5" />} title="Smart Alerts" desc="Get notified before running low" />
            <FeatureCard icon={<BarChart3 className="h-5 w-5" />} title="Powerful Analytics" desc="Data-driven insights & reports" />
            <FeatureCard icon={<Shield className="h-5 w-5" />} title="Secure & Reliable" desc="Enterprise-grade security" />
          </div>
        </div>

        {/* Stats */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <Stat number="10K+" label="Products Managed" />
            <div className="h-8 w-px bg-white/10" />
            <Stat number="500+" label="Active Users" />
            <div className="h-8 w-px bg-white/10" />
            <Stat number="99.9%" label="Uptime" />
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="relative flex w-full flex-col items-center justify-center p-6 sm:p-8 lg:w-1/2">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">StockFlow</span>
          </div>

          {/* Auth Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {mode === 'login' && 'Sign in to access your inventory dashboard.'}
                {mode === 'register' && 'Get started with a free StockFlow account.'}
                {mode === 'forgot' && 'Enter your email to receive a reset link.'}
              </p>
            </div>

            {/* Demo Credentials Toggle */}
            {mode === 'login' && (
              <div className="mb-6">
                <button
                  onClick={() => setShowDemo(!showDemo)}
                  className="flex w-full items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-sm text-indigo-300 transition-all hover:bg-indigo-500/10"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="font-medium">Quick Demo Access</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showDemo ? 'rotate-180' : ''}`} />
                </button>
                {showDemo && (
                  <div className="mt-2 space-y-2">
                    {[
                      { role: '👨‍💼 Administrator', email: 'admin@stockflow.com', pass: 'admin123' },
                      { role: '👩‍💻 Warehouse Manager', email: 'sarah@stockflow.com', pass: 'sarah123' },
                      { role: '👨‍🔧 Inventory Clerk', email: 'john@stockflow.com', pass: 'john123' },
                    ].map((demo) => (
                      <button
                        key={demo.email}
                        onClick={() => fillDemoCredentials(demo.email, demo.pass)}
                        className="flex w-full items-center justify-between rounded-lg bg-white/5 px-4 py-2.5 text-left transition-colors hover:bg-white/10"
                      >
                        <span className="text-sm text-white">{demo.role}</span>
                        <ArrowRight className="h-4 w-4 text-indigo-400" />
                      </button>
                    ))}
                    <p className="px-1 text-xs text-slate-500">Click a role to auto-fill credentials</p>
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                  {success}
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
              )}

              {(mode === 'login' || mode === 'register') && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-12 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-12 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Link (login mode) */}
              {mode === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500/20" />
                    <span className="text-sm text-slate-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Terms (register mode) */}
              {mode === 'register' && (
                <p className="text-xs text-slate-500">
                  By creating an account, you agree to our{' '}
                  <span className="text-indigo-400 underline underline-offset-2">Terms of Service</span> and{' '}
                  <span className="text-indigo-400 underline underline-offset-2">Privacy Policy</span>.
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === 'login'
                      ? 'Sign In'
                      : mode === 'register'
                        ? 'Create Account'
                        : 'Send Reset Link'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            {mode !== 'forgot' && (
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-500">or continue with</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            )}

            {/* Social Login */}
            {mode !== 'forgot' && (
              <div className="grid grid-cols-2 gap-3">
                <SocialButton icon={<Globe className="h-4 w-4" />} label="Google" />
                <SocialButton icon={<Globe className="h-4 w-4" />} label="GitHub" />
              </div>
            )}

            {/* Switch Auth Mode */}
            <div className="mt-6 text-center">
              {mode === 'login' ? (
                <p className="text-sm text-slate-400">
                  Don't have an account?{' '}
                  <button onClick={() => switchMode('register')} className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                    Sign up free
                  </button>
                </p>
              ) : mode === 'register' ? (
                <p className="text-sm text-slate-400">
                  Already have an account?{' '}
                  <button onClick={() => switchMode('login')} className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                    Sign in
                  </button>
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  Remember your password?{' '}
                  <button onClick={() => switchMode('login')} className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                    Back to login
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-500">
            © 2025 StockFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-indigo-500/20 hover:bg-indigo-500/5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-0.5 text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="text-xl font-bold text-white sm:text-2xl">{number}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
    >
      {icon}
      {label}
    </button>
  );
}
