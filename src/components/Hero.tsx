import { useAuth0 } from "@auth0/auth0-react";
import brainly from "../assets/brainly.png";
import { GetStarted } from "./ui/getStarted";
import { FlipWords } from "./ui/flip-words";

export function Hero() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="mt-36 mx-10 md:mx-20 flex flex-col md:flex-row justify-between items-center">
      <div className="text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 block pb-1">
            Your Knowledge,
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 block pb-1">
            Perfectly Organized!
          </span>
        </h1>

        <div className="mt-8 md:mt-16">
          <p className="text-2xl md:text-3xl font-medium text-gray-400">
            Dump all your{" "}
            <span className="text-white">
              <FlipWords
                words={["notes", "links", "thoughts"]}
                duration={1000}
              />
            </span>
          </p>
          <p className="text-xl md:text-2xl text-gray-300">
            together in one place.
          </p>
        </div>

        <div className="mt-12">
          <GetStarted onClick={() => loginWithRedirect()} />
        </div>
      </div>

      <div className="mt-12 md:mt-0">
        <img
          src={brainly}
          alt="Brainly App"
          className="max-w-full h-auto md:max-w-lg"
        />
      </div>
    </div>
  );
}
