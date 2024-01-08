import React from "react";
import "./AnimatedText.css"; // Import your custom styles

interface Props {
  word: string;
}

const AnimatedText = ({ word }: Props) => {
  const letters = word.split("");

  return (
    <div className="animated-text-container">
      {letters.map((letter, index) => (
        <span
          key={index}
          className="animated-letter"
          style={{
            animationDelay: `${index * 0.1}s`, // Adjust the delay based on the index
            animationDuration: `${0.5 + index * 0.1}s`, // Adjust the duration based on the index
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

export default AnimatedText;
