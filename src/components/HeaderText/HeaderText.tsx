import React, { useRef } from "react";
import styles from "./HeaderText.module.css";
import VariableProximity from '../TextAnimations/VariableProximity';

interface HeaderTextProps {
  text: string;
  subtitle?: string;
  className?: string;
}

const HeaderText: React.FC<HeaderTextProps> = ({ text, subtitle, className = "" }) => {
  const containerRef = useRef<HTMLElement>(null!);

  return (
    <div className={`${styles.headerContainer} ${className}`}>
      <div ref={containerRef as React.RefObject<HTMLDivElement>} style={{ position: 'relative' }}>
        <VariableProximity
          label={text}
          className={styles.headerText}
          fromFontVariationSettings="'wght' 400, 'opsz' 9"
          toFontVariationSettings="'wght' 1000, 'opsz' 40"
          containerRef={containerRef}
          radius={100}
          falloff='linear'
        />
      </div>
      {subtitle && (
        <p className={styles.subtitleText}>{subtitle}</p>
      )}
    </div>
  );
};

export default HeaderText;
