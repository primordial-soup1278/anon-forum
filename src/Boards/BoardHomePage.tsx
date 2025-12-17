import React, { useState } from 'react';
import { 
  MessageCircle, 
  ArrowUp, 
  MessageSquare, 
  Filter, 
  Search, 
  ChevronDown,
  Plus,
  AlertCircle // Added missing icon
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom'; // Added Link for nav
import { boardsData } from './mockBoards';

const BoardHomePage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const { boardId } = useParams();

  // Find the board info based on the URL ID
  const board = boardsData.find(b => b.id.toString() === boardId);

  // Mock data for feedback posts
  const feedbackPosts = [
    {
      id: 1,
      title: "Add dark mode to the dashboard",
      description: "It would be great to have a dark mode option for late-night work sessions. The current white interface is quite bright.",
      upvotes: 42,
      comments: 12,
      category: "Feature Request",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Mobile app crashes on login",
      description: "Ever since the last update, the app crashes immediately after I enter my credentials on iOS 17.",
      upvotes: 28,
      comments: 5,
      category: "Bug Report",
      status: "Under Review"
    },
    {
      id: 3,
      title: "Export feedback as CSV",
      description: "We need a way to export all the feedback from this board into a spreadsheet for our monthly reports.",
      upvotes: 15,
      comments: 3,
      category: "Feature Request",
      status: "Planned"
    }
  ];

  // Safety check: if board isn't found, show a clean error state
  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Board Not Found</h1>
        <Link to="/browse" className="text-blue-600 mt-4 font-semibold hover:underline">
          Return to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* --- Navigation --- */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/browse" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-full cursor-pointer">
              <MessageCircle className="text-white h-5 w-5" fill="currentColor" />
            </div>
            <span className="text-lg font-bold text-gray-900">Anonymous Feedback</span>
          </Link>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Log In
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
        
        {/* --- Sidebar (Filters & Info) --- */}
        <aside className="w-full md:w-64 space-y-6">
          {/* DYNAMIC Board Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{board.title}</h1>
            <p className="text-sm text-gray-500 mb-4">
              {board.description}
            </p>
            <div className="pt-4 border-t border-gray-100">
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                <Plus className="w-5 h-5" />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'Feature Request', 'Bug Report', 'General'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeFilter === cat 
                    ? 'bg-blue-100 text-blue-600 border border-blue-200' 
                    : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* --- Main Content (Feedback Feed) --- */}
        <section className="flex-1">
          
          {/* Sort & Search Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search Posts..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-500">Sort by:</span>
              <button className="flex items-center text-sm font-bold text-gray-900 hover:text-blue-600 transition">
                Most Upvoted
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {feedbackPosts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors flex gap-6">
                
                {/* Upvote Button */}
                <div className="flex flex-col items-center">
                  <button className="p-3 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 border border-gray-100 transition flex flex-col items-center group">
                    <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-sm font-bold mt-1">{post.upvotes}</span>
                  </button>
                </div>

                {/* Post Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded tracking-wide">
                      {post.category}
                    </span>
                    <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase rounded tracking-wide">
                      {post.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center text-gray-400 text-sm font-medium">
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    {post.comments} comments
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <button className="w-full mt-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition">
            Load More Feedback
          </button>
        </section>

      </main>
    </div>
  );
};

export default BoardHomePage;