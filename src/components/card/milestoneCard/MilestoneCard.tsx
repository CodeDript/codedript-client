import React, { useState, useRef } from 'react';
import styles from './MilestoneCard.module.css';
import { MilestoneService } from '../../../api/milestoneService';

type Milestone = { 
  _id?: string;
  title: string; 
  due?: string; 
  amount?: string; 
  status?: string;
  submission?: {
    demoFiles?: Array<{
      name: string;
      url: string;
      ipfsHash?: string;
    }>;
  };
};

type Props = {
  milestone: Milestone;
  index?: number;
  editable?: boolean; // show action buttons
  canComplete?: boolean; // whether this milestone can be completed (based on previous milestones)
  onUpdateStatus?: (index: number | undefined, newStatus: string) => void;
  onMilestoneUpdated?: () => void;
};

const MilestoneCard: React.FC<Props> = ({ milestone, index, editable = false, canComplete = true, onUpdateStatus, onMilestoneUpdated }) => {
  const { title, due, amount, status } = milestone;
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [ipfsLink, setIpfsLink] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statusClass = status === 'done' || status === 'completed' || status === 'approved' 
    ? styles.statusDone 
    : status === 'inprogress' || status === 'in_progress' || status === 'submitted'
    ? styles.statusInprogress 
    : styles.statusPending;

  const handleMarkInProgress = () => onUpdateStatus && onUpdateStatus(index, 'inprogress');
  const handleMarkDone = async () => {
    if (!canComplete) {
      alert('Please complete previous milestones first');
      return;
    }
    
    if (!milestone._id) {
      onUpdateStatus && onUpdateStatus(index, 'done');
      return;
    }

    // Check if files are selected
    if (selectedFiles.length === 0) {
      alert('Please upload at least one file before completing the milestone');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      console.log('📤 Uploading files to IPFS and completing milestone...');
      
      // Upload files to IPFS
      const result = await MilestoneService.uploadMilestoneFiles(milestone._id, selectedFiles);
      console.log('✅ Files uploaded:', result);
      
      // Complete the milestone
      await MilestoneService.completeMilestone(milestone._id, {
        description: 'Milestone completed with file uploads'
      });

      alert(`Milestone completed successfully! ${result.files.length} file(s) uploaded to IPFS.`);
      
      // Mark as done and refresh
      if (onUpdateStatus) {
        onUpdateStatus(index, 'completed');
      }

      // Refresh milestone data
      if (onMilestoneUpdated) {
        onMilestoneUpdated();
      }

      // Clear selected files
      setSelectedFiles([]);
    } catch (error: any) {
      console.error('Error completing milestone:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to complete milestone';
      setUploadError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => onUpdateStatus && onUpdateStatus(index, e.target.value);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setUploadError(null);
    }
  };

  const handleSubmitDeliverable = async () => {
    if (!milestone._id) {
      alert('Milestone ID not found');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      if (uploadType === 'file') {
        if (selectedFiles.length === 0) {
          setUploadError('Please select at least one file');
          setIsUploading(false);
          return;
        }

        console.log('📤 Uploading files to IPFS...');
        const result = await MilestoneService.uploadMilestoneFiles(milestone._id, selectedFiles);
        console.log('✅ Files uploaded:', result);
        
        alert(`Successfully uploaded ${result.files.length} file(s) to IPFS!`);
      } else {
        // Link/IPFS Hash upload
        if (!ipfsLink.trim()) {
          setUploadError('Please enter an IPFS link or hash');
          setIsUploading(false);
          return;
        }

        // Extract IPFS hash from link if it's a full URL
        let ipfsHash = ipfsLink.trim();
        if (ipfsHash.includes('/ipfs/')) {
          ipfsHash = ipfsHash.split('/ipfs/')[1].split('?')[0];
        }

        console.log('📎 Adding IPFS link to milestone...');
        await MilestoneService.completeMilestone(milestone._id, {
          ipfsHash,
          fileUrl: ipfsLink,
          description: 'Deliverable uploaded via IPFS link'
        });
        
        alert('IPFS link added successfully!');
      }

      // Mark milestone as done
      if (onUpdateStatus) {
        onUpdateStatus(index, 'completed');
      }

      // Refresh milestone data
      if (onMilestoneUpdated) {
        onMilestoneUpdated();
      }

      // Close modal
      setShowUploadModal(false);
      setSelectedFiles([]);
      setIpfsLink('');
    } catch (error: any) {
      console.error('Error uploading deliverable:', error);
      setUploadError(error.response?.data?.message || error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className={styles.milestoneCard} role="group" aria-label={`Milestone ${title}`}>
        <div className={styles.left}>
          <div className={styles.iconWrap} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#e2e2e2" strokeWidth="1.2" />
              <path d="M8 12l2.5 2.5L16 9" stroke="#bdbdbd" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className={styles.titleWrap}>
            <div className={styles.title}>{title}</div>
            {due && <div className={styles.due}>Due: {due}</div>}
            
            {/* Show uploaded files */}
            {milestone.submission?.demoFiles && milestone.submission.demoFiles.length > 0 && (
              <div className={styles.filesWrap}>
                <div className={styles.filesLabel}>📎 Deliverables:</div>
                {milestone.submission.demoFiles.map((file, i) => (
                  <div key={i} className={styles.fileItem}>
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.fileLink}
                    >
                      {file.name}
                    </a>
                    {file.ipfsHash && (
                      <span className={styles.ipfsHash} title={file.ipfsHash}>
                        IPFS: {file.ipfsHash.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <div className={`${styles.statusBadge} ${statusClass}`} aria-live="polite">
            {status === 'in_progress' ? 'In Progress' : status === 'completed' ? 'Done' : status || 'Pending'}
          </div>

          {editable && (
            <div className={styles.btns}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className={styles.fileInput}
                style={{ display: 'none' }}
              />
              <button 
                className={`${styles.actionBtn} ${styles.uploadBtn}`} 
                onClick={() => fileInputRef.current?.click()}
                aria-label={`Upload files for ${title}`}
                disabled={!canComplete}
                style={{ opacity: canComplete ? 1 : 0.5, cursor: canComplete ? 'pointer' : 'not-allowed' }}
                title={selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Upload files'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {selectedFiles.length > 0 && <span className={styles.fileCount}>{selectedFiles.length}</span>}
              </button>
              <button 
                className={`${styles.actionBtn} ${styles.doneBtn}`} 
                onClick={handleMarkDone} 
                aria-label={`Mark ${title} done`}
                disabled={!canComplete || (!!milestone._id && selectedFiles.length === 0)}
                style={{ 
                  opacity: (canComplete && (!milestone._id || selectedFiles.length > 0)) ? 1 : 0.5, 
                  cursor: (canComplete && (!milestone._id || selectedFiles.length > 0)) ? 'pointer' : 'not-allowed' 
                }}
              >
                Complete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={styles.modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Upload Deliverable</h3>
              <button className={styles.closeBtn} onClick={() => setShowUploadModal(false)}>×</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.uploadTypeSelector}>
                <button
                  className={uploadType === 'file' ? styles.activeTab : ''}
                  onClick={() => setUploadType('file')}
                >
                  📄 Upload File
                </button>
                <button
                  className={uploadType === 'link' ? styles.activeTab : ''}
                  onClick={() => setUploadType('link')}
                >
                  🔗 IPFS Link
                </button>
              </div>

              {uploadType === 'file' ? (
                <div className={styles.fileUploadSection}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className={styles.fileInput}
                  />
                  <button 
                    className={styles.selectFileBtn}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Files
                  </button>
                  
                  {selectedFiles.length > 0 && (
                    <div className={styles.selectedFiles}>
                      <strong>Selected files:</strong>
                      <ul>
                        {selectedFiles.map((file, i) => (
                          <li key={i}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.linkUploadSection}>
                  <label>IPFS Hash or Gateway URL:</label>
                  <input
                    type="text"
                    placeholder="QmX... or https://ipfs.io/ipfs/QmX..."
                    value={ipfsLink}
                    onChange={(e) => setIpfsLink(e.target.value)}
                    className={styles.linkInput}
                  />
                  <small>You can paste an IPFS hash or a full gateway URL</small>
                </div>
              )}

              {uploadError && (
                <div className={styles.errorMessage}>{uploadError}</div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelBtn} 
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                className={styles.submitBtn} 
                onClick={handleSubmitDeliverable}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Submit & Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MilestoneCard;
