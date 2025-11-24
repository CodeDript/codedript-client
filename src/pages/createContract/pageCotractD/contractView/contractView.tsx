import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './contractsViewBase.module.css';
import authStyles from '../../../../components/auth/AuthForm.module.css';
import heroOutlineup from '../../../../assets/Login/cardBackgroundup.svg';
import heroOutlinedown from '../../../../assets/Login/cardBackgrounddown.svg';

import DetailsStep from '../pageComponent/DetailsStep';
import PartiesStep from '../pageComponent/PartiesStep';
import FilesTermsStep from '../pageComponent/FilesTermsStep';
import PaymentStep from '../pageComponent/PaymentStep';
import ReviewStep from '../pageComponent/ReviewStep';
// icons removed for contractView (project details and step icons)
import Rulrs from './Rulrs';
import Button2 from '../../../../components/button/Button2/Button2';
import Button3Black1 from '../../../../components/button/Button3Black1/Button3Black1';
import ContractSummary from './ContractSummary';

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
  // uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // payment confirmation (developer accepted contract)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const location = useLocation();
  const { state: routeState } = location;

  useEffect(() => {
    if (routeState) {
      // populate from passed package data when available
      if (routeState.title) setTitle(routeState.title);
      if (routeState.description) setDescription(Array.isArray(routeState.description) ? routeState.description.join('\n') : routeState.description);
      if (routeState.developerId) setDeveloperId(routeState.developerId);
      // if an agreement object is passed in route state, populate common fields
      if (routeState.agreement) {
        const ag = routeState.agreement as any;
        if (ag.project?.name) setTitle(ag.project.name);
        if (ag.project?.description) setDescription(ag.project.description);
        if (ag.developer?.walletAddress) setDeveloperId(ag.developer.walletAddress);
        if (ag.milestones && Array.isArray(ag.milestones)) setMilestones(ag.milestones.map((m: any) => ({ title: m.title || '', amount: m.amount || '0', due: m.due || undefined, status: m.status })));
        if (ag.deadline) setDeadline(ag.deadline);
        if (ag.financials) {
          setValue(ag.financials.totalValue || value);
          setCurrency(ag.financials.currency || currency);
        }
        if (ag.client?.profile?.name) setClientName(ag.client.profile.name);
        if (ag.developer?.profile?.name) {
          // developerName is defined as const state; we can't set it, but we'll leave title/developerId updates above
        }
      }
    }
  }, [routeState]);

  const navigate = useNavigate();

  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const navigateBack = () => {
    // go back to previous page (likely the gig / package card)
    navigate(-1);
  };

  const handleCreateContract = () => {
    // assemble payload (placeholder - replace with real API call)
    const payload = {
      title,
      description,
      developerId,
      clientName,
      clientEmail,
      clientWallet,
      value,
      currency,
      deadline,
      milestones,
      filesNote,
      files: uploadedFiles.map((f) => ({ name: f.name, size: f.size })),
    };

    console.log('Create contract payload', payload);
    // TODO: call real api to create contract

    // advance the flow to the Payment Terms step (step 4)
    setStep(4);
  };

  // handlers used by UI of the action buttons
  const leftButtonText = step === 1 ? '← Previous' : '← Previous';
  const leftHandler = step === 1 ? navigateBack : prev;

  const rightIsCreate = step === 3; // files & terms
  const rightIsDisabled = step === 4 && paymentConfirmed; // payment step locked until confirm
  const rightHandler = rightIsCreate ? handleCreateContract : (rightIsDisabled ? () => {} : next);
  const rightText = rightIsCreate ? 'Create Contract' : (step < 5 ? 'Next' : 'Finish');

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* reuse AuthForm card layout */}
        <div className={authStyles.formOuter}>
          <img src={heroOutlineup} alt="outline" className={`${authStyles.outline} ${authStyles.outlineTop}`} />
          <img src={heroOutlinedown} alt="outline" className={`${authStyles.outline} ${authStyles.outlineBottom}`} />

          <div className={styles.contractHeader}>
            <div>
              <div className={styles.contractLabel}>Contract</div>
              <h2 className={styles.contractTitle}>{title}</h2>
              <div className={styles.contractSub}>with {clientName}</div>
            </div>
            <div className={styles.contractMeta}>
              <div className={styles.statusBadge}>Active</div>
              <div className={styles.createdDate}>Created Jan 01, 2024</div>
            </div>
          </div>

          <div className={authStyles.authBody}>
            {/* step icons removed for contractView (simplified view) */}

        <section className={styles.cardArea}>
          {/* decorative card badge (re-using auth form badge styles) */}

          <div className={authStyles.cardBadge} aria-hidden>Create Project</div>
          
          <div className={styles.cardBody}>
            {/* show a contract summary when agreement data is provided via route state */}
            {routeState && routeState.agreement && (
              <ContractSummary
                title={routeState.agreement.project?.name || title}
                description={routeState.agreement.project?.description || description}
                value={routeState.agreement.financials?.totalValue || value}
                currency={routeState.agreement.financials?.currency || currency}
                deadline={routeState.agreement.deadline || deadline}
                clientName={routeState.agreement.client?.profile?.name || clientName}
                developerName={routeState.agreement.developer?.profile?.name || developerName}
                milestones={routeState.agreement.milestones || milestones}
                
              />
            )}

                   
           
        
          
            
           
           
            

     
          </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageCotractD;
