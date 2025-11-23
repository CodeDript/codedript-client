import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './pageCotractD.module.css';
import Button2 from '../../../components/button/Button2/Button2';
import Button3Black1 from '../../../components/button/Button3Black1/Button3Black1';

const PageCotractD: React.FC = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('Website Redesign Project');
  const [description, setDescription] = useState('Describe the project scope, deliverables, and requirement');
  const [developerId, setDeveloperId] = useState('0x23356745e898');

  const { state: routeState } = useLocation();

  useEffect(() => {
    if (routeState) {
      // populate from passed package data when available
      if (routeState.title) setTitle(routeState.title);
      if (routeState.description) setDescription(Array.isArray(routeState.description) ? routeState.description.join('\n') : routeState.description);
      if (routeState.developerId) setDeveloperId(routeState.developerId);
    }
  }, [routeState]);

  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>Contract Processing</h1>
          <p className={styles.sub}>Discuss project requirements with developers for seamless execution</p>
        </header>

        <nav className={styles.stepsBar} aria-hidden>
          <div className={styles.stepIcons}>
            <div className={`${styles.stepItem} ${step===1?styles.active:''}`}>Project Details</div>
            <div className={`${styles.stepItem} ${step===2?styles.active:''}`}>Parties</div>
            <div className={`${styles.stepItem} ${step===3?styles.active:''}`}>Payment Terms</div>
            <div className={`${styles.stepItem} ${step===4?styles.active:''}`}>Files & Terms</div>
            <div className={`${styles.stepItem} ${step===5?styles.active:''}`}>Review</div>
          </div>
          <div className={styles.progress}><div style={{width: `${((step-1)/4)*100}%`}} className={styles.progressFill}></div></div>
        </nav>

        <section className={styles.cardArea}>
          <div className={styles.cardHeader}>Create Project</div>
          <div className={styles.cardBody}>
            <h4 className={styles.sectionTitle}>Project Details</h4>
            <div className={styles.formRow}>
              <label>Project Title :</label>
              <input value={title} onChange={(e)=>setTitle(e.target.value)} />
            </div>

            <div className={styles.formRow}>
              <label>Project Description :</label>
              <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} />
            </div>

            <div className={styles.formRow}>
              <label>Developer ID :</label>
              <input value={developerId} onChange={(e)=>setDeveloperId(e.target.value)} />
            </div>

            <div className={styles.actions}>
              <div className={styles.leftBtn}><Button2 text="← Previous" onClick={prev} /></div>
              <div className={styles.rightBtn}><Button3Black1 text={step<5 ? 'Next ' : 'Finish'} onClick={next} /></div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PageCotractD;
