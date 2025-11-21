import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomeGameCard.module.css';

// Mock data for games
export const mockGames = [
  {
    id: 1,
    name: 'Blockchain Security',
    description: 'Smart contracts ensure payments are secure and transparent with immutable transaction records.',
    image: 'https://via.placeholder.com/300x200?text=Blockchain+Security',
    route: '/features/blockchain-security'
  },
  {
    id: 2,
    name: 'IPFS File Storage',
    description: 'Decentralized file storage keeps your documents secure and accessible from anywhere.',
    image: 'https://via.placeholder.com/300x200?text=IPFS+Storage',
    route: '/features/ipfs-storage'
  },
  {
    id: 3,
    name: 'Escrow Protection',
    description: 'Automated escrow system protects both parties until milestones are completed.',
    image: 'https://via.placeholder.com/300x200?text=Escrow+Protection',
    route: '/features/escrow-protection'
  },
  {
    id: 4,
    name: 'Multi-party Contracts',
    description: 'Support for complex agreements with multiple stakeholders and approval workflows.',
    image: 'https://via.placeholder.com/300x200?text=Multi-party+Contracts',
    route: '/features/multi-party-contracts'
  },
  {
    id: 5,
    name: 'Zero Knowledge Verification',
    description: 'Verify identities and deliverables without exposing sensitive information.',
    image: 'https://via.placeholder.com/300x200?text=Zero+Knowledge',
    route: '/features/zero-knowledge'
  },
  {
    id: 6,
    name: 'Instant Payments',
    description: 'Release payments instantly when work is approved, with transparent fee structure.',
    image: 'https://via.placeholder.com/300x200?text=Instant+Payments',
    route: '/features/instant-payments'
  }
];

interface HomeGameCardProps {
  title?: string;
  description?: string;
  gameId?: number;
}

const HomeGameCard: React.FC<HomeGameCardProps> = ({ title = "Game", description = "Experience this exciting game.", gameId = 1 }) => {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<{ name: string; description: string; image: string; route: string }>({
    name: title,
    description: description,
    image: 'https://via.placeholder.com/300x200?text=Game',
    route: '/game/default'
  });

  useEffect(() => {
    const game = mockGames.find(g => g.id === gameId);
    if (game) {
      setGameData({
        name: game.name,
        description: game.description,
        image: game.image,
        route: game.route
      });
    }
  }, [gameId]);

  const handleCardClick = () => {
    navigate(gameData.route);
  };

  return (
    <div className={styles.homeGameCardContainer} onClick={handleCardClick}>
      {/* Background SVG Border */}
      <svg className={styles.backgroundBorder} xmlns="http://www.w3.org/2000/svg" width="424" height="639" viewBox="0 0 424 639" fill="none" preserveAspectRatio="none">
        <mask id="path-1-inside-1_29_465" fill="white">
          <path d="M311.812 44.8961L340.718 0H135.303L166.669 44.8961H311.812Z"/>
          <path d="M67.6516 562.123H423.13C423.13 600.869 422.392 610.832 409.6 623.625C396.807 636.417 386.024 637.975 380.079 639H0L67.6516 562.123Z"/>
        </mask>
        <path d="M340.718 0L761.12 270.67L1257.3 -500H340.718V0ZM311.812 44.8961V544.896H584.563L732.214 315.566L311.812 44.8961ZM166.669 44.8961L-243.211 331.25L-93.9513 544.896H166.669V44.8961ZM135.303 0V-500H-823.947L-274.576 286.354L135.303 0ZM423.13 562.123H923.13V62.1232H423.13V562.123ZM67.6516 562.123V62.1232H-158.382L-307.705 231.809L67.6516 562.123ZM0 639L-375.357 308.686L-1106.03 1139H0V639ZM380.079 639V1139H422.867L465.033 1131.73L380.079 639ZM340.718 0L-79.6841 -270.67L-108.59 -225.774L311.812 44.8961L732.214 315.566L761.12 270.67L340.718 0ZM311.812 44.8961V-455.104H166.669V44.8961V544.896H311.812V44.8961ZM166.669 44.8961L576.548 -241.458L545.183 -286.354L135.303 0L-274.576 286.354L-243.211 331.25L166.669 44.8961ZM135.303 0V500H340.718V0V-500H135.303V0ZM423.13 562.123V62.1232H67.6516V562.123V1062.12H423.13V562.123ZM67.6516 562.123L-307.705 231.809L-375.357 308.686L0 639L375.357 969.314L443.008 892.437L67.6516 562.123ZM0 639V1139H380.079V639V139H0V639ZM380.079 639L465.033 1131.73C461.34 1132.37 480.794 1129.26 501.828 1124.22C525.282 1118.6 554.086 1110.08 585.944 1096.69C652.33 1068.8 712.169 1028.16 763.153 977.178L409.6 623.625L56.0462 270.071C94.2376 231.88 142.289 198.416 198.599 174.757C252.348 152.175 300.339 145.371 295.125 146.27L380.079 639ZM409.6 623.625L763.153 977.178C829.768 910.563 887.861 818.826 911.485 700.502C925.059 632.515 923.13 564.478 923.13 562.123H423.13H-76.8701C-76.8701 572.469 -76.9705 570.811 -76.7681 565.859C-76.5894 561.487 -75.6533 537.229 -69.1608 504.711C-61.7263 467.474 -47.2544 420.002 -19.2196 369.903C7.92493 321.395 37.9018 288.216 56.0462 270.071L409.6 623.625Z" fill="#313131" mask="url(#path-1-inside-1_29_465)"/>
      </svg>

      {/* Card Image */}
      <div className={styles.cardImage}>
        <img src={gameData.image} alt={gameData.name} className={styles.cardImageSvg} />
      </div>

      {/* Card Content with SVG Shape */}
      <div className={styles.cardContent}>
        <svg className={styles.contentBackground} xmlns="http://www.w3.org/2000/svg" width="572" height="265" viewBox="0 0 572 265" fill="none" preserveAspectRatio="none">
          <mask id="path-1-inside-1_29_476" fill="white">
            <path d="M185.5 0H0V229.5C0.666667 236.333 0.116807 245.068 8.5 256.5C14 264 25 265 29 265H547C547 265 558 261 564 254C570 247 572 235.5 572 235.5V38L213 37.5L185.5 0Z"/>
          </mask>
          {/* <path d="M0 0V-550H-550V0H0ZM185.5 0L629.023 -325.25L464.206 -550H185.5V0ZM213 37.5L-230.523 362.75L-65.9906 587.112L212.234 587.499L213 37.5ZM572 38H1122V-511.235L572.766 -511.999L572 38ZM572 235.5L1113.87 329.738L1122 282.97V235.5H572ZM547 265V815H643.896L734.959 781.886L547 265ZM8.5 256.5L452.023 -68.75L452.023 -68.75L8.5 256.5ZM0 229.5H-550V256.266L-547.401 282.905L0 229.5ZM0 0V550H185.5V0V-550H0V0ZM185.5 0L-258.023 325.25L-230.523 362.75L213 37.5L656.523 -287.75L629.023 -325.25L185.5 0ZM213 37.5L212.234 587.499L571.234 587.999L572 38L572.766 -511.999L213.766 -512.499L213 37.5ZM572 38H22V235.5H572H1122V38H572ZM572 235.5C30.1335 141.262 30.1521 141.155 30.1708 141.049C30.177 141.013 30.1956 140.906 30.2081 140.835C30.233 140.692 30.2581 140.549 30.2832 140.406C30.3335 140.119 30.3841 139.832 30.4351 139.545C30.5371 138.969 30.6406 138.39 30.7458 137.808C30.9559 136.644 31.1727 135.465 31.3964 134.272C31.8432 131.889 32.3205 129.433 32.8312 126.91C33.8468 121.892 35.0253 116.452 36.3996 110.65C39.0523 99.4492 42.8957 84.9351 48.4742 68.1997C55.9475 45.7798 81.3483 -28.0312 146.409 -103.935L564 254L981.591 611.935C1052.65 529.031 1082.05 445.97 1092.03 416.05C1098.85 395.565 1103.57 377.738 1106.79 364.163C1108.44 357.173 1109.83 350.78 1110.97 345.106C1111.55 342.254 1112.08 339.545 1112.56 336.99C1112.8 335.711 1113.02 334.467 1113.24 333.259C1113.35 332.654 1113.46 332.059 1113.56 331.472C1113.61 331.179 1113.67 330.888 1113.72 330.598C1113.74 330.454 1113.77 330.31 1113.79 330.166C1113.8 330.095 1113.82 329.987 1113.83 329.952C1113.85 329.845 1113.87 329.738 572 235.5ZM564 254L146.409 -103.935C208.639 -176.537 273.997 -212.226 293.528 -222.689C308.294 -230.599 321.248 -236.568 331.31 -240.901C336.523 -243.145 341.433 -245.153 345.98 -246.943C348.266 -247.844 350.496 -248.703 352.665 -249.523C353.751 -249.933 354.825 -250.335 355.887 -250.728C356.418 -250.925 356.946 -251.12 357.472 -251.313C357.735 -251.409 357.997 -251.505 358.258 -251.601C358.389 -251.649 358.52 -251.696 358.65 -251.744C358.716 -251.768 358.813 -251.803 358.846 -251.815C358.944 -251.851 359.041 -251.886 547 265C734.959 781.886 735.056 781.851 735.154 781.815C735.187 781.803 735.285 781.768 735.351 781.744C735.482 781.696 735.613 781.648 735.746 781.6C736.01 781.503 736.276 781.406 736.544 781.307C737.08 781.11 737.625 780.909 738.177 780.705C739.28 780.296 740.417 779.871 741.585 779.429C743.918 778.547 746.39 777.595 748.989 776.572C754.161 774.536 759.977 772.161 766.315 769.432C778.627 764.13 794.706 756.724 812.972 746.939C839.503 732.726 913.361 691.537 981.591 611.935L564 254ZM547 265V-285H29V265V815H547V265ZM29 265V-285C63.6749 -285 116.39 -281.629 178.12 -263.011C236.481 -245.411 357.752 -197.301 452.023 -68.75L8.5 256.5L-435.023 581.75C-335.252 717.801 -205.731 770.161 -139.495 790.136C-69.8897 811.129 -9.6749 815 29 815V265ZM8.5 256.5L452.023 -68.75C494.485 -10.8476 523.296 54.7073 538.23 121.835C544.851 151.595 547.306 175.386 548.293 186.546C548.708 191.246 548.993 195.463 548.825 193.103C548.8 192.758 548.279 185.092 547.401 176.095L0 229.5L-547.401 282.905C-548.112 275.616 -548.505 269.718 -548.399 271.203C-548.388 271.354 -548.396 271.248 -548.377 271.522C-548.365 271.681 -548.348 271.925 -548.328 272.205C-548.288 272.759 -548.226 273.612 -548.15 274.627C-547.999 276.643 -547.76 279.727 -547.432 283.442C-546.098 298.519 -543.132 326.49 -535.518 360.717C-518.596 436.778 -485.868 512.416 -435.023 581.75L8.5 256.5ZM0 229.5H550V0H0H-550V229.5H0Z" fill="white" mask="url(#path-1-inside-1_29_476)"/> */}
        </svg>

        <div className={styles.textContent}>
          <h3 className={styles.cardTitle}>{gameData.name}</h3>
          <p className={styles.cardDescription}>
            {gameData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeGameCard;
