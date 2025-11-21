import React from "react";
import styles from "./HeaderText.module.css";
import Shuffle from '../TextAnimations/Shuffle/Shuffle';



interface HeaderTextProps {
  text: string;
  className?: string;
}

const HeaderText: React.FC<HeaderTextProps> = ({ text, className = "" }) => {
  return (
    <div className={`${styles.headerContainer} ${className}`}>
      <Shuffle
        text={text}
        className={styles.headerText}
         shuffleDirection="right"
  duration={0.35}
  animationMode="evenodd"
  shuffleTimes={1}
  ease="power3.out"
  stagger={0.03}
  threshold={0.1}
  triggerOnce={true}
  triggerOnHover={true}
  respectReducedMotion={true}
      />
    </div>
  );
};

export default HeaderText;
