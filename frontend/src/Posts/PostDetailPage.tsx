import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  ArrowUp, 
  MessageSquare, 
  ArrowLeft, 
  Send,
  User,
  Clock
} from 'lucide-react';
import { boardsData } from '../Boards/mockBoards';
import {useEffect}  from 'react';
import type { post } from './Post';
import { getPostById } from './requests';
import { getBoardById } from '../Boards/requests';
import type { board } from '../Boards/Board';
const PostDetailPage = () => {
  const { boardId, postId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [postData, setPostData] = useState<post>();
  const [board, setBoard] = useState<board>();
  // 1. Find the board context
  //const board = boardsData.find(b => b.id.toString() === boardId);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        if (boardId) {
          const data = await getBoardById(Number(boardId));
          setBoard(data);
        }
      }
      catch(e) {
        console.error("Error in fetchBoardData: ", e);
      }
    };

    const fetchPostData = async () => {
      try {
        const data = await getPostById(Number(postId));
        setPostData(data);
      }
      catch(error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchBoardData();
    fetchPostData();

  },[]);
  // 2. Mock Data for this specific post (In a real app, fetch based on postId)
  /*const post = {
    id: postId,
    title: "Add dark mode to the dashboard",
    message: "It would be great to have a dark mode option for late-night work sessions. The current white interface is quite bright and causes eye strain after long periods. A system-level preference sync would be ideal.",
    upvotes: 42,
    category: "Feature Request",
    status: "In Progress",
    createdAt: "2 days ago",
    comments: [
      { id: 1, user: "ANON", text: "Totally agree, this is my #1 request.", time: "1 day ago" },
      { id: 2, user: "ANON", text: "Please make it sync with the OS settings if possible!", time: "18 hours ago" },
      { id: 3, user: "ANON", text: "Thanks for the feedback! We've added this to our roadmap for Q3.", time: "5 hours ago", isAdmin: true },
    ]
  };*/

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log(`Submitting comment for post ${postId}: ${comment}`);
    setComment('');
    // Add logic to prepend new comment to list
  };

  if (!board) return <div className="p-10 text-center">Board not found.</div>;
  if (!postData) {
    return <div className="p-10 text-center">Loading post...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* --- Navigation --- */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/browse" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-full">
              <MessageCircle className="text-white h-5 w-5" fill="currentColor" />
            </div>
            <span className="text-lg font-bold">Anonymous Feedback</span>
          </Link>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Log In
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
        
        {/* --- Sidebar (Board Context) --- */}
        <aside className="w-full md:w-64 space-y-6 hidden md:block">
          {/* Back Button */}
          <button 
            onClick={() => navigate(`/board/${boardId}`)}
            className="flex items-center text-gray-500 hover:text-blue-600 font-medium transition mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {board.title}
          </button>

          {/* Board Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-80 hover:opacity-100 transition">
            <h1 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{board.title}</h1>
            <p className="text-sm text-gray-500 mb-4 line-clamp-3">
              {board.description}
            </p>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {board.posts} Posts
            </div>
          </div>
        </aside>

        {/* --- Main Content (The Post) --- */}
        <section className="flex-1 max-w-3xl">
          
          {/* Mobile Back Button */}
          <button 
            onClick={() => navigate(`/board/${boardId}`)}
            className="md:hidden flex items-center text-gray-500 hover:text-blue-600 font-medium transition mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Board
          </button>

          {/* The Main Post Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-100/20 border border-gray-100 mb-8 flex gap-6">
            {/* Upvote */}
            <div className="flex flex-col items-center">
              <button className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 transition flex flex-col items-center scale-110">
                <ArrowUp className="w-6 h-6" />
                <span className="text-lg font-bold mt-1">{postData.upVotes}</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded-full tracking-wide">
                  {postData.category}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase rounded-full tracking-wide flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  {postData.status}
                </span>
                <span className="flex items-center text-gray-400 text-sm font-medium ml-auto">
                  <Clock className="w-4 h-4 mr-1.5" /> {postData.createdAt}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                {postData.title}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {postData.message}
              </p>
            </div>
          </div>

          {/* --- Discussion Section --- */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Discussion ({postData.comments.length})
            </h3>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="bg-white p-2 pl-4 rounded-2xl shadow-sm border border-gray-100 flex items-center mb-8 focus-within:ring-2 ring-blue-100 transition">
              <textarea
                placeholder="Add to the discussion anonymously..."
                rows="1"
                className="flex-1 bg-transparent outline-none resize-none py-2 text-gray-700 m-1"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition shrink-0">
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* Comments List 
            <div className="space-y-4">
              {postData.comments.map((comment) => (
                <div key={comment.id} className={`p-6 rounded-2xl border ${comment.isAdmin ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${comment.isAdmin ? 'bg-blue-200' : 'bg-gray-100'}`}>
                        <User className={`w-4 h-4 ${comment.isAdmin ? 'text-blue-700' : 'text-gray-500'}`} />
                      </div>
                      <span className={`font-bold ${comment.isAdmin ? 'text-blue-700' : 'text-gray-900'}`}>
                        {comment.user} {comment.isAdmin && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded ml-1">Admin</span>}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">{comment.time}</span>
                  </div>
                  <p className={`leading-relaxed ${comment.isAdmin ? 'text-blue-900' : 'text-gray-700'}`}>{comment.text}</p>
                </div>
              ))}
            </div>*/}
          </div>

        </section>
      </main>
    </div>
  );
};

export default PostDetailPage;