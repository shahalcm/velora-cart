import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const { login } = await import('../api/authService');
        const response = await login({ email, password });

        localStorage.setItem('user_token', JSON.stringify({ 
          name: response.user.name, 
          email: response.user.email,
          token: response.token,
          loggedInAt: new Date().toISOString() 
        }));
        window.dispatchEvent(new Event('authChange'));
        addToast('Successfully logged in!', 'success');
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid email or password');
        addToast(err.response?.data?.message || 'Invalid email or password', 'error');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center grow">
      <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-lg border border-border">
        <h2 className="text-3xl font-bold text-center mb-6 text-foreground">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Log In
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
