import React, { useState, useEffect } from 'react';

/**
 * TypewriterText
 * Smooth character-by-character typing effect from left to right with blinking cursor.
 */
const TypewriterText = ({
  texts = [
    'Personalized Academic Mentorship for Every Student.',
    'Systematic Homework & Question Paper Distribution.',
    'Transparent Monthly Tuition Ledger & Instant Receipts.',
    'Fostering Discipline, Focus, and Academic Mastery.',
  ],
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseTime = 2000,
  className = '',
  cursorClassName = 'text-gold-500',
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentString, setCurrentString] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullText = texts[currentTextIndex];

    if (!isDeleting) {
      if (currentString.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentString(fullText.substring(0, currentString.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing full word, pause before backspacing
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (currentString.length > 0) {
        timer = setTimeout(() => {
          setCurrentString(fullText.substring(0, currentString.length - 1));
        }, deletingSpeed);
      } else {
        // Finished backspacing, move to next text
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentString, isDeleting, currentTextIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span>{currentString}</span>
      <span
        className={`inline-block ml-0.5 w-[2px] h-[1.1em] self-center animate-pulse bg-current ${cursorClassName}`}
      />
    </span>
  );
};

export default TypewriterText;
