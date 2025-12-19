import React, { useEffect, useState } from 'react';
import styles from '../pageCotractD.module.css';
import { useGig } from '../../../../query/useGigs';
import { authApi } from '../../../../api/auth.api';

type Props = {
  clientName: string;
  setClientName: (v: string) => void;
  clientEmail: string;
  setClientEmail: (v: string) => void;
  clientWallet: string;
  setClientWallet: (v: string) => void;
  developerName: string;
  developerEmail: string;
  developerWallet: string;
  gigId?: string;
  developerReceivingAddress?: string;
};

const PartiesStep: React.FC<Props> = ({ clientName, setClientName, clientEmail, setClientEmail, clientWallet, setClientWallet, developerName, developerEmail, developerWallet, gigId, developerReceivingAddress }) => {
  const [fetchedDeveloperName, setFetchedDeveloperName] = useState('');
  const [fetchedDeveloperEmail, setFetchedDeveloperEmail] = useState('');
  const [fetchedDeveloperWallet, setFetchedDeveloperWallet] = useState('');
  const [clientLoading, setClientLoading] = useState(false);

  // Use the gig query hook to fetch developer details
  const gigQuery = useGig(gigId || '');

  // Fetch authenticated client details from API
  useEffect(() => {
    let mounted = true;

    const fetchClientDetails = async () => {
      setClientLoading(true);
      try {
        const response = await authApi.getMe();
        const userData = response.user;
        
        if (userData && mounted) {
          // Update client details from API response
          const apiEmail = userData.email || '';
          const apiWallet = userData.walletAddress || '';
          const apiName = userData.fullname || userData.email?.split('@')[0] || '';
          
          // Update with API data - email can be empty and editable, wallet is readonly
          setClientEmail(apiEmail);
          setClientWallet(apiWallet);
          if (!clientName || clientName === 'Devid kamron') setClientName(apiName);
        }
      } catch (error) {
        // Error fetching client details
      } finally {
        if (mounted) setClientLoading(false);
      }
    };

    fetchClientDetails();
    return () => { mounted = false; };
  }, []);

  // Update developer details when gig data is loaded
  useEffect(() => {
    if (!gigQuery.data) return;

    (async () => {
      const gig: any = gigQuery.data;
      const developer = gig.developer;

      try {
        // If developer is a populated object
        if (developer && typeof developer === 'object') {
          const devName = developer.fullname || developer.username || developer.email?.split('@')[0] || 'Unknown Developer';
          const devEmail = developer.email || '';
          const devWallet = developer.walletAddress || '';

          setFetchedDeveloperName(devName);
          setFetchedDeveloperEmail(devEmail);
          setFetchedDeveloperWallet(devWallet);
          return;
        }

        // If developer is a string (likely an ID), try to fetch the user by id
        if (developer && typeof developer === 'string') {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
          try {
            const res = await fetch(`${API_URL}/users/${developer}`, { credentials: 'include' });
            if (res.ok) {
              const json = await res.json();
              const dev = json.data || json;
              const devName = dev.fullname || dev.username || dev.email?.split('@')[0] || 'Unknown Developer';
              const devEmail = dev.email || '';
              const devWallet = dev.walletAddress || '';

              setFetchedDeveloperName(devName);
              setFetchedDeveloperEmail(devEmail);
              setFetchedDeveloperWallet(devWallet);
              return;
            }
          } catch (err) {
            // Failed to fetch developer by id
          }
        }

        // Fallback: if none of the above, try to use developerWallet prop
        if (developerWallet) {
          setFetchedDeveloperWallet(developerWallet);
        }
      } catch (err) {
        // Error handling developer info
      }
    })();
  }, [gigQuery.data]);

  return (
    <>
      <h4 className={styles.sectionTitle}>Parties</h4>
      <h4 className={styles.step}>Step 2 of 5</h4>

      <div className={styles.cardArea2}>
        <div className={styles.formRow}>
          <label>Client Name :</label>
          <input 
            value={clientName} 
            onChange={(e) => setClientName(e.target.value)} 
            disabled={clientLoading}
          />
        </div>

        <div className={styles.formRow}>
          <label>Client Email :</label>
          <input 
            value={clientEmail} 
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="Enter email address"
            disabled={clientLoading}
          />
        </div>

        <div className={styles.formRow}>
          <label>Client Wallet Address :</label>
          <input 
            value={clientWallet} 
            readOnly 
            disabled 
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            title="Wallet address from your account"
          />
        </div>

        {/* Developer read-only preview (prefill) */}
        <div style={{marginTop:12}} className={styles.formRow}>
          <label>Developer Details{gigQuery.isLoading && <span style={{fontSize: '0.8rem', color: '#666'}}> (Loading...)</span>}</label>
          <div style={{background:'#efefef', padding:'10px', borderRadius:6}}>
            <div style={{fontWeight:700}}>
              {fetchedDeveloperName || developerName || 'Unknown Developer'}
            </div>
            <div style={{fontSize:'0.9rem', color:'#666', marginTop:6}}>
              {fetchedDeveloperEmail || developerEmail || 'No email'}
            </div>
            <div style={{fontSize:'0.85rem', color:'#888', marginTop:8}}>
              {fetchedDeveloperWallet || developerWallet || 'Wallet not available'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartiesStep;
