import { AddContentButton } from "./AddContent";
import { ShareBrainButton } from "./ShareBrainButton";

export function TopBar() {
  return (
    <div className="mt-4 flex justify-end gap-4">
      <AddContentButton />
      <ShareBrainButton />
    </div>
  );
}
