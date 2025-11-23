import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './pageCotractD.module.css';
import authStyles from '../../../components/auth/AuthForm.module.css';
import heroOutlineup from '../../../assets/Login/cardBackgroundup.svg';
import heroOutlinedown from '../../../assets/Login/cardBackgrounddown.svg';
import securityIcon from '../../../assets/svg/iconsax-security.svg';
import Button2 from '../../../components/button/Button2/Button2';
import Button3Black1 from '../../../components/button/Button3Black1/Button3Black1';
import DetailsStep from '../pagesComponent/DetailsStep';
import PartiesStep from '../pagesComponent/PartiesStep';
import PaymentStep from '../pagesComponent/PaymentStep';
import FilesTermsStep from '../pagesComponent/FilesTermsStep';
import ReviewStep from '../pagesComponent/ReviewStep';
import projectIcon from '../../../assets/contractSvg/project details.svg';
import partiesIcon from '../../../assets/contractSvg/parties.svg';
import paymentIcon from '../../../assets/contractSvg/paymentTerms.svg';
import filesIcon from '../../../assets/contractSvg/files & terms.svg';
import reviewIcon from '../../../assets/contractSvg/Review.svg';

const PageCotractD: React.FC = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('Website Redesign Project');
  const [description, setDescription] = useState('Describe the project scope, deliverables, and requirement');
  const [developerId, setDeveloperId] = useState('0x23356745e898');

  // Parties
  const [clientName, setClientName] = useState('Devid kamron');
  const [clientEmail, setClientEmail] = useState('Devidkamronwest12@gmail.com');
  const [clientWallet, setClientWallet] = useState('0x23356745e898');
  const [developerName] = useState('Sia Kroven');
  const [developerEmail] = useState('connectsia kroven@gmail.com');

  // Payment
  const [value, setValue] = useState('5000');
  const [currency, setCurrency] = useState('ETH');
  const [deadline, setDeadline] = useState('Sep 23, 2025');
  const [milestones, setMilestones] = useState([{ title: 'Reasons', amount: '5000' }]);

  // Files & terms
  const [filesNote, setFilesNote] = useState('Any additional terms, conditions, or special requirement ...');

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
        {/* reuse AuthForm card layout */}
        <div className={authStyles.formOuter}>
          <img src={heroOutlineup} alt="outline" className={`${authStyles.outline} ${authStyles.outlineTop}`} />
          <img src={heroOutlinedown} alt="outline" className={`${authStyles.outline} ${authStyles.outlineBottom}`} />

          <div className={authStyles.authHeader}>
            <div className={authStyles.headerLeft}>
              <img src={securityIcon} alt="security" className={authStyles.securitySvg} />
              <div>
                <h1 className={authStyles.formTitle}>Contract Processing</h1>
              </div>
            </div>
            <p className={authStyles.formSubtext}>Discuss project requirements with developers for seamless execution</p>
          </div>

          <div className={authStyles.authBody}>
            <nav className={styles.stepsBar} aria-hidden>
          <div className={styles.stepIcons}>
            <div className={`${styles.stepItem} ${step===1?styles.active:''}`}>
              <img src={projectIcon} alt="Project details" className={styles.stepIconImg} />
              Project Details
            </div>
            <div className={`${styles.stepItem} ${step===2?styles.active:''}`}>
              <img src={partiesIcon} alt="Parties" className={styles.stepIconImg} />
              Parties
            </div>
            <div className={`${styles.stepItem} ${step===3?styles.active:''}`}>
              <img src={filesIcon} alt="Files and terms" className={styles.stepIconImg} />
              Files & Terms
            </div>
            <div className={`${styles.stepItem} ${step===4?styles.active:''}`}>
              <img src={paymentIcon} alt="Payment terms" className={styles.stepIconImg} />
              Payment Terms
            </div>
            <div className={`${styles.stepItem} ${step===5?styles.active:''}`}>
              <img src={reviewIcon} alt="Review" className={styles.stepIconImg} />
              Review
            </div>
          </div>
          <div className={styles.progress}><div style={{width: `${((step-1)/4)*100}%`}} className={styles.progressFill}></div></div>
        </nav>

        <section className={styles.cardArea}>
          {/* decorative card badge (re-using auth form badge styles) */}

          <div className={authStyles.cardBadge} aria-hidden>Create Project</div>
          
          <div className={styles.cardBody}>
            {step === 1 && (
              <DetailsStep
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                developerId={developerId}
                setDeveloperId={setDeveloperId}
              />
            )}
            {step === 2 && (
              <PartiesStep
                clientName={clientName}
                setClientName={setClientName}
                clientEmail={clientEmail}
                setClientEmail={setClientEmail}
                clientWallet={clientWallet}
                setClientWallet={setClientWallet}
                developerName={developerName}
                developerEmail={developerEmail}
                developerWallet={developerId}
              />
            )}
            {step === 3 && (
              <FilesTermsStep filesNote={filesNote} setFilesNote={setFilesNote} />
            )}
            {step === 4 && (
              <PaymentStep
                value={value}
                setValue={setValue}
                currency={currency}
                setCurrency={setCurrency}
                deadline={deadline}
                setDeadline={setDeadline}
                milestones={milestones}
                setMilestones={setMilestones}
              />
            )}
            
            {step === 5 && (
              <ReviewStep
                title={title}
                description={description}
                developerId={developerId}
                clientName={clientName}
                clientEmail={clientEmail}
                value={value}
                currency={currency}
                deadline={deadline}
                milestones={milestones}
                filesNote={filesNote}
              />
            )}
            <div className={styles.actions}>
              <div className={styles.leftBtn}><Button2 text="← Previous" onClick={prev} /></div>
              <div className={styles.rightBtn}><Button3Black1 text={step<5 ? 'Next ' : 'Finish'} onClick={next} /></div>
            </div>

     
          </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageCotractD;
