import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { supabase } from './supabase';
const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const {data, error} = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
      alert(`Error: ${error.message}`);
      return;
    }


    alert("Signup successful! Please check your email to confirm your account.");
    console.log(data)
  }

  return (
    // 1. Main Container: Centered content, light background matching the image
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
      
      {/* 2. Wrapper for Card + Decoration */}
      <div className="relative w-full max-w-[420px]">
        
        {/* --- Decorative Chat Bubbles (Absolute Positioned to left) --- */}
        {/* Hidden on small screens to prevent layout issues, visible on medium+ */}
        <div className="hidden md:block absolute -left-24 top-20 w-24 h-full pointer-events-none z-0">
          {/* Top Blue Bubble */}
          <div className="absolute top-0 right-4 w-12 h-10 bg-blue-500 rounded-tl-xl rounded-tr-xl rounded-bl-xl flex items-center justify-center shadow-md">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
          {/* Green Bubble */}
          <div className="absolute top-8 right-0 w-16 h-12 bg-green-400 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-md z-10"></div>
          {/* Bottom Blue Bubble */}
          <div className="absolute top-20 right-6 w-14 h-11 bg-blue-500 rounded-tl-xl rounded-br-xl rounded-bl-xl flex items-center justify-center shadow-md">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
          {/* Faint connecting lines (Simulated with borders) */}
          <div className="absolute top-6 right-10 w-8 h-16 border-l border-b border-gray-300 rounded-bl-3xl -z-10"></div>
        </div>

        {/* --- Main White Card --- */}
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 w-full">
          
          {/* Logo Section */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {/* Blue Chat Bubble Icon */}
              <svg className="w-10 h-10 text-blue-500 fill-current" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              {/* Letter 'A' */}
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg pt-1">A</span>
            </div>
            <span className="ml-3 text-lg font-bold text-gray-900 tracking-tight">Anonymous Feedback</span>
          </div>

          {/* Header */}
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
            Create Your Account
          </h2>

          {/* Form */}
          <form className="space-y-5">
            
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700 placeholder-gray-400 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
          
              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showPassword ? (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                  {!showPassword && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700 placeholder-gray-400 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showConfirmPassword ? (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                  {!showConfirmPassword && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95 text-lg"
              onClick={handleSignup}
            >
             Create Account 
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Have an account?{' '}
              <span className="text-blue-500 font-bold mx-1">*</span>
              <Link to="/login" className="font-bold text-blue-500 hover:underline">
                  Login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;