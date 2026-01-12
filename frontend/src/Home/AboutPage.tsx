import { MessageCircle, ShieldCheck, Heart, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/" className="flex items-center text-blue-600 font-bold group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Boards
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
            <MessageCircle className="text-white w-8 h-8" fill="currentColor" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">The Internet's Suggestion Box</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We built this because sometimes you have something to say, but nowhere to say it. 
            No accounts, no followers, no social pressure. Just honest feedback on the things that matter to you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="text-center">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Truly Anonymous</h3>
            <p className="text-gray-500 text-sm">We don't track who you are. We just care what you have to say.</p>
          </div>
          <div className="text-center">
            <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Community Led</h3>
            <p className="text-gray-500 text-sm">Upvote the ideas that matter. The community decides what's important.</p>
          </div>
          <div className="text-center">
            <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Open to All</h3>
            <p className="text-gray-500 text-sm">From local park ideas to website bugs—create a board for anything.</p>
          </div>
        </div>

        {/*<div className="bg-gray-50 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Start a conversation today.</h2>
          <p className="text-gray-500 mb-8 font-medium">It takes less than 30 seconds to create your own feedback board.</p>
          <Link to="/create-board" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 inline-block">
            Create a Board
          </Link>
        </div>*/}
      </main>
    </div>
  );
};

export default AboutPage;