import React from 'react';

import { MessageCircle, Users, Lightbulb, Share2, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { supabase } from '../Auth/supabase';
const HomePage = () => {
    const navigate = useNavigate();
    const { session } = useAuth();
    
    console.log("Current session:", session);

    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error logging out:", error.message);
        return;
      }
    }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      {/* Main Card Container */}
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl overflow-hidden">
        
        {/* --- Header --- */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-full">
              <MessageCircle className="text-white h-6 w-6" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-gray-900">Anonymous Feedback</span>
          </div>
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-gray-600 font-medium">
            <Link to="/about" className="hover:text-gray-900 transition">How It Works</Link>
            <Link to="/browse" className="hover:text-gray-900 transition">Browse Boards</Link>
          </nav>
          {
            !session ? (
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
              onClick={() => navigate("/login")}>
                Log In
              </button>
          ) : (
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
              onClick={() => handleLogout()}>
                Log out 
              </button>
          )
          }
        </header>

        {/* --- Hero Section --- */}
        <section className="flex flex-col-reverse md:flex-row items-center justify-between px-12 py-16 md:py-24">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-6 text-center md:text-left mt-10 md:mt-0">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Your Voice. Unfiltered. <br className="hidden md:block" /> Anonymous.
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
              Share honest feedback, anonymously. Explore ideas and start meaningful conversations.
            </p>
            <div>
              <button className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => navigate("/browse")}>
                Browse Feedback Boards
              </button>
            </div>
          </div>
          {/* Illustration 
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://placehold.co/600x400/f3f4f6/a0aec0?text=Illustration+Placeholder" 
              alt="Team collaboration illustration" 
              className="max-w-full h-auto object-contain"
            />
          </div>*/}
        </section>

        {/* --- Popular Boards Section --- */}
        <section className="px-12 py-16 bg-gray-50">
          
          {/* Process Steps */}
          <div className="hidden md:flex justify-center space-x-16 mb-16">
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <Users className="h-7 w-7" />
              </div>
              <span className="font-medium text-gray-800">1. Find a Board</span>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <Lightbulb className="h-7 w-7" />
              </div>
              <span className="font-medium text-gray-800">2. Share your Thoughts</span>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <Share2 className="h-7 w-7" />
              </div>
              <span className="font-medium text-gray-800">3. Discuss & Improve</span>
            </div>
          </div>

          {/* Board Cards Grid */}
        </section>

        {/* --- Footer --- */}
        <footer className="flex flex-col md:flex-row items-center justify-between px-12 py-8 border-t border-gray-100 bg-white">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-blue-600 p-2 rounded-full">
              <MessageCircle className="text-white h-5 w-5" fill="currentColor" />
            </div>
            <span className="text-lg font-bold text-gray-900">Anonymous Feedback</span>
          </div>
          {/* Links & Social */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12 text-gray-600">
            <div className="flex space-x-8 font-medium">
              <Link to="/about" className="hover:text-gray-900 transition">About</Link>
              <Link to="/privacy-policy" className="hover:text-gray-900 transition">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;