import React from "react";
import styles from "./HeaderText.module.css";
import Shuffle from '../TextAnimations/Shuffle/Shuffle';



interface HeaderTextProps {
  text: string;
  subHeader?: string;
  className?: string;
}

const HeaderText: React.FC<HeaderTextProps> = ({ text, subHeader, className = "" }) => {
  return (
    <div className={`${styles.headerContainer} ${className}`}>
      <Shuffle
        text={text}
        className={styles.headerText}
         shuffleDirection="right"
  duration={0.35}
  animationMode="evenodd"
  shuffleTimes={8}
  ease="back.out(1.7)"
  stagger={0.1}
  threshold={0.1}
  triggerOnce={true}
  triggerOnHover={true}
  respectReducedMotion={true}
      />
      {subHeader && <p className={styles.subtitleText}>{subHeader}</p>}
    </div>
  );
};

export default HeaderText;
