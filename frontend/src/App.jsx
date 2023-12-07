import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./assets/LandingPage";
import CampaignPage from "./assets/CampaignPage";
import ResultPage from "./assets/ResultPage";
import CombinedComponent from "./assets/CombinedComponent";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/campaign/:user_id" element={<CampaignPage />} />
        <Route path="/campaign/result" element={<ResultPage />} />
        <Route path="/combine" element={<CombinedComponent />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
