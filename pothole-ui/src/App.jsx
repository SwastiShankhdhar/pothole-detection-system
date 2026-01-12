import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AccountType from "./pages/AccountType";
import Login from "./pages/Login";


function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/account-type" element={<AccountType />} />
<Route path="/login" element={<Login />} />
</Routes>
</BrowserRouter>
);
}


export default App;