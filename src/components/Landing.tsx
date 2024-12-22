import { Header } from "./Header"
import { Hero } from "./Hero"

export function LandingPage(){
    return(
        <div className="px-24 pt-12 overflow-hidden">
            <Header />
            <Hero />
        </div>
    )
}