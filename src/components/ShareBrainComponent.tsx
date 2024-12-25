import { cardsState } from "@/atoms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  XEmbed,
  YouTubeEmbed,
  InstagramEmbed,
  PinterestEmbed,
  PlaceholderEmbed,
} from "react-social-media-embed";
import { useRecoilState } from "recoil";
import axios from "axios";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useParams } from "react-router-dom";
import { Header } from "./Header";
import bocchi_sad from "../assets/bocchi_sad.png";
import NotFoundPage from "./NotFound_404";
import { useToast } from "@/hooks/use-toast";

function getDomainFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname; // Returns the domain (e.g., "example.com")
  } catch {
    return null; // Return null if the URL is invalid
  }
}

export function ShareBrain() {
  const { id } = useParams();
  const { toast } = useToast();
  const [cards, setCards] = useRecoilState(cardsState);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/share/brain/${id}`
        );
        const cardsData = response.data.content;
        setCards(cardsData);
      } catch {
        setErr(true);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong!",
          duration: 1000,
        });
      }
    };
    fetchCards();
  }, [setCards]);

  if (err) {
    return <NotFoundPage />;
  }

  return (
    <div className="px-24 pt-6">
      <Header />
      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <h2 className="text-2xl font-semibold text-gray-500">
            No cards added yet!
          </h2>
          <img className="h-48 w-48" src={bocchi_sad} alt="logo" />
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
  );
}
