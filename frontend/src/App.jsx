import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing/Landing";
import AdminHome from "./pages/home/AdminHome";
import ClientHome from "./pages/home/ClientHome";
import Login from "./pages/auth/Login";
import ChangePassword from "./pages/auth/ChangePassword";
import ClientList from "./pages/clientes/clientList";
import NewClient from "./pages/clientes/newClient";
import EditClient from "./pages/clientes/editClient";
import MyProfile from "./pages/clientes/MyProfile";
import LoungeList from "./pageslounges/lounges/loungeList";
import NewLounge from "./pageslounges/lounges/newLounge";
import EditLounge from "./pageslounges/lounges/editLounge";
import LoungeTypeList from "./pageslounges/loungetypes/loungeTypeList";
import NewLoungeType from "./pageslounges/loungetypes/newLoungeType";
import EditLoungeType from "./pageslounges/loungetypes/editLoungeType";
import ReservationList from "./pages/reservation/ReservationList";
import ReservationNew from "./pages/reservation/ReservationNew";
import ReservationEdit from "./pages/reservation/ReservationEdit";
import MyReservations from "./pages/reservation/MyReservations";
import ExtraServiceList from "./pages/extraService/extraServiceList";
import NewExtraService from "./pages/extraService/newExtraService";
import CardDetailList from "./pages/cardDetail/cardDetailList";
import NewCardDetail from "./pages/cardDetail/newCardDetail";
import EditCardDetail from "./pages/cardDetail/editCardDetail";

import "./App.css";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Landing />} />
                <Route path="/admin-home" element={<AdminHome />} />
                <Route path="/client-home" element={<ClientHome />} />

                <Route path="/login" element={<Login />} />
                <Route path="/cambiar-password" element={<ChangePassword />} />

                <Route path="/client" element={<ClientList />} />
                <Route path="/client/new" element={<NewClient />} />
                <Route path="/client/edit/:id" element={<EditClient />} />
                <Route path="/client/edit/me" element={<EditClient />} />
                <Route path="/my-profile" element={<MyProfile />} />

                <Route path="/lounge" element={<LoungeList />} />
                <Route path="/lounge/new" element={<NewLounge />} />
                <Route path="/lounge/edit/:id" element={<EditLounge />} />

                <Route path="/loungeType" element={<LoungeTypeList />} />
                <Route path="/loungeType/new" element={<NewLoungeType />} />
                <Route path="/loungeType/edit/:id" element={<EditLoungeType />} />

                <Route path="/reservation" element={<ReservationList />} />
                <Route path="/reservation/new" element={<ReservationNew />} />
                <Route path="/reservation/edit/:id" element={<ReservationEdit />} />
                <Route path="/my-reservations" element={<MyReservations />} />

                <Route path="/extraService" element={<ExtraServiceList />} />
                <Route path="/extraService/new" element={<NewExtraService />} />

                <Route path="/cardDetail" element={<CardDetailList />} />
                <Route path="/cardDetail/new" element={<NewCardDetail />} />
                <Route path="/cardDetail/edit/:id" element={<EditCardDetail />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;