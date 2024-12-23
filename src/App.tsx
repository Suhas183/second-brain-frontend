import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { LandingPage } from "./components/Landing";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { RecoilRoot } from "recoil";

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
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to={"/dashboard"} />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to={"/"} />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
