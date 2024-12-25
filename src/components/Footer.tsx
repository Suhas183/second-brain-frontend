import heart from "../assets/heart.png";

export function Footer() {
  return (
    <footer className="flex items-center justify-center text-gray-400">
      <div className="flex items-center space-x-2">
        <span className="text-lg">Made with</span>
        <img src={heart} alt="love" className="h-6 w-6 animate-pulse" />
        <span className="text-lg">
          by{" "}
          <a href="https://x.com/suhas_183" target="_blank">
            suhas
          </a>
        </span>
      </div>
    </footer>
  );
}
