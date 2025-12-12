import React, { useEffect, useState } from 'react';
import styles from '../pageCotractD.module.css';

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

const CreatePartiesStep: React.FC<Props> = ({ clientName, setClientName, clientEmail, setClientEmail, clientWallet, setClientWallet, developerName, developerEmail, developerWallet, gigId, developerReceivingAddress }) => {
  const [fetchedDeveloperName, setFetchedDeveloperName] = useState('');
  const [fetchedDeveloperEmail, setFetchedDeveloperEmail] = useState('');
  const [fetchedDeveloperWallet, setFetchedDeveloperWallet] = useState('');
  const [, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchDeveloper = async () => {
      if ((!developerWallet || developerWallet.length < 10) && !gigId) return;
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

        let walletToUse = '';
        let developerFromGig = null;
        
        if (gigId) {
          try {
            const gigRes = await fetch(`${API_URL}/gigs/${gigId}`, { credentials: 'include' });
            if (gigRes.ok) {
              const gigJson = await gigRes.json();
              const gigData = gigJson.data || gigJson;
              if (gigData.developer) {
                developerFromGig = gigData.developer;
                walletToUse = developerFromGig.walletAddress || developerFromGig.wallet || '';
                
                // Mock - log gig data instead of storing in context
                console.log('Mock: Gig data from API', {
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
                if (mounted && developerFromGig) {
                  const name = developerFromGig.profile?.name || developerFromGig.username || 'Unknown Developer';
                  const email = developerFromGig.email || '';
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
                  setLoading(false);
                  return;
                }
              }
            }
          } catch (err) {
            console.warn('CreatePartiesStep: failed to fetch gig to get developer wallet', err);
          }
        }
        if (!walletToUse || walletToUse.length < 10) {
          walletToUse = developerWallet;
          if (mounted && walletToUse) setFetchedDeveloperWallet(walletToUse);
        }

        if (!walletToUse || walletToUse.length < 10) return;

        const res = await fetch(`${API_URL}/users?walletAddress=${walletToUse}`, { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          const dev = Array.isArray(json.data) ? json.data[0] : json.data || json;
          if (dev && mounted) {
            const name = dev.profile?.name || dev.username || developerName || 'Unknown Developer';
            const email = dev.email || developerEmail || '';
            setFetchedDeveloperName(name);
            setFetchedDeveloperEmail(email);
          }
        }
      } catch (err) {
        console.error('CreatePartiesStep: failed to fetch developer details', err);
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

        <div style={{marginTop:12}} className={styles.formRow}>
          <label>Developer Details</label>
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

export default CreatePartiesStep;
