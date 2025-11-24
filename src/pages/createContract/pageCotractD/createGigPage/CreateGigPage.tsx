import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../pageCotractD.module.css';
import authStyles from '../../../../components/auth/AuthForm.module.css';
import heroOutlineup from '../../../../assets/Login/cardBackgroundup.svg';
import heroOutlinedown from '../../../../assets/Login/cardBackgrounddown.svg';
import Button2 from '../../../../components/button/Button2/Button2';
import Button3Black1 from '../../../../components/button/Button3Black1/Button3Black1';
import CreateDetailsStep from './CreateDetailsStep';
import CreatePriceing from './CreatePriceing';
import CreateFilesTermsStep from './CreateFilesTermsStep';
import CreateReviewStep from './CreateReviewStep';
import { useAgreement } from '../../../../context/AgreementContext';

const CreateGigPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('Website Redesign Project');
  const [description, setDescription] = useState('Describe the project scope, deliverables, and requirement');
  const [developerWallet, setDeveloperWallet] = useState('');
  const [developerReceivingAddress, setDeveloperReceivingAddress] = useState('');
  const [gigId, setGigId] = useState<string | undefined>(undefined);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isDeveloperView, setIsDeveloperView] = useState(false);
  const [isClientView, setIsClientView] = useState(false);
  const [priceingAgreed, setPriceingAgreed] = useState(false);

  const { uploadFilesToIPFS, updateFormData, formData, createAgreement } = useAgreement();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientWallet, setClientWallet] = useState('');
  

  const [value, setValue] = useState('0');
  const [currency, setCurrency] = useState('ETH');
  const [deadline, setDeadline] = useState('');
  const [milestones, setMilestones] = useState([{ title: 'Initial', amount: '0' }]);

  const [filesNote, setFilesNote] = useState('');
  const uploadedFiles = formData.uploadedFiles;
  const setUploadedFiles = (files: File[]) => updateFormData({ uploadedFiles: files });
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isAcceptingAgreement, setIsAcceptingAgreement] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [clientApproved, setClientApproved] = useState(false);
  const [isApprovingAgreement, setIsApprovingAgreement] = useState(false);
  const [projectFilesIpfsHash, setProjectFilesIpfsHash] = useState<string>('');

  React.useEffect(() => {
    (window as any).__setClientApproved = setClientApproved;
    return () => { delete (window as any).__setClientApproved; };
  }, []);

  const { state: routeState } = useLocation();

  useEffect(() => {
    if (routeState) {
      if (routeState.title) setTitle(routeState.title);
      if (routeState.description) setDescription(Array.isArray(routeState.description) ? routeState.description.join('\n') : routeState.description);
      if (routeState.gigId) setGigId(routeState.gigId);
      if (routeState.developerWallet) setDeveloperWallet(routeState.developerWallet);
      if (routeState.clientWallet) setClientWallet(routeState.clientWallet);
      if (routeState.clientName) setClientName(routeState.clientName);
      if (routeState.clientEmail) setClientEmail(routeState.clientEmail);
    }

    updateFormData({
      projectName: routeState?.title || title,
      projectDescription: routeState?.description || description,
      gigId: routeState?.gigId || gigId,
      developerWallet: routeState?.developerWallet || developerWallet,
      clientWallet: routeState?.clientWallet || clientWallet,
      clientName: routeState?.clientName || clientName,
      clientEmail: routeState?.clientEmail || clientEmail
    });
  }, [routeState]);

  const navigate = useNavigate();

  const next = async () => {
    if (step === 3 && uploadedFiles.length > 0) {
      setIsUploadingFiles(true);
      const result = await uploadFilesToIPFS();
      setIsUploadingFiles(false);
      if (!result.success) { alert(`File upload failed: ${result.error || 'Unknown error'}`); return; }
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const navigateBack = () => navigate(-1);

  const handleCreateContract = async () => {
    // minimal create action: store form into context and navigate to client
    updateFormData({ projectName: title, projectDescription: description, clientName, clientEmail, clientWallet });
    navigate('/client');
  };

  const leftButtonText = '← Previous';
  const leftIsDisabled = false;
  const leftHandler = leftIsDisabled ? () => {} : (step === 1 ? navigateBack : prev);

  // Requirements (3) proceeds to Publish (4) in the 4-step gig flow.
  const rightIsCreate = false;
  const rightIsDisabled = (step === 2 && !priceingAgreed);

  const rightHandler = rightIsCreate ? handleCreateContract : (rightIsDisabled ? () => {} : (step === 4 ? () => {} : next));

  const rightText = isUploadingFiles ? 'Uploading Files...' : (rightIsCreate ? 'Create Contract' : (step < 4 ? 'Next' : 'Finish'));

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={authStyles.formOuter}>
          <img src={heroOutlineup} alt="outline" className={`${authStyles.outline} ${authStyles.outlineTop}`} />
          <img src={heroOutlinedown} alt="outline" className={`${authStyles.outline} ${authStyles.outlineBottom}`} />

          <div className={authStyles.authHeader}>
            <div className={authStyles.headerLeft}>
              <div>
                <h1 className={authStyles.formTitle}>Create Gig</h1>
              </div>
            </div>
            <p className={authStyles.formSubtext}>Create a gig using the stepped flow</p>
          </div>

          <div className={authStyles.authBody}>
            <nav className={styles.stepsBar} aria-hidden>
              <div className={styles.stepIcons}>
                {[
                  {n:1,label:'Overview'},
                  {n:2,label:'Priceing'},
                  {n:3,label:'Requirements'},
                  {n:4,label:'Publish'}
                ].map(({n,label}) => (
                  <div key={n} className={`${styles.stepItem} ${step===n?styles.active:''}`} aria-current={step===n? 'step' : undefined}>
                    <div className={styles.stepNumber} aria-hidden>{n}</div>
                    <div className={styles.stepLabel}>{label}</div>
                  </div>
                ))}
              </div>
              <div className={styles.progress}><div style={{width: `${((step-1)/3)*100}%`}} className={styles.progressFill}></div></div>
            </nav>

            <section className={styles.cardArea}>
              <div className={authStyles.cardBadge} aria-hidden>Create Gig</div>
              {acceptError && (
                <div style={{padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '12px', color: '#c00'}}>
                  {acceptError}
                </div>
              )}

              <div className={styles.cardBody}>
                {step === 1 && (
                  <CreateDetailsStep
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    developerReceivingAddress={developerReceivingAddress}
                    setDeveloperReceivingAddress={setDeveloperReceivingAddress}
                  />
                )}
                {step === 2 && (
                  <CreatePriceing onAgreeChange={setPriceingAgreed} />
                )}
                {step === 3 && (
                  <CreateFilesTermsStep filesNote={filesNote} setFilesNote={setFilesNote} files={uploadedFiles} setFiles={setUploadedFiles} />
                )}
                {step === 4 && (
                  <CreateReviewStep
                    title={title}
                    description={description}
                    developerWallet={developerWallet}
                    developerReceivingAddress={developerReceivingAddress}
                    clientName={clientName}
                    clientEmail={clientEmail}
                    value={value}
                    currency={currency}
                    deadline={deadline}
                    milestones={milestones}
                    filesNote={filesNote}
                    files={uploadedFiles}
                    isClientView={isClientView}
                  />
                )}

                <div className={styles.actions}>
                  <div className={styles.leftBtn} style={{ opacity: leftIsDisabled ? 0.6 : 1 }} aria-disabled={leftIsDisabled}>
                    <Button2 text={leftButtonText} onClick={() => leftHandler()} />
                  </div>
                  <div className={styles.rightBtn} style={{ opacity: rightIsDisabled || isUploadingFiles ? 0.6 : 1 }} aria-disabled={rightIsDisabled || isUploadingFiles}>
                    <Button3Black1 
                      text={isUploadingFiles ? 'Uploading Files...' : rightText} 
                      onClick={() => rightHandler()} 
                    />
                  </div>
                </div>

              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGigPage;
