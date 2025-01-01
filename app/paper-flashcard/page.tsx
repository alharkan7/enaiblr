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
import AppsFooter from '@/components/apps-footer';
import { AppsHeader } from '@/components/apps-header';
import "./styles/flashcard.css";
import "./styles/scrollbar.css";

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
      <div className="relative min-h-[100dvh] flex flex-col overflow-hidden">
        <AppsHeader 
          title="" 
          leftButton={
            <Button
              variant="ghost"
              onClick={() => {
                setCards([]);
                setHashtag([]);
                setPdfLink("");
                setFile(null);
              }}
            >
              <ChevronLeft className="size-4" />
              Back
            </Button>
          }
        />
        <div className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center -mt-8">


          <div className="w-full max-w-3xl">
            <FlashCardDisplay
              cardStyle={cardStyle}
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

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden sm:flex flex-col gap-2 z-[1]">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateCard("prev")}
              className="rounded-full"
            >
              <ChevronUp className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateCard("next")}
              className="rounded-full"
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <AppsHeader 
        title="" 
        leftButton={cards.length > 0 ? (
          <Button
            variant="ghost"
            onClick={() => {
              setCards([]);
              setHashtag([]);
              setPdfLink("");
              setFile(null);
            }}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
        ) : undefined}
      />
      <div className="flex-1 container mx-auto px-4 flex items-center justify-center -mt-8">
        <PDFInput
          pdfLink={pdfLink}
          handleLinkChange={handleLinkChange}
          handleFileChange={handleFileChange}
          handleProcess={handleProcess}
          errorMessage={errorMessage}
        />
      </div>
      <AppsFooter />
    </div>
  );
}
