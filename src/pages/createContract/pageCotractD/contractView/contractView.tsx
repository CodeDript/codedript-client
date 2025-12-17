import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../../context/AuthContext';
import styles from './contractsViewBase.module.css';
import authStyles from '../../../../components/auth/AuthForm.module.css';
import heroOutlineup from '../../../../assets/Login/cardBackgroundup.svg';
import heroOutlinedown from '../../../../assets/Login/cardBackgrounddown.svg';

// icons removed for contractView (project details and step icons)
import ContractSummary from './ContractSummary';

const PageCotractD: React.FC = () => {
  const { user } = useAuthContext();
  const userRole: string = user?.role ?? 'guest';
  
  useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [, setDeveloperId] = useState('');

  // Parties
  const [clientName, setClientName] = useState('');
  useState('');
  useState('');
  const [developerName, setDeveloperName] = useState('');

  // Payment
  const [value, setValue] = useState('0');
  const [currency, setCurrency] = useState('ETH');
  const [deadline, setDeadline] = useState('');
  const [milestones, setMilestones] = useState<any[]>([]);
  
  // Agreement metadata
  const [createdDate, setCreatedDate] = useState('');
  const [agreementStatus, setAgreementStatus] = useState('Active');

  // Files & terms
  useState('Any additional terms, conditions, or special requirement ...');
  // uploaded files
  useState<File[]>([]);

  const { state: routeState } = useLocation();

  useEffect(() => {
    if (routeState) {
      // populate from passed package data when available
      if (routeState.title) setTitle(routeState.title);
      if (routeState.description) setDescription(Array.isArray(routeState.description) ? routeState.description.join('\n') : routeState.description);
      if (routeState.developerId) setDeveloperId(routeState.developerId);
      // if an agreement object is passed in route state, populate common fields
      if (routeState.agreement) {
        const ag = routeState.agreement as any;
        if (ag.title) setTitle(ag.title);
        if (ag.project?.name) setTitle(ag.project.name);
        if (ag.description) setDescription(ag.description);
        if (ag.project?.description) setDescription(ag.project.description);
        if (ag.developer?.walletAddress) setDeveloperId(ag.developer.walletAddress);
        if (ag.milestones && Array.isArray(ag.milestones)) setMilestones(ag.milestones.map((m: any) => ({ title: m.title || '', amount: m.amount || '0', due: m.due || undefined, status: m.status })));
        if (ag.deadline) setDeadline(ag.deadline);
        if (ag.endDate) setDeadline(ag.endDate);
        if (ag.financials) {
          setValue(ag.financials.totalValue || '0');
          setCurrency(ag.financials.currency || 'ETH');
        }
        // Map client name from various possible fields
        if (ag.client?.profile?.name) {
          setClientName(ag.client.profile.name);
        } else if (ag.client?.fullname) {
          setClientName(ag.client.fullname);
        } else if (ag.client?.email) {
          setClientName(ag.client.email);
        }
        // Map developer name
        if (ag.developer?.profile?.name) {
          setDeveloperName(ag.developer.profile.name);
        } else if (ag.developer?.fullname) {
          setDeveloperName(ag.developer.fullname);
        } else if (ag.developer?.email) {
          setDeveloperName(ag.developer.email);
        }
        // Map created date
        if (ag.createdAt) {
          const date = new Date(ag.createdAt);
          const formatted = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
          setCreatedDate(`Created ${formatted}`);
        }
        // Map status
        if (ag.status) {
          setAgreementStatus(ag.status.charAt(0).toUpperCase() + ag.status.slice(1));
        }
      }
    }
  }, [routeState]);

  useNavigate();

  // handlers used by UI of the action buttons

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
              <h2 className={styles.contractTitle}>{title || 'Loading...'}</h2>
              <div className={styles.contractSub}>with {userRole === 'client' ? (developerName || 'Loading...') : (clientName || 'Loading...')}</div>
            </div>
            <div className={styles.contractMeta}>
              <div className={styles.statusBadge}>{agreementStatus}</div>
              <div className={styles.createdDate}>{createdDate || 'Loading...'}</div>
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
                clientEmail={routeState.agreement.client?.email || routeState.agreement.client?.profile?.email}
                clientWallet={routeState.agreement.client?.walletAddress || routeState.agreement.client?.wallet}
                developerName={routeState.agreement.developer?.profile?.name || developerName}
                developerEmail={routeState.agreement.developer?.email || routeState.agreement.developer?.profile?.email}
                developerWallet={routeState.agreement.developer?.walletAddress || routeState.agreement.developer?.wallet}
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
