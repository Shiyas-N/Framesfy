import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./assets/LandingPage";
import CampaignPage from "./assets/CampaignPage";
import ResultPage from "./assets/ResultPage";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/campaign" element={<CampaignPage />} />
        <Route path="/campaign/result" element={<ResultPage />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
