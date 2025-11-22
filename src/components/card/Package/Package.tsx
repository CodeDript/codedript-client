import Button3Black1 from '../../button/Button3Black1/Button3Black1';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Package.module.css';
import ClockIcon from '../../../assets/svg/cloack.svg';
import RecycleIcon from '../../../assets/svg/recycle.svg';

// Mock data for games
export const mockGames = [
 
];

interface PackageCardProps {
  title?: string;
  description?: string[];
  gameId?: number;
  price?: string;
  delivery?: string;
  revisions?: number;
  buttonLabel?: string;
}


const PackageCard: React.FC<PackageCardProps> = ({
  title = "Game",
  description = ["Experience this exciting game."],
  gameId = 1,
  price = '',
  delivery = '',
  revisions = 0,
  buttonLabel = '',
}) => {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<{ name: string; description: string; image: string; route: string }>({
    name: title,
    description: 'Experience this exciting game.',
    image: 'https://via.placeholder.com/300x200?text=Game',
    route: '/game/default'
  });

 

  const handleCardClick = () => {
    navigate(gameData.route);
  };

  return (
    <div className={styles.packageCardContainer}>
      {/* Background SVG Border */}
      <svg className={styles.backgroundBorder} xmlns="http://www.w3.org/2000/svg" width="424" height="639" viewBox="0 0 424 639" fill="none" preserveAspectRatio="none">
        <mask id="path-1-inside-1_29_465" fill="white">
          <path d="M311.812 44.8961L340.718 0H135.303L166.669 44.8961H311.812Z"/>
          <path d="M67.6516 562.123H423.13C423.13 600.869 422.392 610.832 409.6 623.625C396.807 636.417 386.024 637.975 380.079 639H0L67.6516 562.123Z"/>
        </mask>
        <path d="M340.718 0L761.12 270.67L1257.3 -500H340.718V0ZM311.812 44.8961V544.896H584.563L732.214 315.566L311.812 44.8961ZM166.669 44.8961L-243.211 331.25L-93.9513 544.896H166.669V44.8961ZM135.303 0V-500H-823.947L-274.576 286.354L135.303 0ZM423.13 562.123H923.13V62.1232H423.13V562.123ZM67.6516 562.123V62.1232H-158.382L-307.705 231.809L67.6516 562.123ZM0 639L-375.357 308.686L-1106.03 1139H0V639ZM380.079 639V1139H422.867L465.033 1131.73L380.079 639ZM340.718 0L-79.6841 -270.67L-108.59 -225.774L311.812 44.8961L732.214 315.566L761.12 270.67L340.718 0ZM311.812 44.8961V-455.104H166.669V44.8961V544.896H311.812V44.8961ZM166.669 44.8961L576.548 -241.458L545.183 -286.354L135.303 0L-274.576 286.354L-243.211 331.25L166.669 44.8961ZM135.303 0V500H340.718V0V-500H135.303V0ZM423.13 562.123V62.1232H67.6516V562.123V1062.12H423.13V562.123ZM67.6516 562.123L-307.705 231.809L-375.357 308.686L0 639L375.357 969.314L443.008 892.437L67.6516 562.123ZM0 639V1139H380.079V639V139H0V639ZM380.079 639L465.033 1131.73C461.34 1132.37 480.794 1129.26 501.828 1124.22C525.282 1118.6 554.086 1110.08 585.944 1096.69C652.33 1068.8 712.169 1028.16 763.153 977.178L409.6 623.625L56.0462 270.071C94.2376 231.88 142.289 198.416 198.599 174.757C252.348 152.175 300.339 145.371 295.125 146.27L380.079 639ZM409.6 623.625L763.153 977.178C829.768 910.563 887.861 818.826 911.485 700.502C925.059 632.515 923.13 564.478 923.13 562.123H423.13H-76.8701C-76.8701 572.469 -76.9705 570.811 -76.7681 565.859C-76.5894 561.487 -75.6533 537.229 -69.1608 504.711C-61.7263 467.474 -47.2544 420.002 -19.2196 369.903C7.92493 321.395 37.9018 288.216 56.0462 270.071L409.6 623.625Z" fill="#313131" mask="url(#path-1-inside-1_29_465)"/>
      </svg>

      {/* Card Content with SVG Shape */}
      <div className={styles.cardContent}>
        <svg className={styles.contentBackground} xmlns="http://www.w3.org/2000/svg" width="572" height="265" viewBox="0 0 572 265" fill="none" preserveAspectRatio="none">
          <mask id="path-1-inside-1_29_476" fill="white">
            <path d="M185.5 0H0V229.5C0.666667 236.333 0.116807 245.068 8.5 256.5C14 264 25 265 29 265H547C547 265 558 261 564 254C570 247 572 235.5 572 235.5V38L213 37.5L185.5 0Z"/>
          </mask>
        </svg>
        <div className={styles.textContent}>
          <h3 className={styles.cardTitle} style={{ fontFamily: 'Zen Dots', fontWeight: 400, fontSize: '1.3rem', marginBottom: 8 }}>{title}</h3>
          <div style={{ fontFamily: 'Zen Dots', fontWeight: 400, fontSize: '2rem', color: '#222', marginBottom: 8 }}>{price}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, marginLeft: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Jura', fontWeight: 400 }}>
              <img src={ClockIcon} alt="clock" style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 6 }} /> Delivery
            </span>
            <span style={{ fontFamily: 'Jura', fontWeight: 500, minWidth: 50, textAlign: 'right', display: 'inline-block', marginLeft: 'auto', marginRight: 10 }}>{delivery}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, marginLeft: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Jura', fontWeight: 400 }}>
              <img src={RecycleIcon} alt="revisions" style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 6 }} /> Revisions
            </span>
            <span style={{ fontFamily: 'Jura', fontWeight: 500, minWidth: 50, textAlign: 'right', display: 'inline-block', marginLeft: 'auto', marginRight: 10 }}>{revisions}</span>
          </div>
          <ul style={{ margin: '12px 0 16px 0', padding: 0, listStyle: 'none', color: '#222', fontFamily: 'Jura', fontWeight: 400, fontSize: '1rem', lineHeight: 1.5 }}>
            {Array.isArray(description) && description.map((feature, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ color: '#888', fontWeight: 700 }}>✓</span> {feature}
              </li>
            ))}
          </ul>
          <div className={styles.buttonAlign2}>
             <div className={styles.buttonAlign}>
            <Button3Black1 text={buttonLabel} onClick={() => {}} />
          </div>
        </div>
      </div>
</div>
      {/* Card Image */}
      <div className={styles.cardImage}>
        <img src={gameData.image} alt={gameData.name} className={styles.cardImageSvg} />
      </div>
    </div>
  );
};

export default PackageCard;
