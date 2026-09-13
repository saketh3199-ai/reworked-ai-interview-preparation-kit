
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import CreateKit from "./pages/CreateKit";
import KitDetails from "./pages/KitDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import KitBuilder from "./pages/KitBuilder";
import Practice from "./pages/Practice";


function App()
{
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create-kit" element={<CreateKit />} />
                    <Route path="/kit/:kitId" element={<KitDetails />} />
                    <Route path="/kit/:kitId/edit" element={<KitBuilder />} />
                    <Route path="/kit/:kitId/practice" element={<Practice />} />
                </Route>

                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;

