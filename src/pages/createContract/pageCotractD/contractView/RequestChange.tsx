import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RequestChange.module.css';
import authStyles from '../../../../components/auth/AuthForm.module.css';
import heroOutlineup from '../../../../assets/Login/cardBackgroundup.svg';
import heroOutlinedown from '../../../../assets/Login/cardBackgrounddown.svg';
import Button2 from '../../../../components/button/Button2/Button2';
import Button3Black1 from '../../../../components/button/Button3Black1/Button3Black1';

type AttachedFile = {
  name: string;
  size: number;
  url: string;
  type?: string;
};

type ChangeRequest = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'confirmed' | 'approved' | 'rejected';
  amount?: string;
  details?: string;
  createdBy: 'client' | 'developer';
  attachedFiles?: AttachedFile[];
};

const RequestChange: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed'>('pending');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [modalDetails, setModalDetails] = useState('');
  const [modalAmount, setModalAmount] = useState('');

  // New change request form state (client-only)
  const [newRequestTitle, setNewRequestTitle] = useState('');
  const [newRequestDescription, setNewRequestDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const userRole = 'client'; // TODO: Get from auth context

  // View details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<ChangeRequest | null>(null);

  // Mock data - replace with actual data from API/context
  const [pendingRequests, setPendingRequests] = useState<ChangeRequest[]>([
    {
      id: 'REQ001',
      title: 'Add new feature module',
      description: 'Client requests additional authentication module',
      status: 'pending',
      createdBy: 'client',
      attachedFiles: [
        { name: 'requirements-document.pdf', size: 245000, url: '#', type: 'application/pdf' },
        { name: 'feature-specs.docx', size: 128000, url: '#', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      ],
    },
    {
      id: 'REQ002',
      title: 'Update design specs',
      description: 'Change color scheme and typography',
      status: 'pending',
      createdBy: 'client',
      attachedFiles: [
        { name: 'design-mockup.png', size: 1200000, url: '#', type: 'image/png' },
      ],
    },
  ]);

  const [confirmedRequests, setConfirmedRequests] = useState<ChangeRequest[]>([
    {
      id: 'REQ003',
      title: 'Database optimization',
      description: 'Optimize queries and add indexes',
      status: 'confirmed',
      amount: '500',
      details: 'Will implement caching layer and optimize slow queries',
      createdBy: 'developer',
      attachedFiles: [
        { name: 'performance-report.pdf', size: 340000, url: '#', type: 'application/pdf' },
      ],
    },
  ]);

  const handleConfirmClick = (request: ChangeRequest) => {
    setSelectedRequest(request);
    setModalDetails('');
    setModalAmount('');
    setShowModal(true);
  };

  const handleIgnore = (requestId: string) => {
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    // TODO: Call API to update request status
  };

  const handleModalConfirm = () => {
    if (!selectedRequest || !modalAmount) return;

    const confirmedRequest: ChangeRequest = {
      ...selectedRequest,
      status: 'confirmed',
      amount: modalAmount,
      details: modalDetails,
    };

    setConfirmedRequests(prev => [...prev, confirmedRequest]);
    setPendingRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
    setShowModal(false);
    setSelectedRequest(null);
    // TODO: Call API to save confirmed request
  };

  const handleClientApprove = (requestId: string) => {
    const request = confirmedRequests.find(req => req.id === requestId);
    if (!request) return;

    setConfirmedRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      )
    );
    // TODO: Call API to update contract price and request status
    alert(`Request approved! Contract price will be updated by ${request.amount} ETH`);
  };

  const handleClientReject = (requestId: string) => {
    setConfirmedRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
    // TODO: Call API to update request status
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitNewRequest = () => {
    if (!newRequestTitle.trim() || !newRequestDescription.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    // Convert File objects to AttachedFile format
    const convertedFiles: AttachedFile[] = attachedFiles.map(file => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file), // Create temporary URL for preview
      type: file.type,
    }));

    const newRequest: ChangeRequest = {
      id: `REQ${String(pendingRequests.length + 1 + confirmedRequests.length).padStart(3, '0')}`,
      title: newRequestTitle,
      description: newRequestDescription,
      status: 'pending',
      createdBy: 'client',
      attachedFiles: convertedFiles.length > 0 ? convertedFiles : undefined,
    };

    setPendingRequests(prev => [...prev, newRequest]);
    setNewRequestTitle('');
    setNewRequestDescription('');
    setAttachedFiles([]);
    // TODO: Call API to create new request with file uploads to IPFS/Supabase
    alert('Change request submitted successfully!');
  };

  const handleRowClick = (request: ChangeRequest) => {
    setViewingRequest(request);
    setShowDetailsModal(true);
  };

  const handleFileDownload = (file: AttachedFile) => {
    // For real files from server/IPFS
    if (file.url && file.url !== '#') {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For demo/mock files - create a simple text file
      const blob = new Blob([`This is a demo file: ${file.name}`], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return '🖼️';
      case 'zip':
      case 'rar':
        return '📦';
      case 'txt':
        return '📋';
      default:
        return '📎';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={authStyles.formOuter}>
          <img src={heroOutlineup} alt="outline" className={`${authStyles.outline} ${authStyles.outlineTop}`} />
          <img src={heroOutlinedown} alt="outline" className={`${authStyles.outline} ${authStyles.outlineBottom}`} />

          <div className={styles.header}>
            <Button2 text="← Back" onClick={() => navigate(-1)} />
            <h1 className={styles.title}>Request Change</h1>
          </div>

          <div className={authStyles.authBody}>

        {/* Client-only: New Change Request Form */}
        {userRole === 'client' && (
          <div className={styles.newRequestSection}>
            <h2 className={styles.sectionTitle}>Submit New Change Request</h2>
            <div className={styles.formGroup}>
              <label htmlFor="requestTitle" className={styles.formLabel}>
                Request Title
              </label>
              <input
                id="requestTitle"
                type="text"
                className={styles.formInput}
                placeholder="Enter request title..."
                value={newRequestTitle}
                onChange={(e) => setNewRequestTitle(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="requestDescription" className={styles.formLabel}>
                Description
              </label>
              <textarea
                id="requestDescription"
                className={styles.formTextarea}
                placeholder="Describe the change request in detail..."
                value={newRequestDescription}
                onChange={(e) => setNewRequestDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fileAttachment" className={styles.formLabel}>
                File Attachment (optional)
              </label>
              <div className={styles.fileUploadWrapper}>
                <input
                  id="fileAttachment"
                  type="file"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                  multiple
                />
                <label htmlFor="fileAttachment" className={styles.fileUploadBtn}>
                  <span>📎 Choose Files</span>
                </label>
              </div>

              {attachedFiles.length > 0 && (
                <div className={styles.fileList}>
                  {attachedFiles.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                      <button
                        className={styles.fileRemoveBtn}
                        onClick={() => handleRemoveFile(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.submitBtnWrapper}>
              <Button3Black1 text="Submit Request" onClick={handleSubmitNewRequest} />
            </div>
          </div>
        )}

        <div className={styles.tabNav}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Requests
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'confirmed' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('confirmed')}
          >
            Confirmed Requests
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className={styles.tableWrap}>
            <h2 className={styles.tableTitle}>Pending Change Requests</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Request Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.emptyState}>
                      No pending requests
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map(request => (
                    <tr key={request.id} className={styles.clickableRow}>
                      <td className={styles.idCell} onClick={() => handleRowClick(request)}>{request.id}</td>
                      <td className={styles.titleCell} onClick={() => handleRowClick(request)}>{request.title}</td>
                      <td className={styles.descCell} onClick={() => handleRowClick(request)}>{request.description}</td>
                      <td className={styles.actionsCell}>
                        <button
                          className={styles.confirmBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmClick(request);
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          className={styles.ignoreBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIgnore(request.id);
                          }}
                        >
                          Ignore
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'confirmed' && (
          <div className={styles.tableWrap}>
            <h2 className={styles.tableTitle}>Confirmed Requests (Awaiting Client Approval)</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Request Title</th>
                  <th>Details</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Client Actions</th>
                </tr>
              </thead>
              <tbody>
                {confirmedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      No confirmed requests
                    </td>
                  </tr>
                ) : (
                  confirmedRequests.map(request => (
                    <tr key={request.id} className={styles.clickableRow}>
                      <td className={styles.idCell} onClick={() => handleRowClick(request)}>{request.id}</td>
                      <td className={styles.titleCell} onClick={() => handleRowClick(request)}>{request.title}</td>
                      <td className={styles.descCell} onClick={() => handleRowClick(request)}>{request.details || request.description}</td>
                      <td className={styles.amountCell} onClick={() => handleRowClick(request)}>{request.amount} ETH</td>
                      <td className={styles.statusCell} onClick={() => handleRowClick(request)}>
                        <span className={styles[`status${request.status}`]}>{request.status}</span>
                      </td>
                      <td className={styles.actionsCell}>
                        {request.status === 'confirmed' && (
                          <>
                            <button
                              className={styles.approveBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClientApprove(request.id);
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className={styles.rejectBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClientReject(request.id);
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {request.status === 'approved' && <span className={styles.statusBadge}>Approved ✓</span>}
                        {request.status === 'rejected' && <span className={styles.statusBadge}>Rejected ✗</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      {/* View Details Modal */}
      {showDetailsModal && viewingRequest && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div className={styles.detailsModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.detailsModalHeader}>
              <h3 className={styles.modalTitle}>Request Details</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowDetailsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.detailsBody}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Request ID:</span>
                <span className={styles.detailValue}>{viewingRequest.id}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Title:</span>
                <span className={styles.detailValue}>{viewingRequest.title}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Description:</span>
                <span className={styles.detailValue}>{viewingRequest.description}</span>
              </div>

              {viewingRequest.details && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Additional Details:</span>
                  <span className={styles.detailValue}>{viewingRequest.details}</span>
                </div>
              )}

              {viewingRequest.amount && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Amount:</span>
                  <span className={styles.detailValue}>{viewingRequest.amount} ETH</span>
                </div>
              )}

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status:</span>
                <span className={`${styles.detailValue} ${styles[`status${viewingRequest.status}`]}`}>
                  {viewingRequest.status}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Created By:</span>
                <span className={styles.detailValue}>{viewingRequest.createdBy}</span>
              </div>

              {/* Attached Files */}
              {viewingRequest.attachedFiles && viewingRequest.attachedFiles.length > 0 && (
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Attached Files:</span>
                  <div className={styles.attachedFilesList}>
                    {viewingRequest.attachedFiles.map((file, index) => (
                      <div key={index} className={styles.attachedFileItem}>
                        <span className={styles.fileIcon}>{getFileIcon(file.name)}</span>
                        <span className={styles.attachedFileName}>{file.name}</span>
                        <span className={styles.attachedFileSize}>
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                        <button 
                          className={styles.downloadFileBtn}
                          onClick={() => handleFileDownload(file)}
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && selectedRequest && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Confirm Change Request</h3>
            
            <div className={styles.modalSection}>
              <div className={styles.modalLabel}>Request ID:</div>
              <div className={styles.modalValue}>{selectedRequest.id}</div>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.modalLabel}>Title:</div>
              <div className={styles.modalValue}>{selectedRequest.title}</div>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.modalLabel}>Description:</div>
              <div className={styles.modalValue}>{selectedRequest.description}</div>
            </div>

            <div className={styles.modalFormGroup}>
              <label htmlFor="modalDetails" className={styles.modalLabel}>
                Additional Details:
              </label>
              <textarea
                id="modalDetails"
                className={styles.modalTextarea}
                placeholder="Add implementation details..."
                value={modalDetails}
                onChange={(e) => setModalDetails(e.target.value)}
                rows={4}
              />
            </div>

            <div className={styles.modalFormGroup}>
              <label htmlFor="modalAmount" className={styles.modalLabel}>
                Amount of Change Request (ETH):
              </label>
              <input
                id="modalAmount"
                type="number"
                step="0.01"
                className={styles.modalInput}
                placeholder="Enter amount in ETH"
                value={modalAmount}
                onChange={(e) => setModalAmount(e.target.value)}
              />
            </div>

            <div className={styles.modalActions}>
              <Button2 text="Cancel" onClick={() => setShowModal(false)} />
              <Button3Black1 
                text="Confirm" 
                onClick={handleModalConfirm}
              />
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestChange;
