import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteIcon } from "./ui/DeleteIcon";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { cardsState } from "@/atoms";
import { useToast } from "@/hooks/use-toast";

export function DeleteContentButton({ id }: { id: string }) {
  const { getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();
  const setCards = useSetRecoilState(cardsState);
  const handleDelete = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/content/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCards((prevCards) => prevCards.filter((card) => card._id !== id));
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete content. Please try again.",
        duration: 1000,
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <button>
          <DeleteIcon />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
