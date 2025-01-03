import { useAuth0 } from "@auth0/auth0-react";
import brainly from "../assets/brainly.png";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { loginWithRedirect, isAuthenticated, logout, isLoading } = useAuth0();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };
  return (
    <header className="pt-6 flex justify-between items-center relative z-10">
      <div
        onClick={handleClick}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img className="h-16 w-16" src={brainly} alt="logo" />
        <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Brainly
        </h2>
      </div>
      {isLoading || !isAuthenticated ? (
        <button
          className="cursor-pointer px-6 text-xl py-2 rounded-xl border border-neutral-600 text-black bg-white hover:bg-gray-100 transition duration-200"
          onClick={() => loginWithRedirect()}
        >
          Sign In
        </button>
      ) : (
        <button
          className="cursor-pointer px-6 py-2 text-xl rounded-xl border border-neutral-600 text-black bg-white hover:bg-gray-100 transition duration-200"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Logout
        </button>
      )}
    </header>
  );
}
