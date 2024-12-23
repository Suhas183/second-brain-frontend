import { AddContentButton } from "./AddContent";
import { ShareBrain } from "./ShareBrain";

export function TopBar() {
  return (
    <div className="flex justify-end gap-4">
      <AddContentButton />
      <ShareBrain />
    </div>
  );
}
