import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Share2,
  Palette,
  ExternalLink,
  MessageCircle,
  Check,
  Type,
} from "lucide-react";
import { WhatsappShareButton } from "react-share";
import { GRADIENTS} from "../constants";
import { FlashCardContent } from "../types";
import { SECTIONS } from "../hooks/useFlashCard";

interface FlashCardControlsProps {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  handleColorChange: (gradient: string) => void;
  handleTextColorChange: (color: string) => void;
  openSourceDocument: () => void;
  currentCard: FlashCardContent;
}

export const FlashCardControls = ({
  editMode,
  setEditMode,
  handleColorChange,
  handleTextColorChange,
  openSourceDocument,
  currentCard,
}: FlashCardControlsProps) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
      <Button
        variant={editMode ? "default" : "outline"}
        size="icon"
        onClick={() => setEditMode(!editMode)}
        aria-label={editMode ? "Save" : "Edit"}
      >
        {editMode ? (
          <Check className="size-4" />
        ) : (
          <Edit className="size-4" />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Change color"
          >
            <Palette className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {GRADIENTS.map((gradient, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleColorChange(gradient)}
            >
              <div className={`w-full h-8 ${gradient} rounded`}></div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Share"
          >
            <Share2 className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <WhatsappShareButton
              url={window.location.href}
              title={`Check out this flashcard section: ${currentCard[SECTIONS[0].key as keyof FlashCardContent]}\n\nVisit: `}
              className="w-full"
            >
              <div className="flex items-center">
                <MessageCircle className="size-4 mr-2" />
                WhatsApp
              </div>
            </WhatsappShareButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        onClick={openSourceDocument}
        aria-label="Open source document"
      >
        <ExternalLink className="size-4" />
      </Button>
    </div>
  );
};
