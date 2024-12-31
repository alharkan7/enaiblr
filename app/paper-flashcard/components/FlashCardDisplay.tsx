import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { FlashCardContent } from "../types";
import { SECTIONS } from "../hooks/useFlashCard";
import { TransitionGroup, CSSTransition } from "react-transition-group";

interface FlashCardDisplayProps {
  cardStyle: string;
  currentCard: number;
  cards: FlashCardContent[];
  editMode: boolean;
  hasSwipedUp: boolean;
  handleEdit: (index: number, newContent: FlashCardContent) => void;
  handlers: any;
  direction: 'up' | 'down';
}

export const FlashCardDisplay = ({
  cardStyle,
  currentCard,
  cards,
  editMode,
  hasSwipedUp,
  handleEdit,
  handlers,
  direction,
}: FlashCardDisplayProps) => {
  const currentSection = SECTIONS[currentCard % SECTIONS.length];
  const currentCardIndex = Math.floor(currentCard / SECTIONS.length);
  const totalCards = cards.length * SECTIONS.length;
  const nodeRef = useRef(null);

  return (
    <div className="relative w-full h-[70vh]">
      {/* Card container */}
      <div className="absolute inset-0 overflow-hidden">
        <TransitionGroup component={null}>
          <CSSTransition
            key={currentCard}
            timeout={300}
            classNames={`slide-${direction}`}
            nodeRef={nodeRef}
            unmountOnExit
          >
            <div 
              ref={nodeRef} 
              className="absolute inset-0 transition-transform duration-300 ease-in-out"
            >
              <FlashCard
                cardStyle={cardStyle}
                content={cards[currentCardIndex]}
                section={currentSection}
                cardNumber={currentCard + 1}
                totalCards={totalCards}
                editMode={editMode}
                handleEdit={(content) => handleEdit(currentCardIndex, content)}
              />
            </div>
          </CSSTransition>
        </TransitionGroup>

        {/* Swipe handler */}
        <div 
          className={`absolute inset-0 ${editMode ? 'pointer-events-none' : ''}`} 
          {...handlers} 
        />

        {!hasSwipedUp && cards.length > 0 && (
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center text-foreground/70 animate-bounce pointer-events-none">
            <ChevronUp size={24} />
            <p className="text-sm">Swipe Up</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface FlashCardProps {
  cardStyle: string;
  content: FlashCardContent;
  section: typeof SECTIONS[number];
  cardNumber: number;
  totalCards: number;
  editMode: boolean;
  handleEdit: (content: FlashCardContent) => void;
}

const FlashCard = ({
  cardStyle,
  content,
  section,
  cardNumber,
  totalCards,
  editMode,
  handleEdit,
}: FlashCardProps) => {
  const [editedContent, setEditedContent] = useState<FlashCardContent>(content);

  return (
    <Card className={`h-full w-full flex flex-col justify-between p-6 ${cardStyle} bg-card relative`}>
      <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-background/80 text-xs text-foreground/70">
        #{section.key}
      </div>
      <div className="flex-1 flex flex-col justify-center items-center overflow-hidden">
        {editMode ? (
          <Textarea
            value={editedContent[section.key as keyof FlashCardContent] as string}
            onChange={(e) => {
              const newContent = { ...editedContent };
              (newContent[section.key as keyof FlashCardContent] as string) = e.target.value;
              setEditedContent(newContent);
              handleEdit(newContent);
            }}
            className="w-full h-full min-h-[200px] text-xl bg-background/80 text-foreground resize-none"
          />
        ) : (
          <div className="w-full text-center text-2xl font-medium text-foreground overflow-y-auto scrollbar-hide">
            {content[section.key as keyof FlashCardContent]}
          </div>
        )}
      </div>
      <div className="text-sm text-foreground/70 absolute bottom-4 left-4">
        {cardNumber} / {totalCards}
      </div>
    </Card>
  );
};
