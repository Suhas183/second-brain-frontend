import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRecoilState } from "recoil";
import {
  cardsState,
  imageURLState,
  isPopoverOpenState,
  linkURLState,
  noteContentState,
  titleState,
  typeState,
} from "@/atoms";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { EditIcon } from "./ui/EditIcon";
import { Card } from "@/atoms";
import { useToast } from "@/hooks/use-toast";

type TypeOption = {
  value: "note" | "link" | "image"; // Restrict value to specific strings
  label: string; // Label is always a string
};

const types: TypeOption[] = [
  {
    value: "note",
    label: "Note",
  },
  {
    value: "link",
    label: "Link",
  },
];

export function EditContentButton({ id }: { id: string }) {
  // State for inputs
  const { getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();
  const [title, setTitle] = useRecoilState(titleState);
  const [type, setType] = useRecoilState(typeState);
  const [linkURL, setLinkURL] = useRecoilState(linkURLState);
  const [imageURL, setImageURL] = useRecoilState(imageURLState);
  const [noteContent, setNoteContent] = useRecoilState(noteContentState);
  const [isPopoverOpen, setPopoverOpen] = useRecoilState(isPopoverOpenState);
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useRecoilState(cardsState);

  const resetStates = () => {
    setTitle("");
    setType("link");
    setLinkURL("");
    setNoteContent("");
    setImageURL("");
  };

  // Handler for form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const card = cards.find((card) => card._id === id);
    const createdAt = card?.createdAt;
    const updatedCard = {
      title,
      type,
      ...(type === "link" && { linkURL }),
      ...(type === "image" && { imageURL }),
      ...(type === "note" && { noteContent }),
      createdAt,
      lastUpdatedAt: new Date(),
    };

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/content/${id}`,
        updatedCard,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedCardAdded = response.data.content;

      setCards((prevCards) => [
        updatedCardAdded,
        ...prevCards.filter((card) => card._id !== id),
      ]);
      resetStates();
      setOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to edit content. Please try again.",
        duration: 1000,
      });
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const setCardDetails = (card: Card) => {
      setTitle(card.title);
      setType(card.type);

      switch (card.type) {
        case "image":
          if (card.imageURL) setImageURL(card.imageURL);
          break;
        case "note":
          if (card.noteContent) setNoteContent(card.noteContent); // Corrected to setNoteContent
          break;
        case "link":
          if (card.linkURL) setLinkURL(card.linkURL); // Corrected to setLinkURL
          break;
        default:
          break;
      }
    };
    const card = cards.find((card) => card._id === id);
    if (card) setCardDetails(card);
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) resetStates();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <button>
          <EditIcon />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Edit a note here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Title Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="col-span-3"
              />
            </div>

            {/* Type Dropdown */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPopoverOpen}
                    className="w-[200px] justify-between"
                  >
                    {type
                      ? types.find((t) => t.value === type)?.label
                      : "Select Type"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search type..." />
                    <CommandList>
                      <CommandEmpty>No type found.</CommandEmpty>
                      <CommandGroup>
                        {types.map((t) => (
                          <CommandItem
                            key={t.value}
                            value={t.value}
                            onSelect={() => {
                              setType(t.value);
                              setPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                type === t.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {t.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Link URL Input */}
            {type === "link" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkURL" className="text-right">
                  Link URL
                </Label>
                <Input
                  id="linkURL"
                  value={linkURL}
                  onChange={(e) => setLinkURL(e.target.value)}
                  placeholder="Enter URL"
                  className="col-span-3"
                />
              </div>
            )}
            {type === "note" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="note" className="text-right">
                  Your note
                </Label>
                <Textarea
                  placeholder="Type your message here."
                  id="note"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="col-span-3 h-[150px]"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
