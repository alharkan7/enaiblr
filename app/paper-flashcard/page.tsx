"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronUp, ChevronDown } from "lucide-react";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { FlashCardControls } from "./components/FlashCardControls";
import { FlashCardDisplay } from "./components/FlashCardDisplay";
import { PDFInput } from "./components/PDFInput";
import { usePDFProcessor } from "./hooks/usePDFProcessor";
import { useFlashCard } from "./hooks/useFlashCard";
import { FlashCardContent } from "./types";
import { Sidebar } from '@/components/Sidebar';
import { AnimatedBackground } from "@/components/animated-background";
import RenderFooter from '@/components/RenderFooter';
import "./styles/flashcard.css";

export default function PDFProcessor() {
  const {
    pdfLink,
    setPdfLink,
    file,
    setFile,
    isLoading,
    cards,
    setCards,
    setHashtag,
    errorMessage,
    handleProcess,
  } = usePDFProcessor();

  const handleCardEdit = (index: number, newContent: FlashCardContent) => {
    const newCards = [...cards];
    newCards[index] = newContent;
    setCards(newCards);
  };

  const {
    currentCard,
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
  } = useFlashCard(cards);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfLink(e.target.value);
  };

  const handleFileChange = (file: File | null) => {
    setFile(file);
  };

  const openSourceDocument = () => {
    if (pdfLink) {
      window.open(pdfLink, "_blank");
    } else if (file) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, "_blank");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (cards.length > 0) {
    return (
      <div className="relative h-screen flex flex-col overflow-hidden">
        <Sidebar />
        <AnimatedBackground />
        <div className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center">
          <div
            className="w-full max-w-3xl mb-4 flex justify-between items-center relative z-20"
          >
            <Button
              variant="link"
              onClick={() => {
                setCards([]);
                setHashtag([]);
                setPdfLink("");
                setFile(null);
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="text-sm text-blue-600 mr-4">
              Card {currentCard + 1} of {totalCards}
            </div>
          </div>

          <div className="w-full max-w-3xl">
            <FlashCardDisplay
              cardStyle={cardStyle}
              textColor={textColor}
              currentCard={currentCard}
              cards={cards}
              editMode={editMode}
              hasSwipedUp={hasSwipedUp}
              handleEdit={handleCardEdit}
              handlers={handlers}
              direction={direction}
            />
            <div className="relative z-20">
              <FlashCardControls
                editMode={editMode}
                setEditMode={setEditMode}
                handleColorChange={handleColorChange}
                handleTextColorChange={handleTextColorChange}
                openSourceDocument={openSourceDocument}
                currentCard={cards[currentCard] || {
                  intro: "",
                  researcher: "",
                  question: "",
                  method: "",
                  findings: "",
                  implications: "",
                  closing: ""
                }}
              />
            </div>
          </div>

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden sm:flex flex-col space-y-2 z-[1]">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateCard("prev")}
              disabled={currentCard === 0}
              aria-label="Previous card"
              className="border-blue-500 text-blue-500 hover:bg-blue-100"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateCard("next")}
              disabled={currentCard === totalCards - 1}
              aria-label="Next card"
              className="border-blue-500 text-blue-500 hover:bg-blue-100"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <RenderFooter />
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      <Sidebar />
      <AnimatedBackground />
      <div className="flex-1 container mx-auto px-4 flex items-center justify-center">
        <PDFInput
          pdfLink={pdfLink}
          handleLinkChange={handleLinkChange}
          handleFileChange={handleFileChange}
          handleProcess={handleProcess}
          errorMessage={errorMessage}
        />
      </div>
      <RenderFooter />
    </div>
  );
}
