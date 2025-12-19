import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './contractsViewBase.module.css';
import Button3Black1 from '../../../../components/button/Button3Black1/Button3Black1';
import Button2 from '../../../../components/button/Button2/Button2';
import { useAuthContext } from '../../../../context/AuthContext';
import MilestoneCard from '../../../../components/card/milestoneCard/MilestoneCard';
import { completeAgreement } from '../../../../services/ContractService';
import { transactionsApi } from '../../../../api/transactions.api';
import { showAlert } from '../../../../components/auth/Alert';

type Milestone = { title: string; due?: string; amount?: string; status?: string };

type Props = {
  title: string;
  description: string;
  value: string;
  currency: string;
  deadline: string;
  clientName: string;
  clientEmail?: string;
  clientWallet?: string;
  developerName: string;
  developerEmail?: string;
  developerWallet?: string;
  milestones: Milestone[];
};

const ContractSummary: React.FC<Props> = ({ title, description, value, currency, deadline, clientName, clientEmail, clientWallet, developerName, developerEmail, developerWallet, milestones }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const agreement = location.state?.agreement;
    const { user } = useAuthContext();
    const userRole = user?.role || 'guest';
  const [localMilestones, setLocalMilestones] = useState(milestones && milestones.length ? milestones : []);
  const [isReleasingPayment, setIsReleasingPayment] = useState(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    setLocalMilestones(milestones && milestones.length ? milestones : []);
  }, [milestones]);

  // Initialize completion state from agreement data
  useEffect(() => {
    if (agreement) {
      const completedStatus = agreement.status === 'completed' || (agreement.financials && agreement.financials.releasedAmount >= agreement.financials.totalValue);
      setIsCompleted(Boolean(completedStatus));
    }
  }, [agreement]);

  const total = localMilestones.reduce((s: number, m: any) => s + Number(m.amount || 0), 0);
  // If a value (agreement price) is provided prefer it, otherwise fallback to milestone sum
  const agreedValue = Number(value) || 0;
  const displayTotal = agreedValue > 0 ? agreedValue : total;
  const progress = localMilestones.length ? Math.round((localMilestones.filter((m: any) => m.status === 'done').length / localMilestones.length) * 100) : 0;

  const handleUpdateMilestoneStatus = (index: number | undefined, newStatus: string) => {
    if (typeof index !== 'number') return;
    setLocalMilestones(prev => prev.map((m, i) => i === index ? { ...m, status: newStatus } : m));
  };

  const handleReleasePayment = async () => {
    if (!agreement || !agreement._id) {
      showAlert('Agreement information is missing', 'error');
      console.error('Agreement object:', agreement);
      return;
    }

    // Check if current user is the client
    if (userRole !== 'client') {
      showAlert('Only the client can release payment', 'error');
      console.error('❌ User role is not client:', userRole);
      return;
    }

    // Get client wallet address from agreement
    const clientWalletFromAgreement = agreement.client?.walletAddress || 
                                     agreement.client?.wallet || 
                                     clientWallet;
    
    console.log('🔍 Checking authorization...');
    console.log('👤 Current user role:', userRole);
    console.log('💼 Client wallet from agreement:', clientWalletFromAgreement);
    console.log('🦊 Will connect with MetaMask to verify wallet');

    // Get blockchain agreement ID from the agreement object
    // Prefer blockchain.agreementId (numeric), then fallback to string versions
    const blockchainId = agreement.blockchain?.agreementId || 
                         agreement.blockchainId || 
                         agreement.agreementId;
    
    console.log('🔍 Blockchain data check:', {
      hasBlockchainObject: !!agreement.blockchain,
      blockchainAgreementId: agreement.blockchain?.agreementId,
      fallbackBlockchainId: agreement.blockchainId,
      fallbackAgreementId: agreement.agreementId,
      extractedBlockchainId: blockchainId
    });
    
    if (!blockchainId) {
      showAlert('Blockchain agreement ID is missing. This agreement may not have been created on the blockchain yet. Please ensure you completed the "Approve & Pay" step.', 'error');
      console.error('❌ No blockchain ID found in agreement');
      console.error('Agreement object:', agreement);
      console.error('Available fields:', Object.keys(agreement));
      console.error('Blockchain object:', agreement.blockchain);
      return;
    }

    console.log('🚀 Starting payment release process...');
    console.log('📋 Database Agreement ID:', agreement._id);
    console.log('⛓️ Blockchain Agreement ID:', blockchainId);
    console.log('📄 Agreement Status (DB):', agreement.status);

    setIsReleasingPayment(true);
    try {
      // Get the connected MetaMask wallet address
      let connectedWallet = 'Not yet connected';
      try {
        if ((window as any).ethereum) {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          connectedWallet = accounts[0] || 'No account selected';
          console.log('🦊 Connected MetaMask wallet:', connectedWallet);
          console.log('📋 Expected client wallet (from DB):', clientWalletFromAgreement);
          
          // Compare addresses (case insensitive)
          if (connectedWallet && clientWalletFromAgreement) {
            const match = connectedWallet.toLowerCase() === clientWalletFromAgreement.toLowerCase();
            console.log('✓ Wallet addresses match (DB):', match);
            if (!match) {
              console.warn('⚠️ WARNING: Connected wallet does not match the client wallet in the agreement!');
              console.warn('   Please switch to the correct account in MetaMask');
            }
          }
        }
      } catch (walletError) {
        console.error('Failed to check wallet:', walletError);
      }

      // Query the smart contract to see what client address it has stored
      try {
        const { getAgreementSummary } = await import('../../../../services/ContractService');
        console.log('🔍 Querying smart contract for agreement details...');
        const contractAgreement = await getAgreementSummary(blockchainId);
        console.log('📜 Smart contract agreement data:', contractAgreement);
        console.log('⛓️ Client address in smart contract:', contractAgreement.client);
        console.log('⛓️ Developer address in smart contract:', contractAgreement.developer);
        
        // Check status: 0=Pending, 1=Active, 2=Completed
        const statusNames = ['Pending', 'Active', 'Completed'];
        const statusName = statusNames[contractAgreement.status] || `Unknown (${contractAgreement.status})`;
        console.log('📊 Agreement status in contract:', statusName, `(${contractAgreement.status})`);
        console.log('💰 Escrow balance:', contractAgreement.escrowBalance);
        
        if (contractAgreement.status === 2) {
          console.error('❌ STATUS ERROR: Agreement already completed on blockchain');
          console.error('   Database Agreement ID:', agreement._id);
          console.error('   Blockchain Agreement ID:', blockchainId);
          console.error('   Status on blockchain: Completed (2)');
          console.error('   Escrow balance on blockchain:', contractAgreement.escrowBalance);
          console.error('   ⚠️ DATABASE/BLOCKCHAIN MISMATCH:');
          console.error('   The database may show this as active, but the blockchain shows it as completed.');
          console.error('   Either use a different active agreement, or the database needs to be synced.');
          
          showAlert(`This agreement (blockchain ID: ${blockchainId}) is already completed on the blockchain. Escrow balance: ${contractAgreement.escrowBalance}. Please select an active agreement or create a new one.`, 'error');
          setIsReleasingPayment(false);
          return;
        }
        
        if (contractAgreement.status === 0) {
          showAlert('Agreement is still pending. Please wait for it to become active before releasing payment.', 'error');
          console.error('❌ STATUS ERROR: Agreement is pending');
          console.error('   Status: Pending (0)');
          setIsReleasingPayment(false);
          return;
        }
        
        if (contractAgreement.status !== 1) {
          showAlert(`Agreement status is "${statusName}". To release payment, the agreement must be "Active" (status 1).`, 'error');
          console.error('❌ STATUS ERROR:');
          console.error('   Current status:', statusName, `(${contractAgreement.status})`);
          console.error('   Required status: Active (1)');
          setIsReleasingPayment(false);
          return;
        }
        
        if (connectedWallet && contractAgreement.client) {
          const matchesContract = connectedWallet.toLowerCase() === contractAgreement.client.toLowerCase();
          console.log('✓ Connected wallet matches contract client:', matchesContract);
          
          if (!matchesContract) {
            const shortExpected = `${contractAgreement.client.substring(0, 6)}...${contractAgreement.client.substring(38)}`;
            const shortConnected = `${connectedWallet.substring(0, 6)}...${connectedWallet.substring(38)}`;
            showAlert(`Please switch to the client wallet in MetaMask. Expected: ${shortExpected}, Connected: ${shortConnected}`, 'error');
            console.error('❌ WALLET MISMATCH:');
            console.error('   Smart contract expects:', contractAgreement.client);
            console.error('   Currently connected:', connectedWallet);
            console.error('   Please open MetaMask and switch to the correct account');
            setIsReleasingPayment(false);
            return;
          }
        }
      } catch (contractError) {
        console.error('⚠️ Failed to query smart contract:', contractError);
        // Continue anyway - might work
      }

      // Call completeAgreement smart contract function
      console.log('📤 Calling completeAgreement smart contract function...');
      
      const txResult = await completeAgreement(blockchainId);
      console.log('✅ Transaction submitted successfully:', txResult);
      
      if (!txResult || !txResult.transactionHash) {
        console.error('❌ No transaction hash in result:', txResult);
        throw new Error('Transaction hash not received from smart contract');
      }

      const txHash = txResult.transactionHash;
      console.log('🔗 Transaction Hash:', txHash);

      // Wait for transaction to be mined and confirmed before recording
      console.log('⏳ Waiting for transaction confirmation...');
      // Do not show an immediate alert here; wait until transaction is recorded in DB before notifying the user
      
      // Wait for 30 seconds to allow transaction to be mined and confirmed on Sepolia
      await new Promise(resolve => setTimeout(resolve, 30000));
      console.log('⏱️ Wait period completed (30s elapsed)');

      // Try recording transaction with retry logic
      let recordingSuccess = false;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!recordingSuccess && retryCount < maxRetries) {
        try {
          console.log(`💾 Recording transaction in database... (Attempt ${retryCount + 1}/${maxRetries})`);
          // keep user informed via console and button loading state; avoid popping transient alerts while confirmations are pending
          
          await transactionsApi.create({
            type: 'completion',
            agreement: agreement._id,
            transactionHash: txHash,
            network: 'sepolia',
          });
          
          console.log('✅ Transaction recorded successfully in database');
          // Mark completed in UI before showing success
          setIsCompleted(true);
          showAlert('Payment released successfully! Transaction recorded.', 'success');
          console.log('🎉 Payment release process completed successfully');
          recordingSuccess = true;
          
        } catch (dbError: any) {
          console.error(`⚠️ Error recording transaction (attempt ${retryCount + 1}):`, dbError);
          
          const errorMessage = dbError.response?.data?.error?.message || dbError.response?.data?.message || '';
          const needsMoreTime = errorMessage.includes('confirmation') || 
                                errorMessage.includes('not been mined');
          
            if (needsMoreTime && retryCount < maxRetries - 1) {
            retryCount++;
            const waitTime = 15000; // 15 seconds
            console.log(`🔄 Transaction needs more confirmations. Retrying in ${waitTime/1000} seconds... (${retryCount}/${maxRetries})`);
            // avoid showing repeated alerts while waiting for confirmations
            await new Promise(resolve => setTimeout(resolve, waitTime));
          } else {
            retryCount++;
            if (retryCount >= maxRetries) {
              console.error('❌ Max retries reached');
              showAlert('Payment released on blockchain successfully! Transaction will be recorded automatically.', 'success');
              recordingSuccess = true; // Exit loop
            }
          }
        }
      }
      
      // No automatic page reload — keep UI state intact (button shows Completed)
      console.log('UI updated: transaction recorded, keeping page state (no reload)');
    } catch (error: any) {
      console.error('❌ Error releasing payment:', error);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error details:', {
        message: error.message,
        reason: error.reason,
        code: error.code,
        data: error.data,
      });
      
      // Extract meaningful error message
      let errorMessage = 'Failed to release payment';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.reason) {
        errorMessage = error.reason;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('Agreement must be active')) {
        errorMessage = 'Agreement must be in Active status to release payment. Check if the agreement is already completed or still pending.';
        console.error('🚫 Status error - Agreement is not active');
      } else if (errorMessage.includes('Only client can complete')) {
        errorMessage = 'You must connect with the client\'s wallet address to release payment. Please make sure you\'re using the correct MetaMask account.';
        console.error('🚫 Authorization error - Wrong wallet connected');
      } else if (errorMessage.includes('user rejected') || errorMessage.includes('User denied')) {
        errorMessage = 'Transaction was cancelled by user';
        console.log('ℹ️ User cancelled the transaction');
      } else if (errorMessage.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction';
        console.error('💰 Insufficient funds error');
      } else if (errorMessage.includes('MetaMask')) {
        errorMessage = 'Please make sure MetaMask is installed and unlocked';
        console.error('🦊 MetaMask error');
      }
      
      showAlert(errorMessage, 'error');
    } finally {
      console.log('🏁 Payment release process ended');
      setIsReleasingPayment(false);
    }
  };

  return (
    <div className={styles.summaryWrap1}>
      <div className={styles.leftColumn}>
        <div className={styles.projectCard1}>
          <div className={styles.projectCardInner}>
            <div className={styles.overviewHeader}>Project Overview</div>
            <div className={styles.overviewBox}>
              <div className={styles.overviewRow}>
                <div className={styles.overviewLabel}>Title :</div>
                <div className={styles.overviewValue}>{title}</div>
              </div>
              <div className={styles.overviewRow}>
                <div className={styles.overviewLabel}>Description :</div>
                <div className={styles.overviewValue}>{description}</div>
              </div>
              <div className={styles.overviewMeta}>
                <div><strong>Value :</strong> {value} {currency}</div>
                <div><strong>Deadline :</strong> {deadline}</div>
                <div><strong>Milestone :</strong> {milestones.length} / {milestones.length}</div>
                <div><strong>Progress :</strong> {progress}%</div>
              </div>

              <div className={styles.progressBar} aria-hidden>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.partiesCard}>
          <div className={styles.overviewHeader}>Parties</div>
          <div className={styles.partiesInner}>
            <div className={styles.partiesCol}>
              <div className={styles.partiesHeading}>Client</div>
              <div className={styles.partiesName}>{clientName}</div>
              <div className={styles.partiesSub}>{clientEmail || agreement?.client?.profile?.email || agreement?.client?.email || 'Loading...'}</div>
              <div className={styles.partiesSub}>{clientWallet || agreement?.client?.walletAddress || agreement?.client?.wallet || 'Loading...'}</div>
            </div>
            <div className={styles.partiesCol}>
              <div className={styles.partiesHeading}>Developer</div>
              <div className={styles.partiesName}>{developerName}</div>
              <div className={styles.partiesSub}>{developerEmail || agreement?.developer?.profile?.email || agreement?.developer?.email || 'Loading...'}</div>
              <div className={styles.partiesSub}>{developerWallet || agreement?.developer?.walletAddress || agreement?.developer?.wallet || 'Loading...'}</div>
            </div>
            
          </div>
        </div>

      

        <div className={styles.milestoneFooter}>
          <div className={styles.totalLabel}>Total</div>
          <div className={styles.totalValue}>{displayTotal} {currency}</div>
        </div>

       
 <div className={styles.buttonWrapper}>
          <Button3Black1 
            text="Read Contract" 
            onClick={() => navigate('/create-contract/terms', { state: { agreement } })}
          />
        </div>

        <div className={styles.milestoneCard}>
        <div className={styles.milestoneHeader}>Milestone Breakdown</div>
          <div className={styles.milestoneList}>
            {localMilestones.map((m: any, i: number) => (
              <MilestoneCard
                key={i}
                index={i}
                milestone={m}
                editable={true}
                onUpdateStatus={handleUpdateMilestoneStatus}
              />
            ))}
          </div>
        </div>
      
        
        <div className={styles.actionsRow}>
          <div className={styles.prevBtn}>
            <Button2 text="← Previous" onClick={() => { window.history.back(); }} />
          </div>
          <div className={styles.actionsRight}>
            <Button2
              text={
                userRole === 'client'
                  ? isCompleted
                    ? 'Completed'
                    : isReleasingPayment
                    ? 'Processing...'
                    : 'Release Payment'
                  : userRole === 'developer'
                  ? 'Deliver Project'
                  : 'View payment'
              }
              onClick={
                userRole === 'client'
                  ? isCompleted
                    ? undefined
                    : handleReleasePayment
                  : () => {
                      /* TODO: Implement deliver project logic */
                    }
              }
              disabled={userRole === 'client' ? isCompleted : false}
            />
            <Button3Black1 
              text={userRole === 'developer' ? 'Incoming Requests' : 'Request Change'} 
              onClick={() => navigate('/create-contract/request-change', { state: { agreement, isDeveloperView: userRole === 'developer', isClientView: userRole === 'client' ? true : false } })} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSummary;
