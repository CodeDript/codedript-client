import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './contractsViewBase.module.css';
import Button3Black1 from '../../../../components/button/Button3Black1/Button3Black1';
import Button2 from '../../../../components/button/Button2/Button2';
import MilestoneCard from '../../../../components/card/milestoneCard/MilestoneCard';
import { mockMilestones } from '../../../../constants/milestonesMock';
import { completeAgreement } from '../../../../services/ContractService';
import { MilestoneService, type Milestone as APIMilestone } from '../../../../api/milestoneService';

type Milestone = { title: string; due?: string; amount?: string; status?: string };

type Props = {
  title: string;
  description: string;
  value: string;
  currency: string;
  deadline: string;
  clientName: string;
  developerName: string;
  milestones: Milestone[];
};

const ContractSummary: React.FC<Props> = ({ title, description, value, currency, deadline, clientName, developerName, milestones }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const agreement = location.state?.agreement;
  const [localMilestones, setLocalMilestones] = useState<any[]>(milestones && milestones.length ? milestones : mockMilestones);
  const [apiMilestones, setApiMilestones] = useState<APIMilestone[]>([]);
  const [isReleasingPayment, setIsReleasingPayment] = useState(false);
  const [releaseError, setReleaseError] = useState<string | null>(null);
  const [isLoadingMilestones, setIsLoadingMilestones] = useState(false);

  useEffect(() => {
    const initMilestones = milestones && milestones.length ? milestones : mockMilestones;
    // Set first milestone to in_progress, rest to pending
    const initializedMilestones = initMilestones.map((m, i) => ({
      ...m,
      status: i === 0 ? 'inprogress' : 'pending'
    }));
    setLocalMilestones(initializedMilestones);
  }, [milestones]);

  // Fetch actual milestones from API if agreement exists
  useEffect(() => {
    const fetchMilestones = async () => {
      if (agreement?._id) {
        setIsLoadingMilestones(true);
        try {
          console.log('📊 Fetching milestones for agreement:', agreement._id);
          const fetchedMilestones = await MilestoneService.getMilestonesByAgreement(agreement._id);
          console.log('✅ Milestones loaded:', fetchedMilestones);
          
          // Set first milestone to in_progress if all are pending
          const allPending = fetchedMilestones.every(m => m.status === 'pending');
          if (allPending && fetchedMilestones.length > 0) {
            try {
              await MilestoneService.startMilestone(fetchedMilestones[0]._id);
              const updatedMilestones = await MilestoneService.getMilestonesByAgreement(agreement._id);
              setApiMilestones(updatedMilestones);
            } catch (err) {
              console.error('Failed to start first milestone:', err);
              setApiMilestones(fetchedMilestones);
            }
          } else {
            setApiMilestones(fetchedMilestones);
          }
        } catch (error) {
          console.error('Error fetching milestones:', error);
        } finally {
          setIsLoadingMilestones(false);
        }
      }
    };

    fetchMilestones();
  }, [agreement?._id]);

  const handleMilestoneUpdated = async () => {
    // Refresh milestones after upload
    if (agreement?._id) {
      try {
        const fetchedMilestones = await MilestoneService.getMilestonesByAgreement(agreement._id);
        setApiMilestones(fetchedMilestones);
      } catch (error) {
        console.error('Error refreshing milestones:', error);
      }
    }
  };

  const total = localMilestones.reduce((s, m) => s + Number(m.amount || 0), 0);
  const progress = localMilestones.length ? Math.round((localMilestones.filter(m => m.status === 'done').length / localMilestones.length) * 100) : 0;

  const handleUpdateMilestoneStatus = (index: number | undefined, newStatus: string) => {
    if (typeof index !== 'number') return;
    setLocalMilestones(prev => prev.map((m, i) => i === index ? { ...m, status: newStatus } : m));
  };

  // Check if a milestone can be completed (all previous milestones must be completed)
  const canCompleteMilestone = (index: number, milestones: any[]) => {
    if (index === 0) return true; // First milestone can always be completed
    
    // Check if all previous milestones are completed
    for (let i = 0; i < index; i++) {
      const status = milestones[i].status;
      if (status !== 'completed' && status !== 'approved' && status !== 'done') {
        return false;
      }
    }
    return true;
  };

  const handleReleasePayment = async () => {
    if (!agreement?.blockchain?.agreementId) {
      alert('This agreement does not have a blockchain ID. Payment can only be released for blockchain agreements.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to release ${value} ${currency} to the developer?\n\nThis will send all escrow funds to the developer and mark the agreement as completed. This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsReleasingPayment(true);
    setReleaseError(null);

    try {
      console.log('🔓 Releasing payment for agreement:', agreement.blockchain.agreementId);
      
      const txResult = await completeAgreement(agreement.blockchain.agreementId);
      console.log('✅ Payment released successfully:', txResult);

      alert(`Payment released successfully!\n\nTransaction Hash: ${txResult.transactionHash}\n\nThe developer has received ${value} ${currency}.`);
      
      // Optionally update agreement status in backend
      try {
        const { AgreementService } = await import('../../../../api/agreementService');
        await AgreementService.completeAgreement(agreement._id);
        console.log('✅ Agreement marked as completed in database');
      } catch (backendError) {
        console.error('Failed to update agreement status in backend:', backendError);
      }

      // Navigate back to client dashboard
      navigate('/client');
    } catch (error: any) {
      console.error('❌ Error releasing payment:', error);
      
      let errorMessage = 'Failed to release payment';
      if (error.message) {
        if (error.message.includes('user rejected') || error.message.includes('User denied')) {
          errorMessage = 'Transaction was rejected in MetaMask';
        } else if (error.message.includes('Only client can complete')) {
          errorMessage = 'Only the client who created this agreement can release payment';
        } else if (error.message.includes('Agreement must be active')) {
          errorMessage = 'This agreement is not active or has already been completed';
        } else {
          errorMessage = error.message;
        }
      }
      
      setReleaseError(errorMessage);
      alert(`Error: ${errorMessage}`);
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
              <div className={styles.partiesSub}>example@email.com</div>
            </div>
            <div className={styles.partiesCol}>
              <div className={styles.partiesHeading}>Developer</div>
              <div className={styles.partiesName}>{developerName}</div>
              <div className={styles.partiesSub}>developer@email.com</div>
            </div>
            
          </div>
        </div>

      

        <div className={styles.milestoneFooter}>
          <div className={styles.totalLabel}>Total</div>
          <div className={styles.totalValue}>{value} {currency}</div>
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
            {isLoadingMilestones ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                Loading milestones...
              </div>
            ) : apiMilestones.length > 0 ? (
              apiMilestones.map((m, i) => (
                <MilestoneCard
                  key={m._id}
                  index={i}
                  milestone={{
                    _id: m._id,
                    title: m.title,
                    due: m.timeline.dueDate ? new Date(m.timeline.dueDate).toLocaleDateString() : undefined,
                    amount: m.financials.value.toString(),
                    status: m.status,
                    submission: m.submission
                  }}
                  editable={true}
                  canComplete={canCompleteMilestone(i, apiMilestones)}
                  onUpdateStatus={handleUpdateMilestoneStatus}
                  onMilestoneUpdated={handleMilestoneUpdated}
                />
              ))
            ) : (
              localMilestones.map((m, i) => (
                <MilestoneCard
                  key={i}
                  index={i}
                  milestone={m}
                  editable={true}
                  canComplete={canCompleteMilestone(i, localMilestones)}
                  onUpdateStatus={handleUpdateMilestoneStatus}
                />
              ))
            )}
          </div>
        </div>
      
        
        <div className={styles.actionsRow}>
          <div className={styles.prevBtn}>
            <Button2 text="← Previous" onClick={() => { window.history.back(); }} />
          </div>
          <div className={styles.actionsRight}>
            <Button2 
              text={isReleasingPayment ? 'Releasing...' : 'Release Payment'} 
              onClick={handleReleasePayment}
              disabled={isReleasingPayment || !agreement?.blockchain?.agreementId}
            />
            <Button3Black1 
              text="Request Change" 
              onClick={() => navigate('/create-contract/request-change', { state: { agreement } })} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSummary;
