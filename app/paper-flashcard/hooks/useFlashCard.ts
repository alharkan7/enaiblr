import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { TEXT_COLORS, GRADIENTS } from '../constants';
import { FlashCardContent } from '../types';

export const SECTIONS = [
  { key: 'intro', label: 'Introduction' },
  { key: 'researcher', label: 'Researcher' },
  { key: 'question', label: 'Question' },
  { key: 'method', label: 'Method' },
  { key: 'findings', label: 'Findings' },
  { key: 'implications', label: 'Implications' },
  { key: 'closing', label: 'Closing' },
] as const;

export const useFlashCard = (cards: FlashCardContent[]) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [cardStyle, setCardStyle] = useState("bg-gradient-to-r from-blue-100 to-white");
  const [textColor, setTextColor] = useState(TEXT_COLORS[0]);
  const [hasSwipedUp, setHasSwipedUp] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  // Reset current card when cards array changes
  useEffect(() => {
    setCurrentCard(0);
    setHasSwipedUp(false);
  }, [cards]);

  const totalCards = cards.length * SECTIONS.length;
  const currentSection = SECTIONS[currentCard % SECTIONS.length];
  const currentCardIndex = Math.floor(currentCard / SECTIONS.length);

  const safeSetCurrentCard = (newIndex: number, dir: 'up' | 'down') => {
    if (totalCards === 0) return;
    const safeIndex = Math.max(0, Math.min(newIndex, totalCards - 1));
    setCurrentCard(safeIndex);
    setDirection(dir);
  };

  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (currentCard < totalCards - 1) {
        safeSetCurrentCard(currentCard + 1, 'up');
        setHasSwipedUp(true);
      }
    },
    onSwipedDown: () => {
      if (currentCard > 0) {
        safeSetCurrentCard(currentCard - 1, 'down');
      }
    },
  });

  const navigateCard = (direction: "next" | "prev") => {
    if (direction === "next" && currentCard < totalCards - 1) {
      safeSetCurrentCard(currentCard + 1, 'up');
      setHasSwipedUp(true);
    } else if (direction === "prev" && currentCard > 0) {
      safeSetCurrentCard(currentCard - 1, 'down');
    }
  };

  const handleColorChange = (gradient: string) => {
    setCardStyle(gradient);
    // Update text color based on gradient index
    const gradientIndex = GRADIENTS.indexOf(gradient);
    if (gradientIndex !== -1) {
      setTextColor(TEXT_COLORS[gradientIndex]);
    }
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
  };

  return {
    currentCard,
    currentSection,
    currentCardIndex,
    editMode,
    setEditMode,
    cardStyle,
    textColor,
    hasSwipedUp,
    handlers,
    navigateCard,
    handleColorChange,
    handleTextColorChange,
    totalCards,
    direction,
  };
};
