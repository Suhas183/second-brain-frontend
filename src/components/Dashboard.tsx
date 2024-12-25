import { cardsState } from "@/atoms";
import { TopBar } from "./TopBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import {
  XEmbed,
  YouTubeEmbed,
  InstagramEmbed,
  PinterestEmbed,
  PlaceholderEmbed,
} from "react-social-media-embed";
import { useRecoilState } from "recoil";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { EditContentButton } from "./EditContent";
import { DeleteContentButton } from "./DeleteContent";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Header } from "./Header";
import bocchi_sad from "../assets/bocchi_sad.png";
import { Footer } from "./Footer";
import { Toaster } from "./ui/toaster";
import { useToast } from "@/hooks/use-toast";

function getDomainFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname; // Returns the domain (e.g., "example.com")
  } catch {
    return null; // Return null if the URL is invalid
  }
}

export function Dashboard() {
  const [cards, setCards] = useRecoilState(cardsState);
  const { getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/content`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const cardsData = response.data.content;
        setCards(cardsData);
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch content. Please Refresh!",
          duration: 1000,
        });
      }
    };
    fetchCards();
  }, [getAccessTokenSilently, setCards]);

  return (
    <div className="px-24 pt-6 flex flex-col min-h-[95vh]">
      <Header />
      <TopBar />
      <div className="flex-grow">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <h2 className="text-2xl font-semibold text-gray-500">
              No cards added yet!
            </h2>
            <img className="h-48 w-48" src={bocchi_sad} alt="logo" />
            <p className="text-gray-400 mt-2">
              Start by clicking on the <strong>Add Note</strong> button above.
            </p>
          </div>
        ) : (
          <ResponsiveMasonry
            className="mt-6"
            columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3 }}
          >
            <Masonry gutter="24px">
              {cards.map((card) => (
                <Card
                  key={card._id}
                  className="w-full min-h-[250px] flex flex-col justify-between group relative shadow-md"
                  style={{ breakInside: "avoid" }} // Ensure cards don't break between columns
                >
                  <CardHeader>
                    <CardTitle>
                      <div className="flex justify-between items-center">
                        <div className="truncate">{card.title}</div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <EditContentButton id={card._id} />
                          <DeleteContentButton id={card._id} />
                        </div>
                      </div>
                    </CardTitle>
                    {card.noteContent && (
                      <CardDescription className="mt-2 text-sm text-gray-600 overflow-y-scroll max-h-[160px] scrollbar-thin">
                        {card.noteContent}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {card.linkURL && (
                    <CardContent className="flex justify-center items-center flex-grow overflow-hidden">
                      <div className="w-full h-full">
                        {card.linkURL.includes("x.com") && (
                          <XEmbed
                            url={card.linkURL}
                            width="100%"
                            height="100%"
                            key={card.linkURL}
                          />
                        )}
                        {(card.linkURL.includes("youtube.com") ||
                          card.linkURL.includes("youtu.be")) && (
                          <YouTubeEmbed
                            url={card.linkURL}
                            width="100%"
                            height="100%"
                            key={card.linkURL}
                          />
                        )}
                        {card.linkURL.includes("instagram.com") && (
                          <InstagramEmbed
                            url={card.linkURL}
                            width="100%"
                            height="100%"
                            key={card.linkURL}
                          />
                        )}
                        {card.linkURL.includes("pinterest") && (
                          <PinterestEmbed
                            url={card.linkURL}
                            width="100%"
                            height="100%"
                            key={card.linkURL}
                          />
                        )}
                        {!(
                          card.linkURL.includes("x.com") ||
                          card.linkURL.includes("youtube.com") ||
                          card.linkURL.includes("youtu.be") ||
                          card.linkURL.includes("instagram.com") ||
                          card.linkURL.includes("pinterest")
                        ) && (
                          <PlaceholderEmbed
                            url={card.linkURL}
                            linkText={`View post on ${getDomainFromUrl(
                              card.linkURL
                            )}`}
                            style={{ height: "150px" }}
                            key={card.linkURL}
                            spinnerDisabled={true}
                          />
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </div>
      <Toaster />
      <Footer />
    </div>
  );
}
