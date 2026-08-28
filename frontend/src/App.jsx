import { BrowserRouter, Routes, Route } from "react-router-dom";

import ClientList from "./pages/clientes/clientList";
import NewClient from "./pages/clientes/newClient";
import EditClient from "./pages/clientes/editClient";
import LoungeList from "./pageslounges/lounges/loungeList";
import NewLounge from "./pageslounges/lounges/newLounge";
import EditLounge from "./pageslounges/lounges/editLounge";

import "./App.css";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/client" element={<ClientList />} />

                <Route path="/client/new" element={<NewClient />} />

                <Route path="/client/edit/:id" element={<EditClient />} />

                <Route path="/lounge" element={<LoungeList />} />
                <Route path="/lounge/new" element={<NewLounge />} />
                <Route path="/lounge/edit/:id" element={<EditLounge />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
