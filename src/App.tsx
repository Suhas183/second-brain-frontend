import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { LandingPage } from "./components/Landing";
import { Dashboard } from "./components/Dashboard";
import { RecoilRoot } from "recoil";
import { ShareBrain } from "./components/ShareBrainComponent";
import NotFoundPage from "./components/NotFound_404";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <ClipLoader
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }

  return (
    <RecoilRoot>
      <BrowserRouter>
        <div>
          <Routes>
            {/* Unauthenticated Route */}
            <Route path="/share/brain/:id" element={<ShareBrain />} />

            {/* Authenticated Routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
              }
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
