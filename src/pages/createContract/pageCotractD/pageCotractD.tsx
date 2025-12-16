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
import { useAgreementData } from '../../../context/AgreementDataContext';
import { agreementsApi } from '../../../api/agreements.api';
import { showAlert } from '../../../components/auth/Alert';
import { useGig } from '../../../query/useGigs';
import { useUpdateAgreement, useUpdateAgreementStatus } from '../../../query/useAgreements';
import { useCreateAgreement } from '../../../query/useAgreements';

const PageCotractD: React.FC = () => {
  const { agreementData, setProjectDetails, setPartiesDetails, setFilesAndTerms, setPaymentDetails, setGigId: setContextGigId, setDeveloperReceivingAddress: setContextDeveloperAddress, resetAgreementData } = useAgreementData();
  const [step, setStep] = useState(1);
  const [gigId, setGigId] = useState<string | undefined>(undefined);
  const [packageId, setPackageId] = useState<string | undefined>(undefined);
  const gigQuery = useGig(gigId || '');
  const updateAgreementMutation = useUpdateAgreement();
  const updateStatusMutation = useUpdateAgreementStatus();
  const createAgreementMutation = useCreateAgreement();
  const [title, setTitle] = useState('Website Redesign Project');
  const [description, setDescription] = useState('Describe the project scope, deliverables, and requirement');
  // developerWallet: the developer's profile wallet (used to fetch developer info)
  const [developerWallet, setDeveloperWallet] = useState('');
  // developerReceivingAddress: the Ethereum address the client will send payments to
  const [developerReceivingAddress, setDeveloperReceivingAddress] = useState('');
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
  const [milestones, setMilestones] = useState([{ title: 'Reasons' }]);

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
      // Route state received; populate fields when present
      // Extract gigId and packageId from route state
      if (routeState.gigId) {
        setGigId(routeState.gigId);
      }
      if (routeState.packageId) {
        setPackageId(routeState.packageId);
      }
      
      // Check if this is a client viewing a pending agreement for review
      if (routeState.agreementId && routeState.isClientView) {
        setIsClientView(true);
        setStep(5); // Go directly to review step
        
        // Load agreement details from route state
        if (routeState.agreement) {
          const agreement = routeState.agreement;
          
          // Set basic agreement info (direct fields)
          setTitle(agreement.title || '');
          setDescription(agreement.description || '');
          setValue(agreement.financials?.totalValue?.toString() || '0');
          setCurrency('ETH'); // Default currency
          
          // Format deadline
          if (agreement.endDate) {
            const endDate = new Date(agreement.endDate);
            setDeadline(endDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD for date input
          }
          
          // Extract client info (populated User object)
          if (typeof agreement.client === 'object' && agreement.client) {
            setClientName(agreement.client.fullname || agreement.client.username || '');
            setClientEmail(agreement.client.email || '');
            setClientWallet(agreement.client.walletAddress || '');
          }
          
          // Extract developer info (populated User object)
          if (typeof agreement.developer === 'object' && agreement.developer) {
            setDeveloperWallet(agreement.developer.walletAddress || '');
            setDeveloperReceivingAddress(agreement.developer.walletAddress || '');
          }
          
          // Extract terms/notes (if available)
          setFilesNote(agreement.terms || agreement.additionalTerms || '');
          
          // Extract project files IPFS hash (documents is array)
          if (Array.isArray(agreement.documents) && agreement.documents.length > 0) {
            setProjectFilesIpfsHash(agreement.documents[0].ipfsHash || '');
          }
          
          // Load milestones if available
          if (agreement.milestones && agreement.milestones.length > 0) {
            const loadedMilestones = agreement.milestones.map((m: any) => ({
              title: m.title || m.name || ''
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
          
          // Set basic agreement info (direct fields)
          setTitle(agreement.title || '');
          setDescription(agreement.description || '');
          setValue(agreement.financials?.totalValue?.toString() || '0');
          setCurrency('ETH'); // Default currency
          
          // Format deadline
          if (agreement.endDate) {
            const endDate = new Date(agreement.endDate);
            setDeadline(endDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD for date input
          }
          
          // Extract client info (populated User object)
          if (typeof agreement.client === 'object' && agreement.client) {
            setClientName(agreement.client.fullname || agreement.client.username || '');
            setClientEmail(agreement.client.email || '');
            setClientWallet(agreement.client.walletAddress || '');
          }
          
          // Extract developer info (populated User object)
          if (typeof agreement.developer === 'object' && agreement.developer) {
            setDeveloperWallet(agreement.developer.walletAddress || '');
            setDeveloperReceivingAddress(agreement.developer.walletAddress || '');
          }
          
          // Extract project files IPFS hash (documents is array)
          if (Array.isArray(agreement.documents) && agreement.documents.length > 0) {
            setProjectFilesIpfsHash(agreement.documents[0].ipfsHash || '');
          }
          
          // Load milestones if available
          if (agreement.milestones && agreement.milestones.length > 0) {
            const loadedMilestones = agreement.milestones.map((m: any) => ({
              title: m.title || m.name || ''
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
    setIsUploadingFiles(true);
    
    try {
      // Sync all data to context before creating agreement
      setProjectDetails(title, description);
      setPartiesDetails(clientName, clientEmail, clientWallet, developerWallet);
      setFilesAndTerms(uploadedFiles, filesNote);
      setPaymentDetails(value, currency, deadline, milestones);
      if (gigId) setContextGigId(gigId);
      if (developerReceivingAddress) setContextDeveloperAddress(developerReceivingAddress);
      
      // Validate required data
      if (!gigId) {
        showAlert('Gig ID is required to create an agreement', 'error');
        return;
      }

      if (!packageId) {
        showAlert('Package ID is required to create an agreement', 'error');
        return;
      }

      if (!gigQuery.data) {
        showAlert('Gig data not loaded. Please wait and try again.', 'error');
        return;
      }

      const gig = gigQuery.data as any;
      const developerId = typeof gig.developer === 'object' ? gig.developer._id : gig.developer;
      
      console.log('🔍 Agreement Data Debug:');
      console.log('  - Developer ID:', developerId);
      console.log('  - Gig ID:', gigId);
      console.log('  - Package ID:', packageId);
      console.log('  - Title:', title);
      console.log('  - Description:', description);
      console.log('  - Milestones:', milestones);
        // Agreement creation: prepare and send FormData
      
      // Prepare FormData for file upload
      const formData = new FormData();
      
      // Required fields per server validation
      formData.append('developer', developerId);
      formData.append('gig', gigId);
      formData.append('packageId', packageId);
      formData.append('title', title);
      formData.append('description', description);
      
      // Milestones (stringify as JSON)
      formData.append('milestones', JSON.stringify(milestones));
      
      // Append documents (not projectFiles)
      uploadedFiles.forEach((file) => {
        formData.append('documents', file);
      });
      
      console.log('📤 Creating agreement via API...');
      console.log('📋 FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [File] ${value.name}`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }
      // Call the API via mutation so React Query invalidates caches
      const response = await createAgreementMutation.mutateAsync(formData as any);

      console.log('✅ Agreement created successfully:', response);
      // Show success message
      showAlert(response.message || 'Agreement created successfully!', 'success');
      
      // Reset context and navigate
      resetAgreementData();
      
      // Navigate to client profile after short delay
      setTimeout(() => {
        navigate('/client');
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ Failed to create agreement:', error);
      console.error('Error response:', error.response?.data);
      
      // Extract detailed error message
      let errorMessage = 'Failed to create agreement';
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Validation errors
        errorMessage = error.response.data.errors.map((e: any) => e.msg).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showAlert(errorMessage, 'error');
    } finally {
      setIsUploadingFiles(false);
    }
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

    if (!paymentConfirmed) {
      setAcceptError('Please confirm payment terms and milestones');
      return;
    }

    setIsAcceptingAgreement(true);
    setAcceptError(null);

    try {
      // Step 1: Update agreement with payment details
      await updateAgreementMutation.mutateAsync({
        id: routeState.agreementId,
        data: {
          totalValue: parseFloat(value) || 0,
          endDate: deadline,
          milestones: milestones.map(m => ({
            title: m.title,
            description: '',
            status: 'pending' as const,
            previews: [],
            completedAt: null
          }))
        }
      });

      // Step 2: Update status to "priced"
      await updateStatusMutation.mutateAsync({
        id: routeState.agreementId,
        status: 'priced'
      });

      showAlert('Agreement pricing submitted successfully!', 'success');
      
      // Navigate to developer profile
      setTimeout(() => {
        navigate('/developer');
      }, 1500);
    } catch (error: any) {
      console.error('Error accepting agreement:', error);
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Failed to accept agreement';
      setAcceptError(errorMessage);
      showAlert(errorMessage, 'error');
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
        // Mock result available: { transactionHash: mockTxHash, ipfsHash: mockIpfsHash }

      
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
