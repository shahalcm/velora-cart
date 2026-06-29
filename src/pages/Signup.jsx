import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      addToast('Passwords do not match', 'error');
      return;
    }

    if (formData.name && formData.email && formData.password) {
      try {
        const { register } = await import('../api/authService');
        const response = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        // Set auth token
        localStorage.setItem('user_token', JSON.stringify({ 
          name: response.user.name, 
          email: response.user.email,
          token: response.token,
          loggedInAt: new Date().toISOString() 
        }));
        window.dispatchEvent(new Event('authChange'));
        addToast('Account created successfully!', 'success');
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
        addToast(err.response?.data?.message || 'Registration failed', 'error');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center grow">
      <div className="w-full max-w-lg p-8 bg-card rounded-2xl shadow-lg border border-border mt-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-foreground">Create Account</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
              <input 
                type="tel" 
                name="phone"
                required
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                placeholder="Enter your phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              required
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm mt-2"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
