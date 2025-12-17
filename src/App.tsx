import {Routes, Route} from "react-router-dom";
import LoginPage from "./Auth/LoginPage"
import SignupPage from "./Auth/SignupPage";
import HomePage from "./Home/Home";
import BoardBrowsePage from "./Boards/BoardBrowsePage";
import CreateBoardPage from "./Boards/CreateBoardPage";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/browse" element={<BoardBrowsePage />} />
            <Route path="/create-board" element={<CreateBoardPage />} />
        </Routes>
    );
}

export default App;