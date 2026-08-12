import { BrowserRouter, Routes, Route } from "react-router-dom";

import ClientList from "./pages/clientes/clientList";
import NewClient from "./pages/clientes/newClient";
import EditClient from "./pages/clientes/editClient";

import "./App.css";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/client" element={<ClientList />} />

                <Route path="/client/new" element={<NewClient />} />

                <Route path="/client/edit/:id" element={<EditClient />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
