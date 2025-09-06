// src/components/TextAnimations/RotatingText/RotatingText.jsx
"use client";
import React from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    transition = { type: "spring", damping: 25, stiffness: 300 },
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },
    animatePresenceMode = "wait",
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = "first",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    mainClassName,
    splitLevelClassName, // This typically has 'overflow-hidden'
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  // Add a ref to measure the height of the animated elements
  const measureRef = useRef(null);
  const [elementHeight, setElementHeight] = useState(0);

  const splitIntoCharacters = (text) => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (segment) => segment.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === "characters") {
      const words = currentText.split(" ");
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }
    if (splitBy === "words") {
      return currentText.split(" ").map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1,
      }));
    }
    if (splitBy === "lines") {
      return currentText.split("\n").map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1,
      }));
    }

    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      const total = totalChars;
      if (staggerFrom === "first") return index * staggerDuration;
      if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
      if (staggerFrom === "center") {
        const center = Math.floor(total / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * total);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      return Math.abs(staggerFrom - index) * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentTextIndex(newIndex);
      if (onNext) onNext(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1
        ? loop
          ? 0
          : currentTextIndex
        : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex =
      currentTextIndex === 0
        ? loop
          ? texts.length - 1
          : currentTextIndex
        : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) {
      handleIndexChange(prevIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback(
    (index) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) {
        handleIndexChange(validIndex);
      }
    },
    [texts.length, currentTextIndex, handleIndexChange]
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) {
      handleIndexChange(0);
    }
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo,
      reset,
    }),
    [next, previous, jumpTo, reset]
  );

  useEffect(() => {
    if (!auto) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto]);

  // ✅ New useEffect to measure the actual height of the text content
  useEffect(() => {
    if (measureRef.current) {
      // Temporarily render the text with full opacity and no transform to measure its height
      // This is done off-screen or with visibility hidden to avoid flickering.
      // We use a temporary div to render the content with its final styles.
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.pointerEvents = "none";
      tempDiv.style.whiteSpace = "nowrap"; // Inherit from mainClassName if applicable
      tempDiv.style.fontSize = getComputedStyle(measureRef.current).fontSize; // Inherit font size
      tempDiv.style.lineHeight = getComputedStyle(
        measureRef.current
      ).lineHeight; // Inherit line height
      tempDiv.style.fontWeight = getComputedStyle(
        measureRef.current
      ).fontWeight; // Inherit font weight
      // You might need to copy other relevant styles for accurate measurement
      tempDiv.className = cn(mainClassName, elementLevelClassName); // Apply relevant classes for accurate measurement

      // Render the current text content into the temporary div
      tempDiv.textContent = texts[currentTextIndex];
      document.body.appendChild(tempDiv);

      // Get the height and then remove the temporary div
      const height = tempDiv.offsetHeight;
      document.body.removeChild(tempDiv);
      setElementHeight(height);
    }
  }, [texts, currentTextIndex, mainClassName, elementLevelClassName]); // Re-measure if text or relevant styles change

  // If elementHeight is 0 (e.g., on initial render or if measurement failed),
  // fall back to a reasonable default like 1em (which is common for single line text)
  const finalElementHeight = elementHeight > 0 ? elementHeight : 16; // 16px approx 1em

  return (
    <motion.span
      className={cn(
        "flex flex-wrap whitespace-pre-wrap relative",
        mainClassName
      )}
      {...rest}
      layout
      transition={transition}
      ref={measureRef} // Attach ref to the main animated span for measurement
    >
      <span className="sr-only">{texts[currentTextIndex]}</span>
      <AnimatePresence
        mode={animatePresenceMode}
        initial={animatePresenceInitial}
      >
        <motion.span
          key={currentTextIndex}
          className={cn(
            splitBy === "lines"
              ? "flex flex-col w-full"
              : "flex flex-wrap whitespace-pre-wrap relative"
          )}
          layout
          aria-hidden="true"
        >
          {elements.map((wordObj, wordIndex, array) => {
            const previousCharsCount = array
              .slice(0, wordIndex)
              .reduce((sum, word) => sum + word.characters.length, 0);
            return (
              <span
                key={wordIndex}
                className={cn(
                  "inline-flex",
                  splitLevelClassName // This will have 'overflow-hidden pb-1' from props
                )}
                // ✅ Set a specific height based on measurement for the overflow-hidden parent
                // This is crucial for percentage 'y' animations to work reliably
                style={{ height: `${finalElementHeight}px` }}
              >
                {wordObj.characters.map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    // ✅ Animate using computed pixel values if elementHeight is available,
                    // otherwise fall back to original percentages (less ideal but keeps animation)
                    initial={{
                      y: initial.y === "100%" ? finalElementHeight : initial.y,
                      opacity: initial.opacity,
                    }}
                    animate={{
                      y: animate.y === 0 ? 0 : animate.y,
                      opacity: animate.opacity,
                    }}
                    exit={{
                      y:
                        exit.y === "-120%" ? -finalElementHeight * 1.2 : exit.y,
                      opacity: exit.opacity,
                    }}
                    transition={{
                      ...transition,
                      delay: getStaggerDelay(
                        previousCharsCount + charIndex,
                        array.reduce(
                          (sum, word) => sum + word.characters.length,
                          0
                        )
                      ),
                    }}
                    className={cn(
                      "inline-block whitespace-nowrap",
                      elementLevelClassName
                    )}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && (
                  <span className="whitespace-pre"> </span>
                )}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = "RotatingText";
export default RotatingText;
