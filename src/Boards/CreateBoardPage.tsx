import React, { useState } from 'react';
import { MessageCircle, Check } from 'lucide-react';

const CreateBoardPage = () => {
  const [boardName, setBoardName] = useState('');
  const [description, setDescription] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [isUrlAvailable, setIsUrlAvailable] = useState(true); // Mock state for URL validation
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [privacy, setPrivacy] = useState('Public'); // 'Public' or 'Private'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCategories = ['Feature Request', 'Bug Report', 'General Feedback', 'Design'];

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Creating board with:', { boardName, description, customUrl, selectedCategories, privacy });
    
    // Placeholder for API call
    setTimeout(() => {
      alert(`Board '${boardName}' created!`);
      setIsSubmitting(false);
      // In a real app, you would redirect to the new board page
    }, 1500);
  };

  // Mock URL validation based on input change
  const handleUrlChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setCustomUrl(value);
    // Simulate API call for availability check
    setIsUrlAvailable(value.length > 3 && value !== 'admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      
      {/* Main Form Card */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-10">
        
        {/* Header/Branding */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-full">
            <MessageCircle className="text-white h-5 w-5" fill="currentColor" />
          </div>
          <span className="text-lg font-bold text-gray-900">Anonymous Feedback</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create a New Feedback Board</h1>
        <p className="text-gray-500 mb-8">
          Set up your space to start collecting honest feedback.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Board Name */}
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

          {/* Description */}
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

          {/* Custom URL */}
          <div>
            <label htmlFor="customUrl" className="block text-sm font-semibold text-gray-700 mb-1">Custom URL</label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">anonfeedback.com/</span>
              <div className="relative flex-1">
                <input
                  id="customUrl"
                  type="text"
                  placeholder="your-board-name"
                  value={customUrl}
                  onChange={handleUrlChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition ${isUrlAvailable ? 'border-gray-300' : 'border-red-500'}`}
                />
                {isUrlAvailable && customUrl.length > 0 && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
                {!isUrlAvailable && customUrl.length > 0 && (
                   <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 font-bold text-lg">!</span>
                )}
              </div>
            </div>
            {!isUrlAvailable && customUrl.length > 0 && (
              <p className="text-xs text-red-500 mt-1">URL not available or too short.</p>
            )}
          </div>

          {/* Categories (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categories (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-4 py-2 text-sm rounded-full font-medium transition ${
                    selectedCategories.includes(cat)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Privacy</label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="public"
                  type="radio"
                  name="privacy"
                  value="Public"
                  checked={privacy === 'Public'}
                  onChange={() => setPrivacy('Public')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="public" className="ml-3 text-sm font-medium text-gray-700">
                  Public <span className="text-gray-500">(Anyone can post anonymously)</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="private"
                  type="radio"
                  name="privacy"
                  value="Private"
                  checked={privacy === 'Private'}
                  onChange={() => setPrivacy('Private')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="private" className="ml-3 text-sm font-medium text-gray-700">
                  Private <span className="text-gray-500">(Invite-only access)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              className="px-6 py-2.5 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              onClick={() => console.log('Cancelled')} // Replace with actual cancel/close logic
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