import { Routes, Route } from "react-router-dom";
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
import TerminalPage from "./pages/TerminalPage";
import StreamWithTerminal from "./pages/TerminalVideoPage.tsx";
import FpgaControlPage from "./pages/FpgaControlPage.tsx";
import FpgaDocPage from "./pages/FpgaDocPage.tsx";
import MicroDocPage from "./pages/MicroDocPage.tsx";
import SingleBoardDocPage from "./pages/SIngleBoardDocPage.tsx";
import ResultsDocPage from "./pages/ResultsDocPage.tsx";
import ErrorResultPage from "./pages/ErrorResultPage.tsx";


function App() {
    return (
        <Routes>
            {/* Всё приложение обёрнуто в Layout */}
            <Route element={<Layout />}>
                {/* Публичные маршруты */}
                <Route path="/terminal" element={<TerminalPage />} />
                {/*<Route path="/rpi/session" element={<StreamWithTerminal />} />*/}
                <Route path="/fpga/session" element={<FpgaControlPage />} />

                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/docs/fpga" element={<FpgaDocPage />} />
                <Route path="/docs/micro" element={<MicroDocPage />} />
                <Route path="/docs/single-board" element={<SingleBoardDocPage />} />
                <Route path="/docs/results" element={<ResultsDocPage />} />
                <Route path="/result/error" element={<ErrorResultPage />} />


                {/* Защищённые маршруты */}
                <Route path="/rpi/session"  element={<PrivateRoute><StreamWithTerminal /></PrivateRoute>} />
                <Route path="/fpga" element={<PrivateRoute><FpgaPage /></PrivateRoute>} />
                <Route path="/micro" element={<PrivateRoute><MicroPage /></PrivateRoute>} />
                <Route path="/single-board" element={<PrivateRoute><SingleBoardPage /></PrivateRoute>} />
                <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            </Route>
        </Routes>
    );
}

export default App;