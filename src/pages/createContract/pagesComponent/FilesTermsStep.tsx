import React from 'react';
import styles from '../pageCotractD/pageCotractD.module.css';
import uploadIcon from '../../../assets/contractSvg/file uploard.svg';

type Props = {
  filesNote: string;
  setFilesNote: (v: string) => void;
};

const FilesTermsStep: React.FC<Props> = ({ filesNote, setFilesNote }) => {
  return (
    <>
      <h4 className={styles.sectionTitle}>Files & Terms</h4>
      <h4 className={styles.step}>Step 3 of 5</h4>

      <div className={styles.cardArea2}>
        <label className={styles.uploadLabel}>Project File (optional):</label>
        <div className={styles.uploadBox}>
          <img src={uploadIcon} alt="upload" className={styles.uploadIcon} />
          <div className={styles.uploadTitle}>Upload project file</div>
          <div className={styles.uploadSubtext}>Requirements, designs, or reference materials</div>
        </div>

        <div style={{marginTop:18}} className={styles.formRow}>
          <label>Additional Terms (optional):</label>
          <textarea value={filesNote} onChange={(e)=>setFilesNote(e.target.value)} rows={4} />
        </div>
      </div>
    </>
  );
};

export default FilesTermsStep;
