import { cardsState } from "@/atoms";
import { TopBar } from "./TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { XEmbed } from "react-social-media-embed";
import { useRecoilState } from "recoil";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { EditContentButton } from "./EditContent";
import { DeleteContentButton } from "./DeleteContent";

export function Dashboard() {
  const [cards, setCards] = useRecoilState(cardsState);
  const { getAccessTokenSilently } = useAuth0();

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
      } catch (err) {
        console.error(err);
      }
    };
    fetchCards();
  }, [getAccessTokenSilently, setCards]);

  return (
    <div className="px-24 pt-6">
      <TopBar />
      <div className="mt-6 grid grid-cols-3 justify-evenly items-center gap-y-4">
        {cards.map((card) => (
          <div key={card._id} className="flex justify-center items-center">
            <Card className="w-[350px] h-[450px] flex flex-col justify-between">
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between items-center">
                    <div className="truncate">{card.title}</div>
                    <div className="flex gap-1">
                      <EditContentButton id={card._id} />
                      <DeleteContentButton id={card._id} />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center flex-grow overflow-hidden">
                {card.linkURL && (
                  <div className="w-full h-full">
                    <XEmbed
                      url={card.linkURL}
                      width="100%"
                      height="100%"
                      key={card.linkURL}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
