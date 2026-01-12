import { Shield, Lock, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link to="/" className="flex items-center text-blue-600 font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold mb-4">Privacy & Anonymity</h1>
        <p className="text-gray-500 mb-12 text-lg">Last updated: December 2025</p>

        <section className="space-y-12">
          {/* Section 1 */}
          <div className="flex gap-6">
            <div className="bg-blue-50 p-3 rounded-2xl h-fit text-blue-600">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">What "Anonymous" Means</h3>
              <p className="text-gray-600 leading-relaxed">
                When you post feedback or a comment, we do not display your name, email, or profile. 
                Other users and board creators cannot see who you are. We do not sell your data to 
                advertisers because we don't collect "identity data" in the first place.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex gap-6">
            <div className="bg-green-50 p-3 rounded-2xl h-fit text-green-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Data Retention</h3>
              <p className="text-gray-600 leading-relaxed">
                We store the content of your posts and your upvotes. We do not log IP addresses 
                long-term. Temporary logs are kept for 24 hours solely to prevent spam and 
                automated "bot" attacks, after which they are purged.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex gap-6">
            <div className="bg-purple-50 p-3 rounded-2xl h-fit text-purple-600">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Cookies</h3>
              <p className="text-gray-600 leading-relaxed">
                We use essential cookies to keep you logged into your account (if you choose to create one). 
                We do not use tracking cookies that follow you across the web.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-20 pt-10 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm">
            Questions about your data? Contact us at privacy@yourdomain.com
          </p>
        </footer>
      </main>
    </div>
  );
};

export default PrivacyPage;