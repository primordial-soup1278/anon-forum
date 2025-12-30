import React, { useState } from 'react';
import { MessageCircle, Check, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { createBoardRequest } from './Board';
import { createBoard } from './requests';
import type { Board } from './Board';

const CreateBoardPage = () => {
  const [boardName, setBoardName] = useState('');
  const [description, setDescription] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [isUrlAvailable, setIsUrlAvailable] = useState(true);

  const navigate = useNavigate();
  
  // Category Logic States
  const [categoryInput, setCategoryInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const [privacy, setPrivacy] = useState('Public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Category Handlers ---
  const addCategory = (e : any) => {
    if (e) e.preventDefault(); // Prevent form submission if triggered by button
    
    const trimmedInput = categoryInput.trim();
    
    // Validation: Not empty, not a duplicate, and under the limit of 5
    if (trimmedInput && 
        !selectedCategories.includes(trimmedInput) && 
        selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, trimmedInput]);
      setCategoryInput('');
    }
  };

  const removeCategory = (categoryToRemove : any) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryToRemove));
  };

  const handleKeyDown = (e : any) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Stop form from submitting
      addCategory();
    }
  };

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Creating board with:', { boardName, description, customUrl, selectedCategories, privacy });
    
    try {
      const boardData: createBoardRequest = {
        name: boardName,
        description: description,
        categories: selectedCategories,
        members: []
      };
      console.log("BOARD: ", boardData);
      await createBoard(boardData)
    }
    catch (error) {
      console.error("Error creating board:", error)
    }
    finally {
      setIsSubmitting(false);
    }

    // Simulate API call
    /*setTimeout(() => {
      alert(`Board '${boardName}' created with categories: ${selectedCategories.join(', ')}`);
      setIsSubmitting(false);
    }, 1500);*/
  };

  const handleUrlChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setCustomUrl(value);
    setIsUrlAvailable(value.length > 3 && value !== 'admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-10">
        
        <div className="flex items-center space-x-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-full">
            <MessageCircle className="text-white h-5 w-5" fill="currentColor" />
          </div>
          <span className="text-lg font-bold text-gray-900">Anonymous Feedback</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create a New Feedback Board</h1>
        <p className="text-gray-500 mb-8">Set up your space to start collecting honest feedback.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Board Name & Description (Keep same as your previous code) */}
          <div>
            <label htmlFor="boardName" className="block text-sm font-semibold text-gray-700 mb-1">Board Name</label>
            <input
              id="boardName"
              type="text"
              placeholder="e.g., Website Redesign Q4 Ideas"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              rows="3"
              placeholder="A detailed space for the feedback on the redesign."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* DYNAMIC CATEGORIES SECTION */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">Categories</label>
              <span className={`text-xs font-bold ${selectedCategories.length === 5 ? 'text-orange-500' : 'text-gray-400'}`}>
                {selectedCategories.length} / 5
              </span>
            </div>
            
            {/* Input and Add Button */}
            <div className="flex space-x-2 mb-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={selectedCategories.length >= 5 ? "Limit reached" : "Add category (e.g. Design, Bug)"}
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={selectedCategories.length >= 5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="button"
                onClick={addCategory}
                disabled={!categoryInput.trim() || selectedCategories.length >= 5}
                className="bg-gray-900 text-white px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 transition flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Tags Display Area */}
            <div className="flex flex-wrap gap-2 min-h-[32px]">
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-bold border border-blue-100 animate-in fade-in zoom-in duration-200"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="hover:text-red-500 transition-colors p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {selectedCategories.length === 0 && (
                <p className="text-gray-400 text-xs italic">No categories added yet.</p>
              )}
            </div>
          </div>

          {/* Custom URL, Privacy, and Submit (Keep same as your previous code) */}
          {/* ... */}

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              className="px-6 py-2.5 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              onClick = {() => navigate("/browse")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isUrlAvailable}
              className={`px-8 py-2.5 rounded-lg font-bold text-white shadow-md transition ${
                isSubmitting || !isUrlAvailable
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardPage;