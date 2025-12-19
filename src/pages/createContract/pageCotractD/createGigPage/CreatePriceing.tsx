import React, { useState, useEffect } from 'react';
import styles from '../pageCotractD.module.css';

const cellStyle: React.CSSProperties = {
  border: '1px solid #d3d3d3',
  padding: '12px',
  verticalAlign: 'top',
  fontFamily: "'Jura', sans-serif",
  color: '#333',
  fontSize: '0.95rem'
};

const headerStyle: React.CSSProperties = {
  ...cellStyle,
  background: '#f1f1f1',
  fontWeight: 700,
  textAlign: 'left'
};

interface Package {
  name: 'basic' | 'standard' | 'premium';
  price: number;
  deliveryTime: number;
  features: string[];
  description: string;
}

type Props = {
  onAgreeChange?: (v: boolean) => void;
  onPackagesChange?: (packages: Package[]) => void;
};

const CreatePriceing: React.FC<Props> = ({ onAgreeChange, onPackagesChange }) => {
  const [basicPrice, setBasicPrice] = useState('5300');
  const [standardPrice, setStandardPrice] = useState('7000');
  const [premiumPrice, setPremiumPrice] = useState('9500');

  const [basicDelivery, setBasicDelivery] = useState('14');
  const [standardDelivery, setStandardDelivery] = useState('10');
  const [premiumDelivery, setPremiumDelivery] = useState('7');

  const [basicRevisions, setBasicRevisions] = useState('1');
  const [standardRevisions, setStandardRevisions] = useState('2');
  const [premiumRevisions, setPremiumRevisions] = useState('3');

  const [basicFeatures, setBasicFeatures] = useState('static analysis\nBasic Manual review\nSummary report\nSource report');
  const [standardFeatures, setStandardFeatures] = useState('static analysis\nBasic Manual review\nSummary report\nSource report');
  const [premiumFeatures, setPremiumFeatures] = useState('Full functional application\nBasic Manual review\nSummary report\nSource report\nVector file');

  const [agreed, setAgreed] = useState(false);
  const prevBorder = React.useRef<Map<HTMLElement, string>>(new Map());

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    const td = (e.currentTarget as HTMLElement).closest('td') as HTMLElement | null;
    if (td) {
      prevBorder.current.set(td, td.style.border || '');
      td.style.border = 'none';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const td = (e.currentTarget as HTMLElement).closest('td') as HTMLElement | null;
    if (td) {
      const prev = prevBorder.current.get(td) ?? '1px solid #d3d3d3';
      td.style.border = prev;
      prevBorder.current.delete(td);
    }
  };

  useEffect(() => { onAgreeChange && onAgreeChange(agreed); }, [agreed, onAgreeChange]);
  
  // Send package data to parent via onPackagesChange
  useEffect(() => {
    const packages: Package[] = [
      {
        name: 'basic',
        price: parseFloat(basicPrice) || 0,
        deliveryTime: parseInt(basicDelivery, 10) || 0,
        features: basicFeatures ? basicFeatures.split(/\r?\n/).filter(f => f.trim()) : [],
        description: 'Basic package with essential features'
      },
      {
        name: 'standard',
        price: parseFloat(standardPrice) || 0,
        deliveryTime: parseInt(standardDelivery, 10) || 0,
        features: standardFeatures ? standardFeatures.split(/\r?\n/).filter(f => f.trim()) : [],
        description: 'Standard package with more features'
      },
      {
        name: 'premium',
        price: parseFloat(premiumPrice) || 0,
        deliveryTime: parseInt(premiumDelivery, 10) || 0,
        features: premiumFeatures ? premiumFeatures.split(/\r?\n/).filter(f => f.trim()) : [],
        description: 'Premium package with all features'
      }
    ];

    if (onPackagesChange) {
      onPackagesChange(packages);
    }
  }, [basicPrice, standardPrice, premiumPrice, basicDelivery, standardDelivery, premiumDelivery, basicRevisions, standardRevisions, premiumRevisions, basicFeatures, standardFeatures, premiumFeatures, onPackagesChange]);
  return (
    <>
      <h4 className={styles.sectionTitle}>Priceing</h4>
      <h4 className={styles.step}>Step 2 of 4</h4>

      <div className={styles.cardArea2}>
        <div style={{ marginBottom: 10, fontFamily: "'Jura', sans-serif", fontWeight: 700, fontSize: '1.1rem' }}>Compare Package</div>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', WebkitFontSmoothing: 'antialiased', WebkitTextSizeAdjust: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: 720 }}>
            <thead>
              <tr>
                <th style={{ ...headerStyle, width: '22%' }}>Compare Package</th>
                <th style={{ ...headerStyle, width: '26%' }}>Basic</th>
                <th style={{ ...headerStyle, width: '26%' }}>Standard</th>
                <th style={{ ...headerStyle, width: '26%' }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}><strong>Price (ETH)</strong></td>
                <td style={cellStyle}><input value={basicPrice} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setBasicPrice(e.target.value)} style={{width:'100%', background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize: '1.05rem', outline:'none', boxShadow:'none'}} /> </td>
                <td style={cellStyle}><input value={standardPrice} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setStandardPrice(e.target.value)} style={{width:'100%', background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize: '1.05rem', outline:'none', boxShadow:'none'}} /></td>
                <td style={cellStyle}><input value={premiumPrice} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setPremiumPrice(e.target.value)} style={{width:'100%', background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize: '1.05rem', outline:'none', boxShadow:'none'}} /></td>
              </tr>

              <tr>
                <td style={cellStyle}><strong>Delivery (days)</strong></td>
                <td style={cellStyle}><input value={basicDelivery} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setBasicDelivery(e.target.value)} style={{width:'100%', background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize: '1.05rem', outline:'none', boxShadow:'none'}} /></td>
                <td style={cellStyle}><input value={standardDelivery} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setStandardDelivery(e.target.value)} style={{width:'100%', background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize: '1.05rem', outline:'none', boxShadow:'none'}} /></td>
                <td style={cellStyle}><input value={premiumDelivery} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setPremiumDelivery(e.target.value)} style={{width:'100%', background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize: '1.05rem', outline:'none', boxShadow:'none'}} /></td>
              </tr>

              <tr>
                <td style={cellStyle}><strong>Revisions</strong></td>
                <td style={cellStyle}><input value={basicRevisions} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setBasicRevisions(e.target.value)} style={{width:'100%', background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize: '1.05rem', outline:'none', boxShadow:'none'}} /></td>
                <td style={cellStyle}><input value={standardRevisions} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setStandardRevisions(e.target.value)} style={{width:'100%', background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize: '1.05rem', outline:'none', boxShadow:'none'}} /></td>
                <td style={cellStyle}><input value={premiumRevisions} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setPremiumRevisions(e.target.value)} style={{width:'100%', background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize: '1.05rem', outline:'none', boxShadow:'none'}} /></td>
              </tr>

              <tr>
                <td style={cellStyle}><strong>Features</strong></td>
                <td style={cellStyle}>
                  <textarea value={basicFeatures} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setBasicFeatures(e.target.value)} style={{width:'100%', minHeight:80, background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize:'1.02rem', resize:'vertical', padding:0, outline:'none', boxShadow:'none'}} />
                </td>
                <td style={cellStyle}>
                  <textarea value={standardFeatures} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setStandardFeatures(e.target.value)} style={{width:'100%', minHeight:80, background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize:'1.02rem', resize:'vertical', padding:0, outline:'none', boxShadow:'none'}} />
                </td>
                <td style={cellStyle}>
                  <textarea value={premiumFeatures} onFocus={handleFocus} onBlur={handleBlur} onChange={(e)=>setPremiumFeatures(e.target.value)} style={{width:'100%', minHeight:80, background:'transparent', border:'none', margin:0, fontFamily: "'Jura', sans-serif", fontSize:'1.02rem', resize:'vertical', padding:0, outline:'none', boxShadow:'none'}} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, borderTop: '1px solid #d3d3d3', paddingTop: 12 }}>
          <div style={{ background: '#f1f1f1ff', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: '0.95rem', color: '#575757ff', marginBottom: 8, fontFamily: "'Jura', sans-serif", fontWeight: 700 }}>
              Terms &amp; Conditions
            </div>
            <div style={{ fontSize: '0.9rem', color: '#444444ff', lineHeight: 1.3, fontFamily: "'Jura', sans-serif", fontWeight: 400 }}>
              <p style={{ margin: 0 }}>1) The buyer agrees to provide necessary access and information for the work.</p>
              <p style={{ margin: 0 }}>2) Delivery times are estimates and may vary based on scope changes.</p>
              <p style={{ margin: 0 }}>3) The provider retains the right to request milestones and clarifications before delivery.</p>
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input id="priceingAgree" type="checkbox" checked={agreed} onChange={(e)=>setAgreed(e.target.checked)}
              style={{ width: 22, height: 22, accentColor: '#000' }} />
            <label htmlFor="priceingAgree" style={{ fontSize: '0.95rem', color: '#111', fontFamily: "'Jura', sans-serif", fontWeight: 400 }}>I agree to the terms and conditions</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePriceing;
