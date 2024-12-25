import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShareIcon } from "./ui/ShareIcon";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export function ShareBrainButton() {
  const { getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [hash, setHash] = useState("");

  const fetchLinkDetails = async () => {
    const token = await getAccessTokenSilently();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/share/brain`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChecked(response.data.active);
      setHash(response.data.hash);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        try {
          const postResponse = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/share/brain`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setChecked(postResponse.data.active);
          setHash(postResponse.data.hash);
        } catch {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong!",
            duration: 1000,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong!",
          duration: 1000,
        });
      }
    }
  };

  const handleCheckedChange = async (value: boolean) => {
    setChecked(value);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/share/brain`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChecked(response.data.active);
      setHash(response.data.hash);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong!",
        duration: 1000,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          fetchLinkDetails(); // Fetch details only when the dialog opens
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-2 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex gap-1">
          <ShareIcon />
          <span>Share Brain</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between border border-input bg-transparent px-3 py-1 h-9 w-full rounded-md">
          <Label htmlFor="airplane-mode">Enable link sharing</Label>
          <Switch checked={checked} onCheckedChange={handleCheckedChange} />
        </div>
        {checked && (
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                value={
                  hash
                    ? `${import.meta.env.VITE_FRONTEND_URL}/share/brain/${hash}`
                    : ""
                }
                readOnly
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="px-3"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_FRONTEND_URL}/share/brain/${hash}`
                )
              }
            >
              <span className="sr-only">Copy</span>
              <Copy />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
