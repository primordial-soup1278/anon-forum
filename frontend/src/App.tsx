import {Routes, Route} from "react-router-dom";
import LoginPage from "./Auth/LoginPage"
import SignupPage from "./Auth/SignupPage";
import HomePage from "./Home/Home";
import BoardBrowsePage from "./Boards/BoardBrowsePage";
import CreateBoardPage from "./Boards/CreateBoardPage";
import BoardHomePage from "./Boards/BoardHomePage";
import AboutPage from "./Home/AboutPage";
import PrivacyPage from "./Home/PrivacyPage";
import CreatePostPage from "./Posts/CreatePostPage";
import PostDetailPage from "./Posts/PostDetailPage";
import { AuthProvider, useAuth } from "./Auth/AuthContext";

const AppRoutes = () => {

    const { session } = useAuth();
    
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/browse" element={<BoardBrowsePage />} />
            <Route path="/create-board" element={session ? <CreateBoardPage /> : <LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            {/*dynamic board route */}
            <Route path="/board/:boardId" element={<BoardHomePage />} />
            <Route path="/board/:boardId/create-post" element={session ? <CreatePostPage /> : <LoginPage />} />

            {/*post details page*/}
            <Route path="/board/:boardId/post/:postId" element={<PostDetailPage />} />
        </Routes>
    );
}

const App = () => {
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
}

export default App;