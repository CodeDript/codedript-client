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
import { useTempData } from '../../../../context';
import { showAlert } from '../../../../components/auth/Alert';
import { useCreateGig } from '../../../../query/useGigs';


const CreateGigPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [developerWallet, setDeveloperWallet] = useState('');
  const [gigId, setGigId] = useState<string | undefined>(undefined);
  const [isClientView] = useState(false);
  const [priceingAgreed, setPriceingAgreed] = useState(false);

  // Use TempData context for gig data
  const { gigData, setGigTitle, setGigDescription, setGigPackages, setGigFiles, setGigFilesNote, resetGigData } = useTempData();
  
  // Use mutation hook for creating gig
  const { mutate: createGig, isPending: isCreatingGig } = useCreateGig();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientWallet, setClientWallet] = useState('');
  const [value] = useState('0');
  const [currency] = useState('ETH');
  const [deadline] = useState('');
  const [milestones] = useState([{ title: 'Initial', amount: '0' }]);
  const [acceptError] = useState<string | null>(null);
  const [, setClientApproved] = useState(false);

  React.useEffect(() => {
    (window as any).__setClientApproved = setClientApproved;
    return () => { delete (window as any).__setClientApproved; };
  }, []);

  const { state: routeState } = useLocation();

  useEffect(() => {
    if (routeState) {
      if (routeState.title) setGigTitle(routeState.title);
      if (routeState.description) setGigDescription(Array.isArray(routeState.description) ? routeState.description.join('\n') : routeState.description);
      if (routeState.gigId) setGigId(routeState.gigId);
      if (routeState.developerWallet) setDeveloperWallet(routeState.developerWallet);
      if (routeState.clientWallet) setClientWallet(routeState.clientWallet);
      if (routeState.clientName) setClientName(routeState.clientName);
      if (routeState.clientEmail) setClientEmail(routeState.clientEmail);
    }
  }, [routeState, setGigTitle, setGigDescription]);

  const navigate = useNavigate();

  const next = () => {
    setStep((s) => Math.min(4, s + 1));
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const navigateBack = () => navigate(-1);

  const handlePublishGig = async () => {
    // Validate required fields and show errors via snackbar
    if (!gigData.title || !gigData.description) {
      showAlert('Title and description are required', 'error');
      return;
    }

    if (!gigData.packages || gigData.packages.length === 0) {
      showAlert('At least one package is required', 'error');
      return;
    }

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append('title', gigData.title);
    formData.append('description', gigData.description);
    formData.append('packages', JSON.stringify(gigData.packages));
    
    // Add files if any
    gigData.files.forEach((file) => {
      formData.append('images', file);
    });

    createGig(formData as any, {
      onSuccess: (response) => {
        if (response?.success && response?.data) {
          showAlert(response.message || 'Gig created', 'success');
          resetGigData();
          // Navigate to developer page after showing the success snackbar
          setTimeout(() => navigate('/developer'), 1500);
        } else {
          const msg = response?.message || 'Failed to create gig';
          showAlert(msg, 'error');
        }
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.error?.message ||
                              error?.response?.data?.message ||
                              error?.message ||
                              'Failed to create gig';
        showAlert(errorMessage, 'error');
      },
    });
  };

  const leftButtonText = '← Previous';
  const leftIsDisabled = false;
  const leftHandler = leftIsDisabled ? () => {} : (step === 1 ? navigateBack : prev);

  // On step 4 (Publish), right button should publish the gig
  const rightIsPublish = step === 4;
  const rightIsDisabled = (step === 2 && !priceingAgreed) || isCreatingGig;

  const rightHandler = rightIsPublish 
    ? handlePublishGig 
    : (rightIsDisabled ? () => {} : next);

  const rightText = isCreatingGig 
    ? 'Publishing...' 
    : (rightIsPublish ? 'Publish Gig' : (step < 4 ? 'Next' : 'Finish'));

  return (
    <div className={styles.container1}>
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
                    title={gigData.title}
                    setTitle={setGigTitle}
                    description={gigData.description}
                    setDescription={setGigDescription}
                  />
                )}
                {step === 2 && (
                  <CreatePriceing 
                    onAgreeChange={setPriceingAgreed} 
                    onPackagesChange={setGigPackages}
                  />
                )}
                {step === 3 && (
                  <CreateFilesTermsStep 
                    filesNote={gigData.filesNote} 
                    setFilesNote={setGigFilesNote} 
                    files={gigData.files} 
                    setFiles={setGigFiles} 
                  />
                )}
                {step === 4 && (
                  <CreateReviewStep
                    title={gigData.title}
                    description={gigData.description}
                    developerWallet={developerWallet}
                    clientName={clientName}
                    clientEmail={clientEmail}
                    value={value}
                    currency={currency}
                    deadline={deadline}
                    milestones={milestones}
                    filesNote={gigData.filesNote}
                    files={gigData.files}
                    packages={gigData.packages}
                    isClientView={isClientView}
                  />
                )}

                <div className={styles.actions}>
                  <div className={styles.leftBtn} style={{ opacity: leftIsDisabled ? 0.6 : 1 }} aria-disabled={leftIsDisabled}>
                    <Button2 text={leftButtonText} onClick={() => leftHandler()} />
                  </div>
                  <div className={styles.rightBtn} style={{ opacity: rightIsDisabled || isCreatingGig ? 0.6 : 1 }} aria-disabled={rightIsDisabled || isCreatingGig}>
                    <Button3Black1 
                      text={rightText} 
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
    
        </div>
  );
};

export default CreateGigPage;
