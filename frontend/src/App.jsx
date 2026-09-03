import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing/Landing";
import AdminHome from "./pages/home/AdminHome";
import Login from "./pages/auth/Login";
import ChangePassword from "./pages/auth/ChangePassword";
import ClientList from "./pages/clientes/clientList";
import NewClient from "./pages/clientes/newClient";
import EditClient from "./pages/clientes/editClient";
import LoungeList from "./pageslounges/lounges/loungeList";
import NewLounge from "./pageslounges/lounges/newLounge";
import EditLounge from "./pageslounges/lounges/editLounge";
import LoungeTypeList from "./pageslounges/loungetypes/loungeTypeList";
import NewLoungeType from "./pageslounges/loungetypes/newLoungeType";
import EditLoungeType from "./pageslounges/loungetypes/editLoungeType";

import "./App.css";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Landing />} />
                <Route path="/admin-home" element={<AdminHome />} />

                <Route path="/login" element={<Login />} />
                <Route path="/cambiar-password" element={<ChangePassword />} />

                <Route path="/client" element={<ClientList />} />

                <Route path="/client/new" element={<NewClient />} />

                <Route path="/client/edit/:id" element={<EditClient />} />

                <Route path="/lounge" element={<LoungeList />} />
                <Route path="/lounge/new" element={<NewLounge />} />
                <Route path="/lounge/edit/:id" element={<EditLounge />} />

                <Route path="/loungeType" element={<LoungeTypeList />} />
                <Route path="/loungeType/new" element={<NewLoungeType />} />
                <Route path="/loungeType/edit/:id" element={<EditLoungeType />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
