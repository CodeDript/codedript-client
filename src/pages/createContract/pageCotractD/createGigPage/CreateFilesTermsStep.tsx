import React from 'react';
import styles from '../pageCotractD.module.css';
import uploadIcon from '../../../../assets/contractSvg/file uploard.svg';
import { useAgreement } from '../../../../context/AgreementContext';

type Props = {
  filesNote: string;
  setFilesNote: (v: string) => void;
  files: File[];
  setFiles: (v: File[]) => void;
};

const CreateFilesTermsStep: React.FC<Props> = ({ filesNote, setFilesNote, files, setFiles }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const { updateFormData } = useAgreement();

  const handleAreaClick = () => inputRef.current?.click();

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length === 0) return;
    
    // Validate that selected files are images
    const imageFiles = selected.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== selected.length) {
      alert('Please select only image files (JPG, PNG, GIF, etc.)');
    }
    
    if (imageFiles.length > 0) {
      setFiles([...files, ...imageFiles]);
    }
    e.currentTarget.value = '';
  };

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
  };

  // Persist filesNote to context
  React.useEffect(() => {
    updateFormData({ filesNote });
  }, [filesNote]);

  return (
    <>
      <h4 className={styles.sectionTitle}>Files & Requirements</h4>
      <h4 className={styles.step}>Step 3 of 4</h4>

      <div className={styles.cardArea2}>
        <label className={styles.uploadLabel} htmlFor="project-file" style={{ fontSize: '1.05rem', fontFamily: "'Jura', sans-serif" }}>Gig Images (up to 5 images):</label>
        <div className={styles.uploadBox} onClick={handleAreaClick} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key === 'Enter' || e.key === ' ') handleAreaClick(); }} aria-label="Upload gig images" aria-describedby="upload-help">
          <img src={uploadIcon} alt="upload" className={styles.uploadIcon} />
          <div className={styles.uploadTitle}>Upload gig images</div>
          <div id="upload-help" className={styles.uploadSubtext}>Showcase your work (JPG, PNG, GIF - max 5 images)</div>
          <input id="project-file" ref={inputRef} type="file" multiple accept="image/*" onChange={onFilesSelected} style={{display: 'none'}} aria-hidden="true" />
        </div>

        {files && files.length > 0 && (
          <div style={{marginTop:12}} className={styles.uploadedList} role="list" aria-label="Uploaded project files">
            {files.map((f, i) => (
              <div key={i} className={styles.uploadedItem} role="listitem">
                <div className={styles.uploadedName}>{f.name}</div>
                <div className={styles.uploadedSize}>{(f.size/1024).toFixed(1)} KB</div>
                <button className={styles.removeBtn} onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <div style={{marginTop:18}} className={styles.formRow}>
          <label htmlFor="requirements-text">Requirements & Additional Terms (optional):</label>
          <textarea id="requirements-text" aria-label="Requirements and additional terms" value={filesNote} onChange={(e)=>setFilesNote(e.target.value)} rows={4} />
        </div>
      </div>
    </>
  );
};

export default CreateFilesTermsStep;
