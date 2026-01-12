import React from 'react';
import { MessageCircle,  ChevronDown, User, Plus} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAuth } from '../Auth/AuthContext';
import { supabase } from '../Auth/supabase';
import { useEffect, useState } from 'react';
import { getAllBoards, subscribeToBoard } from './requests';
import type { Board } from './Board';
const BoardBrowsePage = () => {
  const navigate = useNavigate();

  const PAGE_SIZE = 6
  const [page, setPage] = useState<number>(1);

  const getColorClasses = (color: any) => {
    switch (color) {
      case 'blue': return { badge: "bg-blue-100 text-blue-600", check: "text-blue-600" };
      case 'green': return { badge: "bg-green-100 text-green-600", check: "text-green-600" };
      case 'orange': return { badge: "bg-orange-100 text-orange-600", check: "text-orange-600" };
      case 'red': return { badge: "bg-red-100 text-red-600", check: "text-red-600" };
      default: return { badge: "bg-gray-100 text-gray-600", check: "text-gray-600" };
    }
  };
  const sortOptions = ["Newest", "Oldest", "Most Popular"];

  const BoardCard = ({ board } : {board : Board}) => {
    const { badge } = getColorClasses("blue");

    const [subscribed, setSubscribed] = useState<boolean>(false);
    const [memberCount, setMemberCount] = useState<number>(0);

    // check if the user is subscribed to this board
    useEffect(() => {
      const checkSubscription = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setSubscribed(board.members.includes(user.id));
        setMemberCount(board.members.length);
      }
      checkSubscription();
    },[]);
    const handleSubscribe = async (e : React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!session) {
        navigate("/login");
        return;
      }
      try {
        await subscribeToBoard(board.id);
        setSubscribed(true);
        setMemberCount(memberCount + 1);
      }
      catch (error) {
        console.error("Error subscribing to board:", error);
      }
    }

    
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

        <div className="mt-4 flex items-center justify-between">
          {/* Member count */}
          <div className="text-sm text-gray-500 flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{memberCount} member{memberCount !== 1 && "s"}</span>
          </div>
          {!subscribed ? (
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700`}
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          ) : null}
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

  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(sortOptions[0]);

  useEffect(() => {
    console.log("Selected sort option:", selected);
  }, [selected])


  const sortedBoards = [...boardData].sort((a, b) => {
    switch (selected) {
      case "Newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "Oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "Most Popular":
        return b.members.length - a.members.length;
      default:
        return 0;
    }
  });

  const TOTAL_PAGES = Math.ceil(sortedBoards.length / PAGE_SIZE);
  const paginatedBoards = sortedBoards.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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

            { /* Simple User Icon (Placeholder for Login/Profile) 
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
          Share honest feedback, anonymously.
        </p>

        {/* --- Filter and Search Row --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          
          {/* Search Input (Full Width on Small Screens) */}

          {/* Filters (Matching the image layout) */}
          <div className="relative flex space-x-3">
            {/* Sort By Dropdown */}
            <div className="text-sm font-medium text-gray-700 hidden sm:block">Sort By</div>
            <button className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            onClick={() => setOpen(!open)}>
              {selected}
              <ChevronDown className="w-4 h-4 ml-1.5 text-gray-500" />
            </button>

            {open && (
              <div className="absolute top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {sortOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelected(option);
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option}
                  </button>
            ))}
        </div>
      )}
          </div>
        </div>

        {/* --- Boards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBoards.map((board) => (
            <Link to={`/board/${board.id}`} key={board.id}>
                <BoardCard board={board} />
            </Link>
          ))}
        </div>

        {TOTAL_PAGES > 1 && (
          <div className="flex justify-center items-center mt-10 space-x-2">
            {/* Left arrow */}
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`p-2 rounded-lg border transition
                ${
                  page === 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              ‹
            </button>
              
            {/* Page numbers */}
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                disabled={page === num}
                className={`px-4 py-2 rounded-lg font-semibold transition
                  ${
                    page === num
                      ? "bg-blue-600 text-white cursor-default"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {num}
              </button>
            ))}

            {/* Right arrow */}
            <button
              onClick={() => setPage(p => Math.min(TOTAL_PAGES, p + 1))}
              disabled={page === TOTAL_PAGES}
              className={`p-2 rounded-lg border transition
                ${
                  page === TOTAL_PAGES 
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              ›
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BoardBrowsePage;