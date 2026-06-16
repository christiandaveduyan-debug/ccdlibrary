import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegister: (name: string, email: string, password: string) => boolean;
  errorMessage?: string;
}

export function RegisterModal({ onClose, onSwitchToLogin, onRegister, errorMessage }: RegisterModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError(data.message || 'Signup failed.');
      } else {
        onRegister(name, email, password);
      }
    } catch (error) {
      setSubmitError('Unable to reach backend.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white">Create Account</h2>
          <p className="text-sky-100 text-sm mt-1">Join LibraryHub to manage your inventory</p>
        </div>

        {errorMessage && (
          <div className="rounded-b-none border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
        {submitError && (
          <div className="rounded-b-none border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="register-name" className="text-slate-700 font-medium mb-1.5 block">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError('name'); }}
                placeholder="John Doe"
                className={`pl-11 h-11 ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-sky-500'}`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="register-email" className="text-slate-700 font-medium mb-1.5 block">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                placeholder="you@example.com"
                className={`pl-11 h-11 ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-sky-500'}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="register-password" className="text-slate-700 font-medium mb-1.5 block">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                placeholder="••••••••"
                className={`pl-11 pr-11 h-11 ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-sky-500'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <Label htmlFor="register-confirm" className="text-slate-700 font-medium mb-1.5 block">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="register-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                placeholder="••••••••"
                className={`pl-11 pr-11 h-11 ${errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-sky-500'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor="terms" className="text-sm text-slate-600">
              I agree to the{' '}
              <button type="button" className="text-sky-600 hover:underline font-medium">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-sky-600 hover:underline font-medium">
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-lg shadow-sky-600/30"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Switch to Login */}
          <p className="text-center text-slate-600 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sky-600 hover:text-sky-700 font-semibold"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}