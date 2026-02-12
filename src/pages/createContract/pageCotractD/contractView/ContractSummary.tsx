import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
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
      return;
    }

    // Check if current user is the client
    if (userRole !== 'client') {
      showAlert('Only the client can release payment', 'error');
      return;
    }

    // Get client wallet address from agreement
    const clientWalletFromAgreement = agreement.client?.walletAddress ||
      agreement.client?.wallet ||
      clientWallet;

    // Get blockchain agreement ID from the agreement object
    // Prefer blockchain.agreementId (numeric), then fallback to string versions
    // Use nullish coalescing (??) to properly handle agreement ID 0
    const blockchainId = agreement.blockchain?.agreementId ??
      agreement.blockchainId ??
      agreement.agreementId ??
      null;

    if (blockchainId === null || blockchainId === undefined) {
      showAlert('Blockchain agreement ID is missing. This agreement may not have been created on the blockchain yet. Please ensure you completed the "Approve & Pay" step.', 'error');
      return;
    }

    setIsReleasingPayment(true);
    try {
      // Get the connected MetaMask wallet address
      let connectedWallet = 'Not yet connected';
      try {
        if ((window as any).ethereum) {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          connectedWallet = accounts[0] || 'No account selected';

          // Compare addresses (case insensitive)
          if (connectedWallet && clientWalletFromAgreement) {
            const match = connectedWallet.toLowerCase() === clientWalletFromAgreement.toLowerCase();
          }
        }
      } catch (walletError) {
        // Wallet check failed
      }

      // Query the smart contract to see what client address it has stored
      try {
        const { getAgreementSummary } = await import('../../../../services/ContractService');
        const contractAgreement = await getAgreementSummary(blockchainId);

        // Check status: 0=Pending, 1=Active, 2=Completed
        const statusNames = ['Pending', 'Active', 'Completed'];
        const statusName = statusNames[contractAgreement.status] || `Unknown (${contractAgreement.status})`;

        if (contractAgreement.status === 2) {
          showAlert(`This agreement (blockchain ID: ${blockchainId}) is already completed on the blockchain. Escrow balance: ${contractAgreement.escrowBalance}. Please select an active agreement or create a new one.`, 'error');
          setIsReleasingPayment(false);
          return;
        }

        if (contractAgreement.status === 0) {
          showAlert('Agreement is still pending. Please wait for it to become active before releasing payment.', 'error');
          setIsReleasingPayment(false);
          return;
        }

        if (contractAgreement.status !== 1) {
          showAlert(`Agreement status is "${statusName}". To release payment, the agreement must be "Active" (status 1).`, 'error');
          setIsReleasingPayment(false);
          return;
        }

        if (connectedWallet && contractAgreement.client) {
          const matchesContract = connectedWallet.toLowerCase() === contractAgreement.client.toLowerCase();

          if (!matchesContract) {
            const shortExpected = `${contractAgreement.client.substring(0, 6)}...${contractAgreement.client.substring(38)}`;
            const shortConnected = `${connectedWallet.substring(0, 6)}...${connectedWallet.substring(38)}`;
            showAlert(`Please switch to the client wallet in MetaMask. Expected: ${shortExpected}, Connected: ${shortConnected}`, 'error');
            setIsReleasingPayment(false);
            return;
          }
        }
      } catch (contractError) {
        // Continue anyway - might work
      }

      // Call completeAgreement smart contract function
      const txResult = await completeAgreement(blockchainId);

      if (!txResult || !txResult.transactionHash) {
        throw new Error('Transaction hash not received from smart contract');
      }

      const txHash = txResult.transactionHash;

      // Try recording transaction with retry logic
      let recordingSuccess = false;
      let retryCount = 0;
      const maxRetries = 15;

      while (!recordingSuccess && retryCount < maxRetries) {
        try {
          // keep user informed via console and button loading state; avoid popping transient alerts while confirmations are pending

          await transactionsApi.create({
            type: 'completion',
            agreement: agreement._id,
            transactionHash: txHash,
            network: 'sepolia',
          });

          // Mark completed in UI before showing success
          setIsCompleted(true);

          // Invalidate React Query caches to refresh data everywhere
          queryClient.invalidateQueries({ queryKey: ['agreements'] });
          queryClient.invalidateQueries({ queryKey: ['transactions'] });

          showAlert('Payment released successfully! Transaction recorded.', 'success');
          recordingSuccess = true;

        } catch (dbError: any) {
          const errorMessage = dbError.response?.data?.error?.message || dbError.response?.data?.message || '';
          const needsMoreTime = errorMessage.includes('confirmation') ||
            errorMessage.includes('not been mined');

          if (needsMoreTime && retryCount < maxRetries - 1) {
            retryCount++;
            const waitTime = 1000; // 1 second
            // avoid showing repeated alerts while waiting for confirmations
            await new Promise(resolve => setTimeout(resolve, waitTime));
          } else {
            retryCount++;
            if (retryCount >= maxRetries) {
              showAlert('Payment released on blockchain successfully! Transaction will be recorded automatically.', 'success');
              recordingSuccess = true; // Exit loop
            }
          }
        }
      }

      // No automatic page reload — keep UI state intact (button shows Completed)
    } catch (error: any) {
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
      } else if (errorMessage.includes('Only client can complete')) {
        errorMessage = 'You must connect with the client\'s wallet address to release payment. Please make sure you\'re using the correct MetaMask account.';
      } else if (errorMessage.includes('user rejected') || errorMessage.includes('User denied')) {
        errorMessage = 'Transaction was cancelled by user';
      } else if (errorMessage.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction';
      } else if (errorMessage.includes('MetaMask')) {
        errorMessage = 'Please make sure MetaMask is installed and unlocked';
      }

      showAlert(errorMessage, 'error');
    } finally {
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
            onClick={() => navigate('/create-contract/terms', {
              state: {
                agreement: {
                  ...agreement,
                  title,
                  description,
                  value,
                  currency,
                  deadline,
                  clientName,
                  clientEmail,
                  clientWallet,
                  developerName,
                  developerEmail,
                  developerWallet
                }
              }
            })}
          />
        </div>

        <div className={styles.milestoneCard}>
          <div className={styles.milestoneHeader}>Milestone Breakdown</div>
          <div className={styles.milestoneList}>
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#666',
              fontFamily: 'Jura, sans-serif'
            }}>
              Maintenance ...
            </div>
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
