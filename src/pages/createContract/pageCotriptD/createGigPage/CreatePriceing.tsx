import React from 'react';
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

const CreatePriceing: React.FC = () => {
  return (
    <>
      <h4 className={styles.sectionTitle}>Priceing</h4>
      <h4 className={styles.step}>Step 2 of 5</h4>

      <div className={styles.cardArea2}>
        <div style={{ overflowX: 'auto' }}>
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
                <td style={cellStyle}><strong>Price</strong></td>
                <td style={cellStyle}>5300 ETH</td>
                <td style={cellStyle}>7000 ETH</td>
                <td style={cellStyle}>9500 ETH</td>
              </tr>

              <tr>
                <td style={cellStyle}><strong>Delivery</strong></td>
                <td style={cellStyle}>14 days</td>
                <td style={cellStyle}>10 days</td>
                <td style={cellStyle}>07 days</td>
              </tr>

              <tr>
                <td style={cellStyle}><strong>Revisions</strong></td>
                <td style={cellStyle}>1</td>
                <td style={cellStyle}>2</td>
                <td style={cellStyle}>3</td>
              </tr>

              <tr>
                <td style={cellStyle}><strong>Features</strong></td>
                <td style={cellStyle}>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    <li>static analysis</li>
                    <li>Basic Manual review</li>
                    <li>Summary report</li>
                    <li>Source report</li>
                  </ul>
                </td>
                <td style={cellStyle}>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    <li>static analysis</li>
                    <li>Basic Manual review</li>
                    <li>Summary report</li>
                    <li>Source report</li>
                  </ul>
                </td>
                <td style={cellStyle}>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    <li>Full functional application</li>
                    <li>Basic Manual review</li>
                    <li>Summary report</li>
                    <li>Source report</li>
                    <li>Vector file</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CreatePriceing;
