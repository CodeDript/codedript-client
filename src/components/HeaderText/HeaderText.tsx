import React from "react";
import './HeaderText.css';

interface HeaderTextProps {
  text: string;
  subHeader?: string;
  className?: string;
}

const HeaderText: React.FC<HeaderTextProps> = ({ text, subHeader, className = "" }) => {
  return (
    <div className={`headerContainer ${className}`}>
      <h1 className="headerText">{text}</h1>
      {subHeader && <p className="subtitleText">{subHeader}</p>}
    </div>
  );
};

export default HeaderText;
