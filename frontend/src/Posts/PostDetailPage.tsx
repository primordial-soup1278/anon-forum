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
import {useEffect}  from 'react';
import type { post } from './Post';
import { getPostById, createComment, getCommentsByPostId, voteOnPost } from './requests';
import { getBoardById } from '../Boards/requests';
import type { board, createBoardRequest } from '../Boards/Board';
import type { comment, createCommentRequest } from './Comment';
import { useAuth } from '../Auth/AuthContext';
import { supabase } from '../Auth/supabase';
const PostDetailPage = () => {
  const { boardId, postId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [comment, setComment] = useState('');
  const [postData, setPostData] = useState<post>();
  const [board, setBoard] = useState<board>();
  const [comments, setComments] = useState<comment[]>([]);

  const [upVotes, setUpvotes] = useState<number>(0);
  const [userHasUpvoted, setUserHasUpvoted] = useState<boolean>(false);

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
    
    const fetchCommentData = async () => {
      try {
        const data = await getCommentsByPostId(Number(postId));
        console.log("FETCHED COMMENTS DATA: ", data);
        setComments(data);
      }
      catch(error) {
        console.error("Error fetching comments data:", error);
      }
    }

    fetchBoardData();
    fetchPostData();
    fetchCommentData();

  },[]);

  useEffect(() => {
    if (postData) {
      setUpvotes(postData.upVotes);
      setUserHasUpvoted(postData.userHasUpvoted);
    }
  }, [postData]);


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log(`Submitting comment for post ${postId}: ${comment}`);
    setComment('');
    // Add logic to prepend new comment to list

    try {
      const commentData : createCommentRequest = {
        content : comment,
      }
      console.log("COMMENT DATA TO SEND: ", commentData);
      const newComment = await createComment(Number(postId), commentData);
      setComments((prev) => [newComment, ...prev]);

      setComment('');
    }
    catch(error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleUpvote = async () => {
    try {
      console.log("Upvoting post with ID: ", postId);
      const result = await voteOnPost(Number(postId));
      setUpvotes(result.upVotes);
      setUserHasUpvoted(result.userHasUpvoted);
    }
    catch(error) {
      console.error("Error upvoting post:", error);
    }
  }


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();  
    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }
  }

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
          { session ? (
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={handleLogout}>
            Log Out
          </button>
          ) : (
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => navigate("/login")}>
            Log In
          </button>
          )
          }     
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
              <button className={`p-3 rounded-xl border transition flex flex-col items-center scale-110
                ${userHasUpvoted
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"}
                  `} 
              onClick={handleUpvote}>
                <ArrowUp className="w-6 h-6" />
                <span className="text-lg font-bold mt-1">{upVotes}</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded-full tracking-wide">
                  {postData.category}
                </span>
                <span className="flex items-center text-gray-400 text-sm font-medium ml-auto">
                  <Clock className="w-4 h-4 mr-1.5" /> {new Date(postData.createdAt).toLocaleDateString()}
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
              Discussion ({comments.length})
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

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className={`p-6 rounded-2xl border  bg-white border-gray-100 shadow-sm`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg bg-gray-100`}>
                        <User className={`w-4 h-4 text-gray-500`} />
                      </div>
                      <span className={`font-bold text-gray-900`}>
                        {comment.authorId} 
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className={`leading-relaxed text-gray-700`}>{comment.content}</p>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default PostDetailPage;