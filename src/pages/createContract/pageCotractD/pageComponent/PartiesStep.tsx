import React, { useEffect, useState } from 'react';
import styles from '../pageCotractD.module.css';
import { useAgreement } from '../../../../context/AgreementContext';
import type { GigData, DeveloperProfile } from '../../../../context/AgreementContext';

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
  const [loading, setLoading] = useState(false);

  const { setGigData, setDeveloperProfile } = useAgreement();

  console.log('PartiesStep props:', { gigId, developerWallet, developerName, developerEmail });

  useEffect(() => {
    let mounted = true;

    const fetchDeveloper = async () => {
      // Only proceed if we have either a direct developer wallet prop or a gigId to look it up from
      if ((!developerWallet || developerWallet.length < 10) && !gigId) return;
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

        // Determine wallet to use: ALWAYS fetch from gig if gigId is present (this is the source of truth)
        let walletToUse = '';
        let developerFromGig = null;
        
        if (gigId) {
          console.log('Fetching gig with ID:', gigId);
          try {
            const gigRes = await fetch(`${API_URL}/gigs/${gigId}`, { credentials: 'include' });
            if (gigRes.ok) {
              const gigJson = await gigRes.json();
              console.log('Gig response:', gigJson);
              const gigData = gigJson.data || gigJson;
              
              // The gig response has a populated developer object with full profile
              if (gigData.developer) {
                developerFromGig = gigData.developer;
                walletToUse = developerFromGig.walletAddress || developerFromGig.wallet || '';
                console.log('Extracted developer from gig:', developerFromGig);
                console.log('Extracted wallet from gig :', walletToUse);
                
                // Store gig data in context for global access
                const gigDataForContext: GigData = {
                  id: gigData._id || gigData.id || gigId,
                  title: gigData.title || '',
                  description: gigData.description || '',
                  category: gigData.category,
                  deliveryTime: gigData.deliveryTime,
                  developer: {
                    id: developerFromGig._id || developerFromGig.id,
                    name: developerFromGig.profile?.name || developerFromGig.username || '',
                    email: developerFromGig.email || '',
                    walletAddress: walletToUse,
                    avatar: developerFromGig.profile?.avatar,
                    bio: developerFromGig.profile?.bio,
                    skills: developerFromGig.profile?.skills,
                    hourlyRate: developerFromGig.profile?.hourlyRate,
                    rating: developerFromGig.reputation?.rating,
                    reviewCount: developerFromGig.reputation?.reviewCount,
                  },
                  packages: gigData.packages,
                };
                setGigData(gigDataForContext);
                
                // If we have the full developer object from gig, use it directly
                if (mounted && developerFromGig) {
                  const name = developerFromGig.profile?.name || developerFromGig.username || 'Unknown Developer';
                  const email = developerFromGig.email || '';
                  
                  // Store developer profile in context
                  const devProfileForContext: DeveloperProfile = {
                    id: developerFromGig._id || developerFromGig.id,
                    name,
                    email,
                    walletAddress: walletToUse,
                    avatar: developerFromGig.profile?.avatar,
                    bio: developerFromGig.profile?.bio,
                    skills: developerFromGig.profile?.skills,
                    hourlyRate: developerFromGig.profile?.hourlyRate,
                    rating: developerFromGig.reputation?.rating,
                    reviewCount: developerFromGig.reputation?.reviewCount,
                  };
                  setDeveloperProfile(devProfileForContext);
                  
                  setFetchedDeveloperName(name);
                  setFetchedDeveloperEmail(email);
                  if (walletToUse) setFetchedDeveloperWallet(walletToUse);
                  console.log('Set developer from gig:', { name, email, wallet: walletToUse });
                  setLoading(false);
                  return; // Early return - we have everything we need
                }
              }
            }
          } catch (err) {
            console.warn('PartiesStep: failed to fetch gig to get developer wallet', err);
          }
        }
        
        // Fallback to prop if gig fetch didn't provide a wallet
        if (!walletToUse || walletToUse.length < 10) {
          walletToUse = developerWallet;
          if (mounted && walletToUse) setFetchedDeveloperWallet(walletToUse);
        }

        if (!walletToUse || walletToUse.length < 10) return;

        // Fetch developer profile by wallet
        console.log('Fetching developer profile for wallet:', walletToUse);
        const res = await fetch(`${API_URL}/users?walletAddress=${walletToUse}`, { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          console.log('Developer profile response:', json);
          const dev = Array.isArray(json.data) ? json.data[0] : json.data || json;
          if (dev && mounted) {
            const name = dev.profile?.name || dev.username || developerName || 'Unknown Developer';
            const email = dev.email || developerEmail || '';
            console.log('Setting developer:', { name, email, wallet: walletToUse });
            setFetchedDeveloperName(name);
            setFetchedDeveloperEmail(email);
          }
        }
      } catch (err) {
        console.error('PartiesStep: failed to fetch developer details', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDeveloper();
    return () => { mounted = false; };
  }, [developerWallet, gigId]);

  return (
    <>
      <h4 className={styles.sectionTitle}>Parties</h4>
      <h4 className={styles.step}>Step 2 of 5</h4>

      <div className={styles.cardArea2}>
        <div className={styles.formRow}>
          <label>Client Name :</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </div>

        <div className={styles.formRow}>
          <label>Client Email :</label>
          <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
        </div>

        <div className={styles.formRow}>
          <label>Client Wallet Address (optional):</label>
          <input value={clientWallet} onChange={(e) => setClientWallet(e.target.value)} />
        </div>

        {/* Developer read-only preview (prefill) */}
        <div style={{marginTop:12}} className={styles.formRow}>
          <label>Developer Details{loading && <span style={{fontSize: '0.8rem', color: '#666'}}>(Loading...)</span>}</label>
          <div style={{background:'#efefef', padding:'10px', borderRadius:6}}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <div style={{fontWeight:700}}>{fetchedDeveloperName || 'Unknown Developer'}</div>
              <div style={{fontSize:'0.85rem', color:'#666'}}>{fetchedDeveloperWallet || developerWallet}</div>
            </div>
            <div style={{fontSize:'0.9rem', color:'#666', marginTop:6}}>{fetchedDeveloperEmail || 'No email'}</div>
            <div style={{fontSize:'0.85rem', color:'#888', marginTop:8}}>
              <div><strong>Receiving address:</strong> {developerReceivingAddress || 'Not provided'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartiesStep;
