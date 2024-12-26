import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusIcon } from "./ui/PlusIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  cardsState,
  isPopoverOpenState,
  linkURLState,
  noteContentState,
  titleState,
  typeState,
} from "@/atoms";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type TypeOption = {
  value: "note" | "link" | "image";
  label: string;
};

const types: TypeOption[] = [
  { value: "link", label: "Link" },
  { value: "note", label: "Note" },
  { value: "image", label: "Image" },
];

export function AddContentButton() {
  const { getAccessTokenSilently } = useAuth0();
  const { toast } = useToast(); // Hook for showing toast notifications
  const [title, setTitle] = useRecoilState(titleState);
  const [type, setType] = useRecoilState(typeState);
  const [linkURL, setLinkURL] = useRecoilState(linkURLState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [noteContent, setNoteContent] = useRecoilState(noteContentState);
  const [isPopoverOpen, setPopoverOpen] = useRecoilState(isPopoverOpenState);
  const [open, setOpen] = useState(false);
  const setCards = useSetRecoilState(cardsState);

  const resetStates = () => {
    setTitle("");
    setType("link");
    setLinkURL("");
    setNoteContent("");
    setImageFile(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const createdAt = new Date();
    if (type === "image") {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      if (imageFile) formData.append("imageFile", imageFile);
      formData.append("createdAt", createdAt.toISOString());
      formData.append("updatedAt", createdAt.toISOString());

      try {
        const token = await getAccessTokenSilently();
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/content/image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newCardAdded = response.data.content;
        setCards((prevCards) => [newCardAdded, ...prevCards]);
        resetStates();
        setOpen(false);
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add content. Please try again.",
          duration: 1000,
        });
        resetStates();
        setOpen(false);
      }
    } else {
      const newCard = {
        title,
        type,
        ...(type === "link" && { linkURL }),
        ...(type === "note" && { noteContent }),
        createdAt,
        lastUpdatedAt: createdAt,
      };

      try {
        const token = await getAccessTokenSilently();
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/content`,
          newCard,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newCardAdded = response.data.content;
        setCards((prevCards) => [newCardAdded, ...prevCards]);

        // Reset state and close dialog
        resetStates();
        setOpen(false);
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add content. Please try again.",
          duration: 1000,
        });
        resetStates();
        setOpen(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Max image size should not exceed 5MB",
          duration: 1000,
        });
        e.target.value = "";
        setImageFile(null);
      } else {
        setImageFile(file);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetStates(); // Always reset states when dialog closes
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <button className="cursor-pointer px-2 py-2 rounded-md border border-neutral-600 text-black bg-white hover:bg-gray-100 transition duration-200 flex gap-1">
          <PlusIcon />
          <span>Add Note</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e).then(() => resetStates()); // Ensure reset after submission
          }}
        >
          <DialogHeader>
            <DialogTitle>Create Note</DialogTitle>
            <DialogDescription>
              Create a new note here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            {type === "image" && (
              <div className="flex pl-11 gap-2 items-center">
                <Label htmlFor="picture">Picture</Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
