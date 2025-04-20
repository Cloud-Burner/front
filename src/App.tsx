import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FpgaPage from "./pages/FpgaPage";
import MicroPage from "./pages/MicroPage";
import SingleBoardPage from "./pages/SingleBoardPage";
import ResultsPage from "./pages/ResultsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Layout>
                    <Routes>
                        {/* Публичные маршруты */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Защищённые маршруты */}
                        <Route path="/fpga" element={<PrivateRoute><FpgaPage /></PrivateRoute>} />
                        <Route path="/micro" element={<PrivateRoute><MicroPage /></PrivateRoute>} />
                        <Route path="/single-board" element={<PrivateRoute><SingleBoardPage /></PrivateRoute>} />
                        <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    </Routes>
                </Layout>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;