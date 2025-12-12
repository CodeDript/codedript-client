import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './pageCotractD.module.css';
import authStyles from '../../../components/auth/AuthForm.module.css';
import heroOutlineup from '../../../assets/Login/cardBackgroundup.svg';
import heroOutlinedown from '../../../assets/Login/cardBackgrounddown.svg';
import securityIcon from '../../../assets/svg/iconsax-security.svg';
import Button2 from '../../../components/button/Button2/Button2';
import Button3Black1 from '../../../components/button/Button3Black1/Button3Black1';
import DetailsStep from './pageComponent/DetailsStep';
import PartiesStep from './pageComponent/PartiesStep';
import PaymentStep from './pageComponent/PaymentStep';
import FilesTermsStep from './pageComponent/FilesTermsStep';
import ReviewStep from './pageComponent/ReviewStep';
import projectIcon from '../../../assets/contractSvg/project details.svg';
import partiesIcon from '../../../assets/contractSvg/parties.svg';
import paymentIcon from '../../../assets/contractSvg/paymentTerms.svg';
import filesIcon from '../../../assets/contractSvg/files & terms.svg';
import reviewIcon from '../../../assets/contractSvg/Review.svg';
import ChatWidget from '../../../components/chat/ChatWidget';
import Footer from '../../../components/footer/Footer';

const PageCotractD: React.FC = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('Website Redesign Project');
  const [description, setDescription] = useState('Describe the project scope, deliverables, and requirement');
  // developerWallet: the developer's profile wallet (used to fetch developer info)
  const [developerWallet, setDeveloperWallet] = useState('');
  // developerReceivingAddress: the Ethereum address the client will send payments to
  const [developerReceivingAddress, setDeveloperReceivingAddress] = useState('');
  // gigId: optional ID used to fetch the gig and obtain developer wallet
  const [gigId, setGigId] = useState<string | undefined>(undefined);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  // Track if viewing as developer (from incoming agreement) - disables previous button
  const [isDeveloperView, setIsDeveloperView] = useState(false);
  // Track if viewing as client (from pending agreement) - shows review step
  const [isClientView, setIsClientView] = useState(false);

  // Mock form data
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFilesCids, setUploadedFilesCids] = useState<string[]>([]);

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
  // payment confirmation (developer accepted contract)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isAcceptingAgreement, setIsAcceptingAgreement] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [clientApproved, setClientApproved] = useState(false);
  const [isApprovingAgreement, setIsApprovingAgreement] = useState(false);
  // Store project files IPFS hash for download functionality
  const [projectFilesIpfsHash, setProjectFilesIpfsHash] = useState<string>('');

  // Allow ReviewStep to update clientApproved state
  React.useEffect(() => {
    (window as any).__setClientApproved = setClientApproved;
    return () => {
      delete (window as any).__setClientApproved;
    };
  }, []);

  const { state: routeState } = useLocation();

  useEffect(() => {
    if (routeState) {
      // Check if this is a client viewing a pending agreement for review
      if (routeState.agreementId && routeState.isClientView) {
        setIsClientView(true);
        setStep(5); // Go directly to review step
        
        // Load agreement details from route state
        if (routeState.agreement) {
          const agreement = routeState.agreement;
          setTitle(agreement.project?.name || '');
          setDescription(agreement.project?.description || '');
          setValue(agreement.financials?.totalValue?.toString() || '0');
          setCurrency(agreement.financials?.currency || 'ETH');
          setDeadline(agreement.project?.expectedEndDate ? new Date(agreement.project.expectedEndDate).toLocaleDateString() : '');
          setClientName(agreement.clientInfo?.name || agreement.client?.profile?.name || '');
          setClientEmail(agreement.clientInfo?.email || agreement.client?.email || '');
          setClientWallet(agreement.clientInfo?.walletAddress || agreement.client?.walletAddress || '');
          setDeveloperWallet(agreement.developerInfo?.walletAddress || agreement.developer?.walletAddress || '');
          setDeveloperReceivingAddress(agreement.developerInfo?.walletAddress || '');
          setFilesNote(agreement.terms?.additionalTerms || '');
          
          // Load milestones if available
          if (agreement.milestones && agreement.milestones.length > 0) {
            const loadedMilestones = agreement.milestones.map((m: any) => ({
              title: m.title || '',
              amount: m.financials?.value?.toString() || m.amount?.toString() || '0'
            }));
            setMilestones(loadedMilestones);
          }
        }
      }
      // Check if this is a developer viewing an incoming agreement
      else if (routeState.agreementId && routeState.isDeveloperView) {
        setIsDeveloperView(true);
        setStep(4); // Go directly to payment step
        
        // Load agreement details from route state
        if (routeState.agreement) {
          const agreement = routeState.agreement;
          setTitle(agreement.project?.name || '');
          setDescription(agreement.project?.description || '');
          setValue(agreement.financials?.totalValue?.toString() || '0');
          setCurrency(agreement.financials?.currency || 'ETH');
          setDeadline(agreement.project?.expectedEndDate ? new Date(agreement.project.expectedEndDate).toLocaleDateString() : '');
          setClientName(agreement.clientInfo?.name || agreement.client?.profile?.name || '');
          setClientEmail(agreement.clientInfo?.email || agreement.client?.email || '');
          setClientWallet(agreement.clientInfo?.walletAddress || agreement.client?.walletAddress || '');
          setDeveloperWallet(agreement.developerInfo?.walletAddress || agreement.developer?.walletAddress || '');
          setDeveloperReceivingAddress(agreement.developerInfo?.walletAddress || '');
          
          // Extract project files IPFS hash for download functionality
          if (agreement.documents?.projectFiles && agreement.documents.projectFiles.length > 0) {
            setProjectFilesIpfsHash(agreement.documents.projectFiles[0].ipfsHash || '');
          } else if (agreement.documents?.contractPdf?.ipfsHash) {
            setProjectFilesIpfsHash(agreement.documents.contractPdf.ipfsHash);
          }
          
          // Load milestones if available
          if (agreement.milestones && agreement.milestones.length > 0) {
            const loadedMilestones = agreement.milestones.map((m: any) => ({
              title: m.title || '',
              amount: m.amount?.toString() || '0'
            }));
            setMilestones(loadedMilestones);
          }
        }
      } else {
        // populate from passed package data when available (client flow)
        if (routeState.title) setTitle(routeState.title);
        if (routeState.description) setDescription(Array.isArray(routeState.description) ? routeState.description.join('\n') : routeState.description);
        // if gigId is provided, the component will fetch the gig to obtain developer details
        if (routeState.gigId) setGigId(routeState.gigId);
        // routeState.developerId represents the developer's profile wallet (used to fetch profile) - legacy support
        if (routeState.developerId) setDeveloperWallet(routeState.developerId);
        // routeState.developerWallet is the preferred way to pass developer wallet from gig flow
        if (routeState.developerWallet) setDeveloperWallet(routeState.developerWallet);
        // Get client info from route state (passed from contract processing after MetaMask connection)
        if (routeState.clientWallet) setClientWallet(routeState.clientWallet);
        if (routeState.clientName) setClientName(routeState.clientName);
        if (routeState.clientEmail) setClientEmail(routeState.clientEmail);
        // do NOT auto-fill the receiving address from the developer profile; client must enter it
      }
    }
  }, [routeState]);

  const navigate = useNavigate();

  const next = async () => {
    // If moving from step 3 (FilesTermsStep) to step 4, upload files to IPFS first
    if (step === 3 && uploadedFiles.length > 0) {
      setIsUploadingFiles(true);
      // Mock file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockCids = uploadedFiles.map((_, i) => `Qm${Math.random().toString(36).substring(7)}`);
      setUploadedFilesCids(mockCids);
      setIsUploadingFiles(false);
      console.log('Mock files uploaded to IPFS. CIDs:', mockCids);
    }
    
    setStep((s) => Math.min(5, s + 1));
  };
  
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const navigateBack = () => {
    // go back to previous page (likely the gig / package card)
    navigate(-1);
  };

  const handleCreateContract = async () => {
    console.log('handleCreateContract called');
    
    // Upload files to IPFS first if any files are present
    let uploadedCids: string[] = [];
    if (uploadedFiles.length > 0) {
      console.log('Uploading files to IPFS...');
      setIsUploadingFiles(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      uploadedCids = uploadedFiles.map((_, i) => `Qm${Math.random().toString(36).substring(7)}`);
      setUploadedFilesCids(uploadedCids);
      setIsUploadingFiles(false);
      console.log('Mock files uploaded to IPFS. CIDs:', uploadedCids);
    }
    
    // Mock agreement creation
    console.log('Mock: Creating agreement with data:', {
      projectName: title,
      projectDescription: description,
      clientName,
      clientEmail,
      clientWallet,
      developerReceivingAddress,
      totalValue: value,
      currency,
      deadline,
      milestones,
      filesNote,
      uploadedFilesCids: uploadedCids
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Agreement created successfully! (Mock Mode)');
    
    // Navigate to client profile page after successful agreement creation
    navigate('/client');
  };

  const handleFinish = () => {
    // assemble payload similar to create (send to rules view for review/confirmation)
    const payload = {
      title,
      description,
      developerWallet,
      developerReceivingAddress,
      clientName,
      clientEmail,
      clientWallet,
      value,
      currency,
      deadline,
      milestones,
      filesNote,
      files: uploadedFiles.map((f: any) => ({ name: f.name, size: f.size })),
    };
    // navigate to the contract rules page inside contractView
    navigate('/create-contract/rules', { state: payload });
  };

  const handleDeveloperAccept = async () => {
    if (!routeState?.agreementId) {
      setAcceptError('Agreement ID not found');
      return;
    }

    setIsAcceptingAgreement(true);
    setAcceptError(null);

    try {
      // Mock API call - simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Developer accepted agreement successfully (Mock Mode)');
      console.log('Mock data:', {
        agreementId: routeState.agreementId,
        totalValue: parseFloat(value) || 0,
        currency: currency,
        milestones
      });
      
      // Navigate to developer profile
      navigate('/developer');
    } catch (error: any) {
      console.error('Error accepting agreement:', error);
      setAcceptError(error.message || 'Failed to accept agreement');
    } finally {
      setIsAcceptingAgreement(false);
    }
  };

  const handleClientApprove = async () => {
    if (!routeState?.agreementId) {
      setAcceptError('Agreement ID not found');
      return;
    }

    if (!routeState?.agreement) {
      setAcceptError('Agreement details not found');
      return;
    }

    setIsApprovingAgreement(true);
    setAcceptError(null);

    try {
      const agreement = routeState.agreement;
      
      // Mock blockchain agreement creation
      console.log('📝 Creating agreement on blockchain... (Mock Mode)');
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      const mockIpfsHash = 'Qm' + Math.random().toString(36).substr(2, 44);
      
      console.log('Mock blockchain transaction:', {
        transactionHash: mockTxHash,
        ipfsHash: mockIpfsHash,
        projectName: agreement?.project?.name || title,
        totalValue: agreement?.financials?.totalValue?.toString() || value,
      });
      
      console.log('✅ Agreement approved and activated successfully (Mock Mode)');
      console.log('✅ ETH transferred to smart contract escrow (Mock Mode)');
      
      // Navigate to client profile
      navigate('/client');
    } catch (error: any) {
      console.error('Error approving agreement:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to approve agreement';
      
      if (error.message) {
        if (error.message.includes('user rejected') || error.message.includes('User denied')) {
          errorMessage = 'Transaction was rejected in MetaMask';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient ETH balance to complete transaction';
        } else if (error.message.includes('Start date must be in the future')) {
          errorMessage = 'Start date validation failed. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setAcceptError(errorMessage);
    } finally {
      setIsApprovingAgreement(false);
    }
  };

  // handlers used by UI of the action buttons
  const leftButtonText = step === 1 ? '← Previous' : '← Previous';
  const leftIsDisabled = isDeveloperView || isClientView; // Disable previous button for developer/client view
  const leftHandler = leftIsDisabled ? () => {} : (step === 1 ? navigateBack : prev);

  const rightIsCreate = step === 3 && !isDeveloperView && !isClientView; // files & terms (client flow only)
  const rightIsDeveloperAccept = step === 4 && isDeveloperView; // developer accepting (enabled when paymentConfirmed)
  const rightIsClientApprove = step === 5 && isClientView; // client approving (enabled when clientApproved)
  const rightIsDisabled = (step === 4 && !paymentConfirmed && isDeveloperView) || (step === 4 && !paymentConfirmed && !isDeveloperView) || (step === 5 && !clientApproved && isClientView); // disabled until checkbox confirmed
  
  // when on the final review step (5), finish should navigate to rules page
  const rightHandler = rightIsCreate 
    ? handleCreateContract 
    : (rightIsDeveloperAccept && paymentConfirmed
      ? handleDeveloperAccept 
      : (rightIsClientApprove && clientApproved
        ? handleClientApprove
        : (rightIsDisabled ? () => {} : (step === 5 && !isClientView ? handleFinish : next))));
  
  const rightText = isUploadingFiles || isAcceptingAgreement || isApprovingAgreement
    ? (rightIsCreate ? 'Creating Agreement...' : (isAcceptingAgreement ? 'Accepting Agreement...' : (isApprovingAgreement ? 'Processing Payment...' : 'Uploading Files...')))
    : (rightIsCreate ? 'Create Contract' : (rightIsDeveloperAccept ? 'Accept & Submit to Client' : (rightIsClientApprove ? 'Approve & Pay' : (step < 5 ? 'Next' : 'Finish'))));

  return (
    <div className={styles.container1}>
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
              <img src={paymentIcon} alt="processing state" className={styles.stepIconImg} />
              processing state
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
          
          {acceptError && (
            <div style={{padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '12px', color: '#c00'}}>
              {acceptError}
            </div>
          )}
          
          <div className={styles.cardBody}>
            {step === 1 && (
              <DetailsStep
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                developerReceivingAddress={developerReceivingAddress}
                setDeveloperReceivingAddress={setDeveloperReceivingAddress}
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
                developerWallet={developerWallet}
                gigId={gigId}
                developerReceivingAddress={developerReceivingAddress}
              />
            )}
            {step === 3 && (
              <FilesTermsStep filesNote={filesNote} setFilesNote={setFilesNote} files={uploadedFiles} setFiles={setUploadedFiles} />
            )}
            {step === 4 && (
              <PaymentStep
                title={title}
                description={description}
                developerWallet={developerWallet}
                developerReceivingAddress={developerReceivingAddress}
                clientName={clientName}
                clientEmail={clientEmail}
                value={value}
                setValue={setValue}
                currency={currency}
                setCurrency={setCurrency}
                deadline={deadline}
                setDeadline={setDeadline}
                milestones={milestones}
                setMilestones={setMilestones}
                paymentConfirmed={paymentConfirmed}
                setPaymentConfirmed={setPaymentConfirmed}
                isDeveloperView={isDeveloperView}
                projectFilesIpfsHash={projectFilesIpfsHash}
              />
            )}
            
            {step === 5 && (
              <ReviewStep
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
        <ChatWidget />
        
      </div>
      
    </div>
    <Footer />
    
 </div>
  );
};

export default PageCotractD;
