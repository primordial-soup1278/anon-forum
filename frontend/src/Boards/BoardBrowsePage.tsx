import React from 'react';
import { MessageCircle, Search, ChevronDown, User, Plus, Superscript } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAuth } from '../Auth/AuthContext';
import { supabase } from '../Auth/supabase';
import { useEffect, useState } from 'react';
import { getAllBoards } from './requests';
import type { Board } from './Board';
const BoardBrowsePage = () => {
  // Mock data for the board cards
  /*const boards = [
    { id : 1, title: "Product ideas V.3 2024", description: "Ideas and marketing site.", posts: 43, color: "blue" },
    { id : 2, title: "Remote Work Policies", description: "Ideas and bugs for marketing site.", posts: 48, color: "green" },
    { id : 3, title: "Remote Culture Q&AA", description: "Ideas and Iiteen IOS/Android", posts: 135, color: "orange" },
    { id : 4, title: "Website Improvements Q3", description: "Ideas and bus for marketing site.", posts: 48, color: "blue" },
    { id : 5, title: "Mobile App Feedback", description: "Dshart losght.on IOS/Android app #mobile", posts: 836, color: "orange" },
    { id : 6, title: "Office Amenities", description: "Sisccubaights.on IOS/Android app", posts: 305, color: "red" },
    { id : 7, title: "Obrile App Feedback", description: "Coare undoen.ba.t.rats us wslite", posts: 305, color: "blue" },
    { id : 8, title: "Office Amenities", description: "Fhhr #mcblet aiits", posts: "1.2K", color: "red" },
    { id : 9, title: "Community Suggestions", description: "Pe.newicdle sungite ant owidiss", posts: "1.2K", color: "red" },
  ];*/
  const navigate = useNavigate();

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return { badge: "bg-blue-100 text-blue-600", check: "text-blue-600" };
      case 'green': return { badge: "bg-green-100 text-green-600", check: "text-green-600" };
      case 'orange': return { badge: "bg-orange-100 text-orange-600", check: "text-orange-600" };
      case 'red': return { badge: "bg-red-100 text-red-600", check: "text-red-600" };
      default: return { badge: "bg-gray-100 text-gray-600", check: "text-gray-600" };
    }
  };

  const BoardCard = ({ board }) => {
    const { badge, check } = getColorClasses("blue");
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className={`p-1.5 rounded-lg ${badge}`}>
              <MessageCircle className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{board.name}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{board.description}</p>
        </div>
      </div>
    );
  };

  const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error.message);
        return;
      }
  }

  const {session} = useAuth();

  const [boardData, setBoardData] = useState<Board[]>([]);
  useEffect(() => {
    const fetchBoards = async () => {
      console.log("Fetching boards...");
      try {
        const boards : Board[] = await getAllBoards();
        console.log("Fetched boards:", boards);
        setBoardData(boards);
      }
      catch (error) {
        console.error("Error fetching boards:", error);
      }
    }

    fetchBoards();
  },[]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- Header (Matches Landing Page Style) --- */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-full">
              <MessageCircle className="text-white h-6 w-6" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-gray-900">Anonymous Feedback</span>
          </div>

          {/* Right Side: CTA (The image shows "Create Board" and a user icon, implying an *unauthenticated* CTA is still visible) */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
            onClick={() => navigate("/create-board")}>
                <Plus className="h-4 w-4 mr-1" />
                <span>Create Board</span>
            </button>
            {/* Simple User Icon (Placeholder for Login/Profile) 
            <div className="p-2 bg-gray-100 rounded-full">
                <User className="h-5 w-5 text-gray-600" />
            </div>*/}
            {/* Log In Button */}
            {
              !session ? (
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
              onClick={() => navigate("/login")}>
                Log In
              </button>
              ) : (
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
                onClick={() => handleLogout()}>
                  Log Out 
                </button>
              )
            }
            
          </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Title and Description */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Explore Feedback Boards</h1>
        <p className="text-lg text-gray-500 mb-10">
          Share honest feedback, anonymously. stat meaningful cobesite bettes.
        </p>

        {/* --- Filter and Search Row --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          
          {/* Search Input (Full Width on Small Screens) */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Find boards by topic or tag..." 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base transition outline-none"
            />
          </div>

          {/* Filters (Matching the image layout) */}
          <div className="flex space-x-3">
            
            {/* Categories Dropdown */}
            <div className="text-sm font-medium text-gray-700 hidden sm:block">Categories</div>
            <button className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Most Popular
              <ChevronDown className="w-4 h-4 ml-1.5 text-gray-500" />
            </button>

            {/* Sort By Dropdown */}
            <div className="text-sm font-medium text-gray-700 hidden sm:block">Sort By</div>
            <button className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Newest
              <ChevronDown className="w-4 h-4 ml-1.5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* --- Boards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boardData.map((board) => (
            <Link to={`/board/${board.id}`} key={board.id}>
                <BoardCard board={board} />
            </Link>
          ))}
        </div>

        {/* --- Load More Button --- */}
        <div className="flex justify-center mt-10">
          <button className="text-blue-600 font-semibold hover:underline flex items-center">
            Load More
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default BoardBrowsePage;