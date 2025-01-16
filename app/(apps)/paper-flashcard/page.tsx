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
import { motion, AnimatePresence } from "framer-motion";

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
    language,
    setLanguage,
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
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner />
        </motion.div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="relative min-h-dvh flex flex-col overflow-hidden">
        <AppsHeader title="" />
        <div className="flex-1 container max-w-[90%] 2xl:max-w-[80%] mx-auto px-4 flex items-center justify-center -mt-8">
            <PDFInput
              pdfLink={pdfLink}
              handleLinkChange={handleLinkChange}
              handleFileChange={handleFileChange}
              handleProcess={handleProcess}
              errorMessage={errorMessage}
              language={language}
              setLanguage={setLanguage}
            />
        </div>
        <AppsFooter />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-dvh flex flex-col overflow-hidden"
    >
      <AppsHeader 
        title="" 
        leftButton={
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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
          </motion.div>
        }
      />
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentCard}
          initial={{ opacity: 0, y: direction === "down" ? 100 : -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: direction === "up" ? -100 : 100 }}
          transition={{ duration: 0.3 }}
          className="flex-1 container max-w-[90%] 2xl:max-w-[80%] mx-auto px-4 flex flex-col items-center justify-center -mt-8"
        >
          <div className="w-full max-w-3xl relative">
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
            <div className="absolute right-[-3rem] top-1/2 transform -translate-y-1/2 hidden sm:flex flex-col gap-2 z-[1]">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateCard("prev")}
                  className="rounded-full backdrop-blur-sm bg-opacity-80"
                >
                  <ChevronUp className="size-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateCard("next")}
                  className="rounded-full backdrop-blur-sm bg-opacity-80"
                >
                  <ChevronDown className="size-4" />
                </Button>
              </motion.div>
            </div>
            <motion.div 
              className="relative z-20 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
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
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
