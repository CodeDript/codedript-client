import React from 'react';
import styles from './WorkFlow.module.css';
import svg1 from '../../assets/WorkflowSvg/1.svg';
import svg2 from '../../assets/WorkflowSvg/2.svg';
import svg3 from '../../assets/WorkflowSvg/3.svg';
import svg4 from '../../assets/WorkflowSvg/4.svg';
import leftLine from '../../assets/WorkflowSvg/left line.svg';
import rightLine from '../../assets/WorkflowSvg/right line.svg';

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  image?: string; // optional SVG or image path
}

const defaultSteps: WorkflowStep[] = [
  { id: 1, title: 'Connect Wallet', description: 'Link your MetaMask or WalletConnect wallet', image: svg1 },
  { id: 2, title: 'Create Contract', description: 'Define scope, milestones, and payment terms', image: svg2 },
  { id: 3, title: 'Sign & Escrow', description: 'Both parties sign and funds go into escrow', image: svg3 },
  { id: 4, title: 'Complete & Pay', description: 'Approve milestones to release payments', image: svg4 }
];

interface WorkFlowProps {
  steps?: WorkflowStep[];
}

const WorkFlow: React.FC<WorkFlowProps> = ({ steps = defaultSteps }) => {
  return (
    <section className={styles.workflowSection}>
      <div className={styles.workflowContainer}>
        {/* Step 1 - Top Left */}
        <div className={styles.stepWrapper}>
          <img src={steps[0].image} alt="1" className={styles.numberImage} />
          <div className={styles.stepContent}>
            <h4 className={styles.stepTitle}>{steps[0].title}</h4>
            <p className={styles.stepDesc}>{steps[0].description}</p>
          </div>
        </div>

        {/* Step 2 - Top Right (50% down) */}
        <div className={`${styles.stepWrapper} ${styles.step2}`}>
          <div className={styles.stepContent}>
            <h4 className={styles.stepTitle}>{steps[1].title}</h4>
            <p className={styles.stepDesc}>{steps[1].description}</p>
          </div>
          <img src={steps[1].image} alt="2" className={styles.numberImage} />
        </div>

        {/* Step 3 - Bottom Left (100% down) */}
        <div className={`${styles.stepWrapper} ${styles.step3}`}>
          <img src={steps[2].image} alt="3" className={styles.numberImage} />
          <div className={styles.stepContent}>
            <h4 className={styles.stepTitle}>{steps[2].title}</h4>
            <p className={styles.stepDesc}>{steps[2].description}</p>
          </div>
        </div>

        {/* Step 4 - Bottom Right (150% down) */}
        <div className={`${styles.stepWrapper} ${styles.step4}`}>
          <div className={styles.stepContent}>
            <h4 className={styles.stepTitle}>{steps[3].title}</h4>
            <p className={styles.stepDesc}>{steps[3].description}</p>
          </div>
          <img src={steps[3].image} alt="4" className={styles.numberImage} />
        </div>

        {/* Connector lines - 2 right lines and 1 left line */}
        <img src={rightLine} alt="connector-1-2" className={styles.lineRight1} />
        <img src={leftLine} alt="connector-2-3" className={styles.lineLeft} />
        <img src={rightLine} alt="connector-3-4" className={styles.lineRight2} />
      </div>
    </section>
  );
};

export default WorkFlow;
