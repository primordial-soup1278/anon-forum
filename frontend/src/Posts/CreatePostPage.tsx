import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send, ShieldCheck, Info } from 'lucide-react';
import { boardsData } from '../Boards/mockBoards'; // Ensure path is correct
import { getBoardById } from '../Boards/requests';
import type { Board } from '../Boards/Board';
const CreatePostPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  
  const [board, setBoard] = useState<Board>();
  // Find the board to display its name
  //const board = boardsData.find(b => b.id.toString() === boardId);

  useEffect(() => {
    const fetchBoardData = async () => {
      if (boardId) {
        try {
          const data = await getBoardById(Number(boardId));
          console.log("FETCHED BOARD DATA: ", data);
          setBoard(data);
          // You can set this data to state if needed
        } catch (error) {
          console.error("Error fetching board data:", error);
        }
      }
    }
    fetchBoardData();
  },[]);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Feature Request');
  const [isAgreed, setIsAgreed] = useState(false);

  const categories = board?.categories;

  const handleSubmit = (e : any) => {
    e.preventDefault();
    if (!isAgreed) return alert("Please agree to the guidelines.");
    
    console.log("Submitting Post:", { title, description, category, boardId });
    // After logic, go back to the board
    navigate(`/board/${boardId}`);
  };

  if (!board) return <div className="p-10 text-center">Board not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- Simple Header --- */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 mb-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Board
          </button>
        </div>
      </header>

      {/* --- Main Form Card --- */}
      <main className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create a New Post</h1>
            <p className="text-slate-400 font-medium flex items-center">
              Posting to: <span className="text-slate-600 ml-1">{board.name}</span> 
              <span className="ml-2 text-[10px] bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">Anonymous</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Input */}
            <div>
              <input 
                type="text" 
                placeholder="Title"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition text-lg font-medium"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description Textarea */}
            <div>
              <textarea 
                placeholder="Description"
                rows="5"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                      category === cat 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Submission Area */}
            <div className="pt-6 border-t border-slate-100 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                
                <button 
                  type="button"
                  className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  Post Anonymously
                </button>
              </div>

              {/* Guidelines Checkbox */}
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePostPage;