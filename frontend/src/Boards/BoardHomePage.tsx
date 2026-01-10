import React, { useEffect, useState } from 'react';
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
import { supabase } from '../Auth/supabase';
import { useParams, Link } from 'react-router-dom'; // Added Link for nav
import type { post } from '../Posts/Post';
import { useNavigate } from 'react-router-dom';
import { getBoardById, subscribeToBoard, unsubscribeFromBoard } from './requests';
import { getPostsByBoardId, voteOnPost } from '../Posts/requests';

import type { Board } from './Board';
import { useAuth } from '../Auth/AuthContext';
export const sortOptions = {
    MOST_UPVOTED : "Most Upvoted",
    NEWEST : "Newest",
    OLDEST : "Oldest",
} as const;

export type SortOption = typeof sortOptions[keyof typeof sortOptions];

const BoardHomePage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const { boardId } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board>();
  const [posts, setPosts] = useState<post[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<SortOption>(sortOptions.NEWEST);

  // maps postid to upvote count
  const [upVotes, setUpvotes] = useState<Record<number, number>>({});

  // maps postid to whether user has upvoted the post
  const [userHasUpvoted, setUserHasUpvoted] = useState<Record<number, boolean>>({});
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [showSubscribePopup, setShowSubscribePopup] = useState<boolean>(false);

  console.log("BOARD ID FROM PARAMS: ", boardId);

  // Find the board info based on the URL ID
  //const board = boardsData.find(b => b.id.toString() === boardId);
  
  useEffect(() => {
    const fetchBoardData = async () => {
      if (boardId) {
        try {
          const data = await getBoardById(Number(boardId));
          setBoard(data);
          // You can set this data to state if needed
        } catch (error) {
          console.error("Error fetching board data:", error);
        }
      }
    }
    const fetchPostsData = async () => {
      if (boardId) {
        try {
          const posts = await getPostsByBoardId(Number(boardId));
          console.log("FETCHED POSTS DATA: ", posts);
          setPosts(posts);
        }
        catch(error) {
          console.error("Error fetching posts data:", error);
        }
      }
    }
      fetchBoardData();
      fetchPostsData();
  },[]);

  useEffect(() => {
    const checkSubscription = async (board : Board) => {
      const { data: { user} } = await supabase.auth.getUser();
      if (!user) return;
      setSubscribed(board.members.includes(user.id));
    }
    if (board) {
      checkSubscription(board);
    }
  },[board])

  useEffect(() => {
    if (posts.length > 0) { 
      const upvotesMap = posts.reduce((acc, post) => {
        acc[post.id] = post.upVotes;
        return acc;
      }, {} as Record<number, number>);

      const userUpvotedMap = posts.reduce((acc, post) => {
        acc[post.id] = post.userHasUpvoted;
        return acc;
      }, {} as Record<number, boolean>);

      setUserHasUpvoted(userUpvotedMap);
      setUpvotes(upvotesMap);

    }


  },[posts])

  const filteredPosts = activeFilter === "All" ? posts : posts.filter(post => post.category === activeFilter)

  const sortedPosts = [...filteredPosts].sort((a,b) => {
    switch (selected) {
      case sortOptions.NEWEST:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case sortOptions.OLDEST:
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case sortOptions.MOST_UPVOTED:
        return b.upVotes - a.upVotes;
      default:
        return 0;
    }
  })

  const handleVote = async (postId : number) => {
    try {
      console.log("Voting on post with ID: ", postId);
      const result = await voteOnPost(postId);
      console.log("VOTE RESULT:", result);
      setPosts(prev => 
        prev.map(p => 
          p.id == postId
          ? { ...p, upVotes: result.upVotes, userHasUpvoted: result.userUpvoted}
          : p
        )
      );
      setUpvotes(prev => ({
        ...prev,
        [postId]: result.upVotes
      }));
      setUserHasUpvoted(prev => ({
        ...prev,
        [postId]: result.userUpvoted
      }));
    }
    catch (error) {
      console.error("Error voting on post:", error);
    }
  }
  

  
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
  const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error.message);
        return;
      }
  }
  
  const handleSubscribe = async (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if(!session) {
      navigate("/login");
      return;
    }

    console.log("Subscribed to board with id: ", board.id);
    try {
      await subscribeToBoard(board.id);
      setSubscribed(true);
    }
    catch (error) {
      console.error("Error subscribing to board: ", error);
    }
  }

  const handleUnsubscribe = async (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("unsubscribing from board with id: ", board.id);
    try {
      await unsubscribeFromBoard(board.id);
      setSubscribed(false);
    }
    catch (error) {
      console.error("Error unsubscribing to board: ", error);
    }
  }

  const handleCreatePost = async (e : React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    console.log("nav to post creation");
    if (!subscribed) {
      // display a pop up that says I need to subscribe before I post on this board
      setShowSubscribePopup(true);
      return
    }
    else {
      navigate(`/board/${boardId}/create-post`)
    }
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

          { session ? (
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                Log In
              </button>
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
        
        {/* --- Sidebar (Filters & Info) --- */}
        <aside className="w-full md:w-64 space-y-6">
          {/* DYNAMIC Board Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{board.name}</h1>
            <p className="text-sm text-gray-500 mb-4">
              {board.description}
            </p>

            {!subscribed ? (
              <button
                className={`w-full mb-3 py-2.5 rounded-xl font-semibold transition
                     bg-blue-600 text-white hover:bg-blue-700`}
                     onClick = {handleSubscribe}
              >
                Subscribe
              </button>
            ) : (
              <button
                className={`w-full mb-3 py-2.5 rounded-xl font-semibold transition
                     bg-red-600 text-white hover:bg-blue-700`}
                     onClick = {handleUnsubscribe}
              >
                Unsubscribe
              </button>
            )}

            <div className="pt-4 border-t border-gray-100">
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
              onClick={handleCreatePost}>
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
              <button
                onClick={() => setActiveFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeFilter === 'All'
                    ? 'bg-blue-100 text-blue-600 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                >
                All
              </button>
              {board.categories.map((cat) => (
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
            
            <div className="relative flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-500">Sort by:</span>
              <button
                className="flex items-center text-sm font-bold text-gray-900 hover:text-blue-600 transition"
                onClick={() => setOpen(o => !o)}
              >
                {selected}
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {open && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {Object.values(sortOptions).map(option => (
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

          {/* Feedback List */}
          <div className="space-y-4">
            {sortedPosts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors flex gap-6">
                
                {/* Upvote Button */}
                <div className="flex flex-col items-center">
                  <button className="p-3 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 border border-gray-100 transition flex flex-col items-center group"
                  onClick={() => handleVote(post.id)}>
                    <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-sm font-bold mt-1">{upVotes[post.id] ?? 0}</span>
                  </button>
                </div>

                {/* Post Content */}
                <Link to={`/board/${boardId}/post/${post.id}`} className="flex-1">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded tracking-wide">
                      {post.category}
                    </span>
                    
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {post.message}
                  </p>

                  <div className="flex items-center text-gray-400 text-sm font-medium">
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    {post.comments.length} comments
                  </div>
                </div>
                </Link>


              </div>
            ))}
          </div>

          {/* Load More */}
          <button className="w-full mt-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition">
            Load More Feedback
          </button>
        </section>

      </main>

      {showSubscribePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Subscribe required
            </h2>

            <p className="text-gray-600 mb-4">
              You must subscribe to this board before creating a post.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowSubscribePopup(false)}
                className="flex-1 py-2 rounded-lg border border-gray-300 font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={(event) => {
                  handleSubscribe(event);
                  setShowSubscribePopup(false);
                }}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardHomePage;