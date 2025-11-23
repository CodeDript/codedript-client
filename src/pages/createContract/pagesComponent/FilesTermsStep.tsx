import React from 'react';
import styles from '../pageCotractD/pageCotractD.module.css';
import uploadIcon from '../../../assets/contractSvg/file uploard.svg';

type Props = {
  filesNote: string;
  setFilesNote: (v: string) => void;
  files: File[];
  setFiles: (v: File[]) => void;
};

const FilesTermsStep: React.FC<Props> = ({ filesNote, setFilesNote, files, setFiles }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAreaClick = () => inputRef.current?.click();

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length === 0) return;
    // append
    setFiles([...files, ...selected]);
    // clear input value so same file can be picked again if needed
    e.currentTarget.value = '';
  };

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
  };
  return (
    <>
      <h4 className={styles.sectionTitle}>Files & Terms</h4>
      <h4 className={styles.step}>Step 3 of 5</h4>

      <div className={styles.cardArea2}>
        <label className={styles.uploadLabel}>Project File (optional):</label>
        <div className={styles.uploadBox} onClick={handleAreaClick} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key === 'Enter' || e.key === ' ') handleAreaClick(); }}>
          <img src={uploadIcon} alt="upload" className={styles.uploadIcon} />
          <div className={styles.uploadTitle}>Upload project file</div>
          <div className={styles.uploadSubtext}>Requirements, designs, or reference materials</div>
          <input ref={inputRef} type="file" multiple accept="*/*" onChange={onFilesSelected} style={{display: 'none'}} />
        </div>

        {/* uploaded files list */}
        {files && files.length > 0 && (
          <div style={{marginTop:12}} className={styles.uploadedList}>
            {files.map((f, i) => (
              <div key={i} className={styles.uploadedItem}>
                <div className={styles.uploadedName}>{f.name}</div>
                <div className={styles.uploadedSize}>{(f.size/1024).toFixed(1)} KB</div>
                <button className={styles.removeBtn} onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <div style={{marginTop:18}} className={styles.formRow}>
          <label>Additional Terms (optional):</label>
          <textarea value={filesNote} onChange={(e)=>setFilesNote(e.target.value)} rows={4} />
        </div>
      </div>
    </>
  );
};

export default FilesTermsStep;
