import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { FlashCardContent } from "../types";
import { SECTIONS } from "../hooks/useFlashCard";
import { TransitionGroup, CSSTransition } from "react-transition-group";

interface FlashCardDisplayProps {
  cardStyle: string;
  textColor: string;
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
  textColor,
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
            classNames={{
              enter: direction === 'up' ? 'slide-up-enter' : 'slide-down-enter',
              enterActive: direction === 'up' ? 'slide-up-enter-active' : 'slide-down-enter-active',
              exit: direction === 'up' ? 'slide-up-exit' : 'slide-down-exit',
              exitActive: direction === 'up' ? 'slide-up-exit-active' : 'slide-down-exit-active'
            }}
            nodeRef={nodeRef}
            unmountOnExit
          >
            <div ref={nodeRef} className="absolute inset-0 will-change-transform">
              <FlashCard
                cardStyle={cardStyle}
                textColor={textColor}
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
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center text-blue-500 animate-bounce pointer-events-none">
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
  textColor: string;
  content: FlashCardContent;
  section: typeof SECTIONS[number];
  cardNumber: number;
  totalCards: number;
  editMode: boolean;
  handleEdit: (content: FlashCardContent) => void;
}

const FlashCard = ({
  cardStyle,
  textColor,
  content,
  section,
  cardNumber,
  totalCards,
  editMode,
  handleEdit,
}: FlashCardProps) => {
  const [editedContent, setEditedContent] = useState<FlashCardContent>(content);
  const [fontSize, setFontSize] = useState(24); // Start with default size
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const adjustTextSize = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;
    
    // Start with a large font size
    let currentSize = 24;
    content.style.fontSize = `${currentSize}px`;

    // Reduce font size until content fits
    while (
      (content.scrollHeight > container.clientHeight || 
       content.scrollWidth > container.clientWidth) && 
      currentSize > 8
    ) {
      currentSize -= 1;
      content.style.fontSize = `${currentSize}px`;
    }

    setFontSize(currentSize);
  }, []);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  useEffect(() => {
    adjustTextSize();

    const resizeObserver = new ResizeObserver(() => {
      adjustTextSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [adjustTextSize, content[section.key]]);

  const handleSave = () => {
    handleEdit(editedContent);
  };

  return (
    <Card
      className={`w-full h-full shadow-xl border border-blue-200 flex flex-col p-8 sm:p-12 relative ${cardStyle}`}
    >
      <div className="absolute top-4 left-4 bg-blue-200 text-blue-600 text-xs font-semibold rounded-full px-2 py-1">
        #{section.key}
      </div>
      <div ref={containerRef} className="w-full h-full mt-10 flex flex-col">
        {editMode ? (
          <Textarea
            value={editedContent[section.key]}
            onChange={(e) => {
              const newContent = { ...editedContent };
              newContent[section.key] = e.target.value;
              setEditedContent(newContent);
            }}
            onBlur={handleSave}
            style={{ fontSize: `${fontSize}px` }}
            className={`w-full flex-1 resize-none bg-transparent border-none focus-visible:ring-0 font-bold leading-relaxed ${textColor} pb-8`}
            placeholder={`Enter ${section.label.toLowerCase()} here...`}
            autoFocus
          />
        ) : (
          <div 
            ref={contentRef}
            className={`whitespace-pre-wrap ${textColor} font-bold flex-1 pb-8`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {content[section.key]}
          </div>
        )}
      </div>
    </Card>
  );
};
