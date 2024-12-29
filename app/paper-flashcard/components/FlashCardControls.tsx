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
        className={editMode ? "bg-blue-500 hover:bg-blue-600" : "border-blue-500 text-blue-500 hover:bg-blue-100"}
      >
        {editMode ? (
          <Check className="w-4 h-4" />
        ) : (
          <Edit className="w-4 h-4" />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Change color"
            className="border-blue-500 text-blue-500 hover:bg-blue-100"
          >
            <Palette className="w-4 h-4" />
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
            className="border-blue-500 text-blue-500 hover:bg-blue-100"
          >
            <Share2 className="w-4 h-4" />
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
                <MessageCircle className="w-4 h-4 mr-2" />
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
        className="border-blue-500 text-blue-500 hover:bg-blue-100"
      >
        <ExternalLink className="w-4 h-4" />
      </Button>
    </div>
  );
};
