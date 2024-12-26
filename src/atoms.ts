import { atom } from "recoil";

export interface Card {
  _id: string;
  title: string;
  type: "note" | "link" | "image"; // Restrict the type to specific values
  linkURL?: string; // Optional for "link"
  imageURL?: string; // Optional for "image"
  noteContent?: string;
  createdAt: Date;
}

type types = "note" | "link" | "image";

export const titleState = atom<string>({
  key: "title",
  default: "",
});

export const typeState = atom<types>({
  key: "type",
  default: "link",
});

export const linkURLState = atom<string>({
  key: "linkURL",
  default: "",
});

export const noteContentState = atom<string>({
  key: "noteContent",
  default: "",
});

export const isPopoverOpenState = atom<boolean>({
  key: "isPopoverOpen",
  default: false,
});

export const cardsState = atom<Card[]>({
  key: "cards",
  default: [],
});
