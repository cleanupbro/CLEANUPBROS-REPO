import React, { useState } from 'react';
import { Card } from '../components/Card';
import { signIn } from '../services/authService';

interface AdminLoginViewProps {
  onLoginSuccess: (email: string) => void;
}

const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Normalize email to lowercase for matching
      const normalizedEmail = email.toLowerCase().trim();

      const result = await signIn(normalizedEmail, password);

      if (result.success) {
        onLoginSuccess(normalizedEmail);
      } else {
        setError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <h2 className="text-2xl font-bold text-center text-brand-navy mb-2">Admin Portal</h2>
        <p className="text-center text-gray-600 mb-6">
          Please sign in to continue.
        </p>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="input"
              placeholder="Enter your admin email"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="input" 
              placeholder="Enter your password"
              required 
            />
          </div>
          <button
            type="submit"
            className="w-full btn-primary !mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginView;