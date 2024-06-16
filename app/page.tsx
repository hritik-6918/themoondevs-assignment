'use client';

import { useState } from 'react';
import { setToken, setUser, clearAuth } from '@/redux/auth/auth.slice';
import useAuthSession from '../hooks/useAuthSession';
import { useAppDispatch } from '@/redux/store';
import axios from 'axios';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const dispatch = useAppDispatch();
  const user = useAuthSession();

  const validateForm = () => {
    let formErrors: { username?: string; password?: string } = {};

    if (!username) {
      formErrors.username = 'Username is required';
    } else if (username.length < 3) {
      formErrors.username = 'Username must be at least 3 characters long';
    }

    if (!password) {
      formErrors.password = 'Password is required';
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long';
    } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      formErrors.password = 'Password must contain both letters and numbers';
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    try {
      const response = await axios.post('/api/login', { username, password });
      const { token, user } = response.data;
      dispatch(setToken(token));
      dispatch(setUser(user));
      toast.success('Login successfully!');
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed. Check your credentials.');
    }
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    setUsername('');
    setPassword('');
    toast.info('Logged out successfully.');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {user ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900">Welcome, {user.username}</h2>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-red-500 rounded-md"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={`w-full px-4 py-2 mt-4 border rounded-md text-gray-900 ${errors.username ? 'border-red-500' : ''}`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full px-4 py-2 mt-4 border rounded-md text-gray-900 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
