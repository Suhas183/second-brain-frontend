import { Hero } from "./Hero";
import { Header } from "./Header";
import { BackgroundLines } from "./ui/background-lines";
import { Footer } from "./Footer";

export function LandingPage() {
  return (
    <BackgroundLines className="px-24 pt-6">
      <div className="flex flex-col min-h-[95vh]">
        <Header />
        <div className="pt-6 overflow-hidden flex-grow">
          <Hero />
        </div>
        <Footer />
      </div>
    </BackgroundLines>
  );
}
