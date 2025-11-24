import React from 'react';
import styles from '../pageCotractD.module.css';
import { useAgreement } from '../../../../context/AgreementContext';

type Milestone = { title: string; amount: string };

type PackageSummary = {
  name: string;
  price?: number | string;
  currency?: string;
  deliveryTime?: number | string;
  revisions?: number | string;
  features?: string[];
};

type Props = {
  title: string;
  description: string;
  developerWallet?: string;
  developerReceivingAddress?: string;
  clientName: string;
  clientEmail: string;
  value: string;
  currency: string;
  deadline: string;
  milestones: Milestone[];
  filesNote: string;
  files?: File[];
  isClientView?: boolean;
};

const CreateReviewStep: React.FC<Props> = ({ title, description, developerWallet, developerReceivingAddress, value, currency, filesNote, files, isClientView }) => {
  const [approved, setApproved] = React.useState(false);
  const { formData } = useAgreement();

  // Try to source package data from context gigData if available
  const packages: PackageSummary[] | undefined = formData?.gigData?.packages?.map((p: any) => ({
    name: p.name,
    price: p.price,
    currency: p.currency,
    deliveryTime: p.deliveryTime,
    revisions: p.revisions,
    features: p.features
  }));

  React.useEffect(() => {
    if (isClientView && (window as any).__setClientApproved) {
      (window as any).__setClientApproved(approved);
    }
  }, [approved, isClientView]);

  return (
    <>
      <h4 className={styles.sectionTitle}>Publish</h4>
      <h4 className={styles.step}>Step 4 of 4</h4>

      <div className={styles.cardArea2} role="region" aria-label="Publish summary" aria-live="polite">
        <div className={styles.juraTitle} style={{paddingTop: '20px', fontFamily: 'Jura', fontWeight: 500}}>Gig Details</div>
        <div className={styles.reviewBox}>
          <div className={styles.reviewRow}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Title :</div>
            <div className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{title}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Description :</div>
            <div className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{description}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Value :</div>
            <div className={styles.reviewValue}>
              <span className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{value}</span>
              <span style={{marginLeft:6, fontFamily: 'Jura'}}>{currency}</span>
            </div>
          </div>
          {/* Category and Create Date replace Deadline */}
          <div className={styles.reviewRow}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Category :</div>
            <div className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{formData?.gigData?.category || 'Uncategorized'}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Created :</div>
            <div className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{formData?.gigData?.id ? (formData.gigData as any).createdAt ? new Date((formData.gigData as any).createdAt).toLocaleString() : new Date().toLocaleString() : new Date().toLocaleString()}</div>
          </div>

          {/* Developer Receiving Address row (moved from Parties) */}
          <div className={styles.reviewRow}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Developer Receiving Ethereum Address :</div>
            <div className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{formData?.developerReceivingAddress || developerReceivingAddress || developerWallet || 'No receiving address'}</div>
          </div>
        </div>
        {/* Packages summary - show if gigData packages exist, otherwise show N/A table */}
        <div className={styles.juraTitle} style={{paddingTop: '20px', fontFamily: 'Jura', fontWeight: 500}}>Packages</div>
        <div className={styles.reviewBox}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', minWidth:640}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left', padding:'8px 12px', fontFamily:'Zen Dots', fontWeight:100}}>Package</th>
                  <th style={{textAlign:'left', padding:'8px 12px', fontFamily:'Zen Dots', fontWeight:100}}>Price</th>
                  <th style={{textAlign:'left', padding:'8px 12px', fontFamily:'Zen Dots', fontWeight:100}}>Delivery</th>
                  <th style={{textAlign:'left', padding:'8px 12px', fontFamily:'Zen Dots', fontWeight:100}}>Revisions</th>
                  <th style={{textAlign:'left', padding:'8px 12px', fontFamily:'Zen Dots', fontWeight:100}}>Features</th>
                </tr>
              </thead>
              <tbody>
                {packages && packages.length > 0 ? packages.map((p, i) => (
                  <tr key={i}>
                    <td style={{padding:'10px 12px', fontFamily:'Jura'}}>{p.name}</td>
                    <td style={{padding:'10px 12px', fontFamily:'Jura'}}>{p.price ?? 'N/A'} {p.currency || currency}</td>
                    <td style={{padding:'10px 12px', fontFamily:'Jura'}}>{p.deliveryTime ?? 'N/A'}</td>
                    <td style={{padding:'10px 12px', fontFamily:'Jura'}}>{p.revisions ?? 'N/A'}</td>
                    <td style={{padding:'10px 12px', fontFamily:'Jura'}}>{p.features ? p.features.join('\n') : 'N/A'}</td>
                  </tr>
                )) : (
                  // Fallback to three empty rows to indicate Basic/Standard/Premium
                  ['Basic','Standard','Premium'].map((name)=> (
                    <tr key={name}>
                      <td style={{padding:'10px 12px', fontFamily:'Jura'}}>{name}</td>
                      <td style={{padding:'10px 12px', fontFamily:'Jura'}}>N/A</td>
                      <td style={{padding:'10px 12px', fontFamily:'Jura'}}>N/A</td>
                      <td style={{padding:'10px 12px', fontFamily:'Jura'}}>N/A</td>
                      <td style={{padding:'10px 12px', fontFamily:'Jura'}}>N/A</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.juraTitle} style={{marginTop: '20px'}}>Package Pricing</div>
        <div className={styles.reviewBox}>
          <div style={{marginTop:8}}>
            {(packages && packages.length > 0 ? packages : [{ name: 'Basic' }, { name: 'Standard' }, { name: 'Premium' }]).map((p: any, i: number) => (
              <div key={i} className={styles.reviewRow}>
                <div className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{p.name}</div>
                <div className={`${styles.milestonePrice}`} style={{fontFamily: 'Jura'}}>{p.price ?? 'N/A'} {p.currency || currency}</div>
              </div>
            ))}
          </div>
        </div>

        {filesNote && (
          <div style={{marginTop:20}}>
            <div className={styles.juraTitle} style={{fontFamily: 'Jura', fontWeight: 500}}>Additional Terms</div>
            <div style={{padding:10, border:'1px solid #eee', marginTop:6, fontFamily:'Jura', fontSize:'16px'}} className={styles.reviewValue}>{filesNote}</div>
          </div>
        )}

        <div style={{marginTop:18}}>
          <div className={styles.juraTitle} style={{fontFamily: 'Jura', fontWeight: 500}}>Gig Files</div>
          {files && files.length > 0 ? (
            <div className={styles.uploadedList} role="list" aria-label="Uploaded files for this gig">
              {files.map((f: File, i: number) => (
                <div key={i} className={styles.uploadedItem} role="listitem">
                  <div className={styles.uploadedName} style={{fontFamily: 'Jura'}}>{f.name}</div>
                  <div className={styles.uploadedSize} style={{fontFamily: 'Jura'}}>{(f.size/1024).toFixed(1)} KB</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{color:'#666', marginTop:8, fontFamily: 'Jura'}}>No gig files uploaded.</div>
          )}
        </div>

        {isClientView && (
          <div style={{marginTop:16, display:'flex', gap:8, alignItems:'center'}}>
            <input 
              id="clientApprove" 
              type="checkbox" 
              checked={approved} 
              onChange={(e) => setApproved(e.target.checked)} 
            />
            <label htmlFor="clientApprove" style={{fontFamily:'Jura'}}>
              I approve these payment terms and agree to pay {value} {currency} to the smart contract escrow
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateReviewStep;
