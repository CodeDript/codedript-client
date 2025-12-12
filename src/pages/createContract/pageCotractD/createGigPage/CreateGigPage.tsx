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


const CreateGigPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('Website Redesign Project');
  const [description, setDescription] = useState('Describe the project scope, deliverables, and requirement');
  const [developerWallet, setDeveloperWallet] = useState('');
  const [developerReceivingAddress, setDeveloperReceivingAddress] = useState('');
  const [gigId, setGigId] = useState<string | undefined>(undefined);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isClientView] = useState(false);
  const [priceingAgreed, setPriceingAgreed] = useState(false);
  const [isCreatingGig, setIsCreatingGig] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Mock form data
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientWallet, setClientWallet] = useState('');
  

  const [value] = useState('0');
  const [currency] = useState('ETH');
  const [deadline] = useState('');
  const [milestones] = useState([{ title: 'Initial', amount: '0' }]);

  const [filesNote, setFilesNote] = useState('');
  const [acceptError] = useState<string | null>(null);
  const [, setClientApproved] = useState(false);

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

    // Mock - log form data instead of storing
    console.log('Mock: Form data from route state', {
      projectName: routeState?.title || title,
      projectDescription: routeState?.description || description,
      gigId: routeState?.gigId || gigId,
      developerWallet: routeState?.developerWallet || developerWallet,
      clientWallet: routeState?.clientWallet || clientWallet,
      clientName: routeState?.clientName || clientName,
      clientEmail: routeState?.clientEmail || clientEmail,
      developerReceivingAddress: developerReceivingAddress
    });
  }, [routeState]);

  const navigate = useNavigate();

  const next = async () => {
    if (step === 3 && uploadedFiles.length > 0) {
      setIsUploadingFiles(true);
      // Mock file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Mock: Files uploaded to IPFS');
      setIsUploadingFiles(false);
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const navigateBack = () => navigate(-1);

  const handlePublishGig = async () => {
    setIsCreatingGig(true);
    setCreateError(null);

    try {
      // Mock - packages would come from CreatePriceing step
      const packages: any[] = [];
      
      // Mock - category would come from CreateDetailsStep
      const category = 'other';

      // Calculate pricing from packages (use first package as base pricing)
      const basePackage = packages.find((p: any) => p.name === 'Basic') || packages[0];
      const pricingAmount = basePackage ? basePackage.price : 0;
      const pricingCurrency = basePackage ? basePackage.currency : 'ETH';
      const deliveryTime = basePackage ? basePackage.deliveryTime : 7;
      const revisions = basePackage ? basePackage.revisions : 2;

      // Create gig data
      const gigData = {
        title,
        description,
        category,
        receivingAddress: developerReceivingAddress,
        requirements: filesNote,
        packages: packages.map((pkg: any) => ({
          name: pkg.name,
          price: pkg.price,
          currency: pkg.currency,
          deliveryTime: pkg.deliveryTime,
          revisions: pkg.revisions,
          features: pkg.features || []
        })),
        pricingType: 'fixed' as const,
        pricingAmount,
        pricingCurrency,
        deliveryTime,
        revisions,
        tags: [],
        status: 'active' as const,
        images: uploadedFiles
      };

      // Call the mock API
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success response
      const mockGigId = `gig-${Date.now()}`;
      console.log('Mock: Gig created successfully', { gigData, mockGigId });
      
      // Success - navigate to the created gig or developer dashboard
      alert('Gig created successfully! (Mock Mode)');
      navigate(`/gigview/${mockGigId}`);
    } catch (error: any) {
      console.error('Error creating gig:', error);
      setCreateError(error.message || 'An unexpected error occurred');
    } finally {
      setIsCreatingGig(false);
    }
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
    : isUploadingFiles 
    ? 'Uploading Files...' 
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
              {createError && (
                <div style={{padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '12px', color: '#c00'}}>
                  {createError}
                </div>
              )}
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
                  <div className={styles.rightBtn} style={{ opacity: rightIsDisabled || isUploadingFiles || isCreatingGig ? 0.6 : 1 }} aria-disabled={rightIsDisabled || isUploadingFiles || isCreatingGig}>
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
