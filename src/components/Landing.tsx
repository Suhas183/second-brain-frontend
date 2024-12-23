import { Hero } from "./Hero";
import { BackgroundLines } from "./ui/background-lines";

export function LandingPage() {
  return (
    <BackgroundLines>
      <div className="px-24 pt-12 overflow-hidden">
        <Hero />
      </div>
    </BackgroundLines>
  );
}
