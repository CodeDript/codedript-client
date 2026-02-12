import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { showAlert } from '../../../../components/auth/Alert';
import { requestChangesApi } from '../../../../api/requestChanges.api';
import { transactionsApi } from '../../../../api/transactions.api';
import ConfirmModal from '../../../../components/modal/ConfirmModal/ConfirmModal';
import { requestChange } from '../../../../services/ContractService';
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
  status: 'pending' | 'priced' | 'confirmed' | 'paid' | 'rejected';
  amount?: string;
  details?: string;
  createdBy: 'client' | 'developer';
  attachedFiles?: AttachedFile[];
  rawId?: string; // server _id for API calls
};

const RequestChange: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // agreement passed via navigation state from ContractSummary
  const agreementObj: any = location.state?.agreement;
  const agreementId: string | undefined = agreementObj?._id || agreementObj?.id || agreementObj?.agreementId;

  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed'>('pending');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [modalDetails, setModalDetails] = useState('');
  const [modalAmount, setModalAmount] = useState('');

  // New change request form state (client-only)
  const [newRequestTitle, setNewRequestTitle] = useState('');
  const [newRequestDescription, setNewRequestDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const { user } = useAuthContext();
  const userRole: string = user?.role ?? 'guest';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [pendingDeleteRawId, setPendingDeleteRawId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [paymentProcessingId, setPaymentProcessingId] = useState<string | null>(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [pendingRejectRawId, setPendingRejectRawId] = useState<string | null>(null);
  const [pendingRejectRequestId, setPendingRejectRequestId] = useState<string | null>(null);

  // If the user is a developer, ensure the confirmed tab is not active
  useEffect(() => {
    if ((userRole === 'developer' || userRole === 'client') && activeTab === 'confirmed') {
      setActiveTab('pending');
    }
  }, [userRole, activeTab]);

  // View details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<ChangeRequest | null>(null);
  const [modalProcessing, setModalProcessing] = useState(false);

  // Requests loaded from API
  const [pendingRequests, setPendingRequests] = useState<ChangeRequest[]>([]);
  const [confirmedRequests, setConfirmedRequests] = useState<ChangeRequest[]>([]);

  const handleConfirmClick = (request: ChangeRequest) => {
    setSelectedRequest(request);
    setModalDetails('');
    setModalAmount('');
    setShowModal(true);
  };

  const handleIgnore = (requestId: string) => {
    const req = pendingRequests.find(r => r.id === requestId);
    if (!req) return;

    // Show modal confirmation aligned with frontend instead of native confirm()
    if (userRole === 'client') {
      const idToDelete = req.rawId || req.id;
      setPendingDeleteRawId(idToDelete);
      setShowCancelConfirm(true);
      return;
    }

    // For developer role, show confirmation then call API to mark rejected
    const idToUpdate = req.rawId || req.id;
    if (userRole === 'developer') {
      setPendingRejectRawId(idToUpdate);
      setPendingRejectRequestId(requestId);
      setShowRejectConfirm(true);
      return;
    }

    // Other roles: remove locally
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const confirmCancel = () => {
    if (!pendingDeleteRawId) return;
    setDeleting(true);
    requestChangesApi.delete(pendingDeleteRawId)
      .then((res) => {
        const msg = (res as any).message || (res as any).data?.message || 'Request cancelled';
        showAlert(msg, 'success');
        loadRequests();
      })
      .catch((err) => {
        showAlert(err?.response?.data?.message || 'Failed to cancel request', 'error');
      })
      .finally(() => {
        setDeleting(false);
        setShowCancelConfirm(false);
        setPendingDeleteRawId(null);
      });
  };

  const cancelCancel = () => {
    setShowCancelConfirm(false);
    setPendingDeleteRawId(null);
  };

  const handleModalConfirm = () => {
    if (!selectedRequest || !modalAmount) return;

    const rawId = selectedRequest.rawId || selectedRequest.id;
    setModalProcessing(true);
    requestChangesApi.updatePrice(rawId, modalAmount)
      .then((res) => {
        showAlert('Price set and request confirmed', 'success');
        // refresh lists from server
        loadRequests();
        setShowModal(false);
        setSelectedRequest(null);
        setModalDetails('');
        setModalAmount('');
      })
      .catch((err) => {
        showAlert(err?.response?.data?.message || 'Failed to set price', 'error');
      })
      .finally(() => setModalProcessing(false));
  };

  const handleClientApprove = async (requestId: string) => {
    const request = confirmedRequests.find(req => req.id === requestId) || pendingRequests.find(req => req.id === requestId);
    if (!request || !request.amount) {
      showAlert('Request or amount not found', 'error');
      return;
    }

    const rawId = request.rawId || request.id;

    // Get blockchain agreement ID from the agreement object (0 is valid!)
    const blockchainAgreementId = agreementObj?.blockchain?.agreementId ??
      agreementObj?.blockchainId ??
      agreementObj?.agreementId ??
      null;

    if (blockchainAgreementId === null || blockchainAgreementId === undefined) {
      console.error('Agreement object missing blockchain ID:', agreementObj);
      showAlert('Blockchain agreement ID not found. Cannot process payment.', 'error');
      return;
    }

    console.log('Using blockchain agreement ID:', blockchainAgreementId);
    console.log('Agreement object:', agreementObj);

    setPaymentProcessingId(rawId);

    // Step 0: Check agreement status on blockchain before attempting payment
    try {
      const { getAgreementSummary } = await import('../../../../services/ContractService');
      const summary = await getAgreementSummary(blockchainAgreementId);
      console.log('Agreement status on blockchain:', summary.status);

      // Status enum: 0=Draft, 1=Active, 2=Completed, 3=Cancelled
      if (summary.status !== 1) {
        const statusNames = ['Draft', 'Active', 'Completed', 'Cancelled'];
        const statusName = statusNames[summary.status] || 'Unknown';
        showAlert(`Agreement is not active on blockchain. Current status: ${statusName}. Blockchain ID: ${blockchainAgreementId}`, 'error');
        setPaymentProcessingId(null);
        return;
      }
    } catch (statusErr: any) {
      console.error('Failed to check agreement status:', statusErr);
      showAlert(`Failed to verify agreement status: ${statusErr.message}`, 'error');
      setPaymentProcessingId(null);
      return;
    }

    try {
      // Step 1: Call smart contract requestChange function
      const txResult = await requestChange(
        blockchainAgreementId,
        request.description,
        request.amount
      );

      // Step 2: Record transaction with time-based retry logic
      // Sepolia block time is ~12s; we retry within a 60-second window with 3s intervals
      const RETRY_DURATION_MS = 60_000; // Total time window to keep retrying
      const RETRY_INTERVAL_MS = 3_000;  // Interval between retries
      const startTime = Date.now();

      const recordTransaction = async () => {
        while (Date.now() - startTime < RETRY_DURATION_MS) {
          try {
            await transactionsApi.create({
              type: 'modification',
              agreement: agreementId,
              transactionHash: txResult.transactionHash,
              network: 'sepolia'
            });

            // Success — clear state and refresh
            setPaymentProcessingId(null);
            await loadRequests();
            showAlert('Transaction recorded successfully!', 'success');
            // Mark the request change as paid on the server
            try {
              await requestChangesApi.updateStatus(rawId, 'paid');
              await loadRequests();
            } catch (_statusErr) {
              // Non-critical; transaction is already recorded
            }
            return; // Done
          } catch (recordErr: any) {
            const errorMsg = recordErr?.response?.data?.message || recordErr?.response?.data?.error?.message || recordErr?.message;

            // Already recorded — treat as success
            if (errorMsg?.includes('Transaction with this hash already exists')) {
              setPaymentProcessingId(null);
              await loadRequests();
              showAlert('Transaction already recorded!', 'success');
              try {
                await requestChangesApi.updateStatus(rawId, 'paid');
                await loadRequests();
              } catch (_statusErr) {
                // Non-critical
              }
              return;
            }

            // Duplicate key on transactionID — unrecoverable server issue
            if (errorMsg?.includes('E11000') && errorMsg?.includes('transactionID')) {
              setPaymentProcessingId(null);
              await loadRequests();
              showAlert('Payment completed but transaction recording failed. Please contact support.', 'error');
              return;
            }

            // Retryable: not mined, not found, or awaiting confirmation
            const isRetryable =
              errorMsg?.includes('not been mined') ||
              errorMsg?.includes('not found') ||
              errorMsg?.includes('confirmation') ||
              errorMsg?.includes('Transaction not found') ||
              errorMsg?.includes('not mined');

            if (!isRetryable) {
              // Non-retryable error — stop immediately
              setPaymentProcessingId(null);
              await loadRequests();
              showAlert('Payment completed but transaction recording failed.', 'error');
              return;
            }

            // Wait before next retry
            await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL_MS));
          }
        }

        // Exhausted the time window without success
        setPaymentProcessingId(null);
        await loadRequests();
        showAlert('Payment completed but transaction recording timed out. Please refresh the page.', 'error');
      };

      // Start recording (awaited so the button stays disabled throughout)
      await recordTransaction();
    } catch (err: any) {
      console.error('Blockchain transaction error:', err);
      let errorMsg = err?.reason || err?.message || 'Payment failed. Please try again.';

      // Check for specific blockchain errors
      if (errorMsg.includes('Agreement must be active')) {
        errorMsg = `Agreement is not active on blockchain (ID: ${blockchainAgreementId}). Please verify the agreement has been created on-chain.`;
      }

      showAlert(errorMsg, 'error');
      setPaymentProcessingId(null); // Clear processing state on blockchain error
    }
  };

  const handleClientReject = (requestId: string) => {
    // Show confirm modal before rejecting (developer or client)
    const req = confirmedRequests.find(r => r.id === requestId) || pendingRequests.find(r => r.id === requestId);
    if (!req) return;
    const idToUpdate = req.rawId || req.id;
    setPendingRejectRawId(idToUpdate);
    setPendingRejectRequestId(requestId);
    setShowRejectConfirm(true);
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
    // Build FormData for multipart upload
    if (!agreementId) {
      alert('Agreement ID not available. Cannot submit request.');
      return;
    }

    const formData = new FormData();
    formData.append('agreement', agreementId);
    formData.append('title', newRequestTitle);
    formData.append('description', newRequestDescription);
    attachedFiles.forEach((file) => {
      formData.append('files', file);
    });

    setIsSubmitting(true);
    requestChangesApi.create(formData)
      .then((res) => {
        const created = (res as any).data?.requestChange || (res as any).requestChange || null;
        // Convert server response into local ChangeRequest shape for display
        const serverFiles = Array.isArray(created?.files) ? created.files.map((f: any) => ({ name: f.url?.split('/').pop() || 'file', size: 0, url: f.url })) : [];
        // Normalize status into the ChangeRequest union type
        let normalizedStatus: ChangeRequest['status'];
        if (created?.status === 'priced') normalizedStatus = 'priced';
        else if (created?.status === 'paid') normalizedStatus = 'paid';
        else normalizedStatus = 'pending';

        const newRequest: ChangeRequest = {
          id: created?.requestID || created?._id || `REQ${String(pendingRequests.length + 1 + confirmedRequests.length).padStart(3, '0')}`,
          rawId: created?._id,
          title: created?.title || newRequestTitle,
          description: created?.description || newRequestDescription,
          status: normalizedStatus,
          createdBy: 'client',
          attachedFiles: serverFiles.length ? serverFiles : undefined,
        };

        setPendingRequests(prev => [...prev, newRequest]);
        setNewRequestTitle('');
        setNewRequestDescription('');
        setAttachedFiles([]);
        const successMsg = (res as any).message || 'Change request submitted successfully!';
        showAlert(successMsg, 'success');
        // refresh list from server
        loadRequests();
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err.message || 'Failed to create change request.';
        showAlert(msg, 'error');
      })
      .finally(() => setIsSubmitting(false));
  };

  // Load request changes for the agreement
  const loadRequests = () => {
    if (!agreementId) return;
    setIsLoadingRequests(true);
    requestChangesApi.getByAgreement(agreementId)
      .then((res) => {
        const items: any[] = (res as any).data?.requestChanges || (res as any).requestChanges || [];
        const mapped: ChangeRequest[] = items.map((rc) => {
          let status: ChangeRequest['status'];
          if (rc.status === 'priced') status = 'priced';
          else if (rc.status === 'paid') status = 'paid';
          else if (rc.status === 'rejected') status = 'rejected';
          else status = 'pending';

          return {
            id: rc.requestID || rc._id,
            rawId: rc._id,
            title: rc.title,
            description: rc.description,
            status,
            amount: rc.price != null ? String(rc.price) : undefined,
            details: rc.details || undefined,
            createdBy: rc.createdBy || 'client',
            attachedFiles: Array.isArray(rc.files) ? rc.files.map((f: any) => ({ name: f.url?.split('/').pop() || f.ipfsHash || 'file', size: 0, url: f.url })) : undefined,
          } as ChangeRequest;
        });

        // Show all requests in the same table
        setPendingRequests(mapped);
        setConfirmedRequests([]); // Not used anymore
      })
      .catch((err) => {
        showAlert(err?.response?.data?.message || 'Failed to load request changes', 'error');
      })
      .finally(() => setIsLoadingRequests(false));
  };

  useEffect(() => {
    loadRequests();
  }, [agreementId]);

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
                  <Button3Black1
                    text={isSubmitting ? 'Submitting...' : 'Submit Request'}
                    onClick={isSubmitting ? undefined : handleSubmitNewRequest}
                  />
                </div>
              </div>
            )}

            {/* All requests shown in single table */}
            <div className={styles.tableWrap}>
              <h2 className={styles.tableTitle}>Request Changes</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Request Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingRequests ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyState}>
                        Loading requests...
                      </td>
                    </tr>
                  ) : pendingRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyState}>
                        No pending requests
                      </td>
                    </tr>
                  ) : (
                    pendingRequests.map(request => (
                      <tr key={request.id} className={styles.clickableRow}>
                        <td className={styles.titleCell} onClick={() => handleRowClick(request)}>{request.title}</td>
                        <td className={styles.descCell} onClick={() => handleRowClick(request)}>{request.description}</td>
                        <td className={styles.statusCell} onClick={() => handleRowClick(request)}>
                          <span className={styles[`status${request.status}`]}>{request.status}</span>
                        </td>
                        <td className={styles.amountCell} onClick={() => handleRowClick(request)}>{request.amount ? `${request.amount} ETH` : '-'}</td>
                        <td className={styles.actionsCell}>
                          {request.status === 'pending' ? (
                            <>
                              {userRole !== 'client' && (
                                <button
                                  className={styles.confirmBtn}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleConfirmClick(request);
                                  }}
                                >
                                  Accept
                                </button>
                              )}
                              <button
                                className={styles.ignoreBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleIgnore(request.id);
                                }}
                                disabled={updatingId === request.rawId}
                              >
                                {updatingId === request.rawId ? 'Processing...' : (userRole === 'client' ? 'Cancel' : 'Reject')}
                              </button>
                            </>
                          ) : (request.status === 'confirmed' || request.status === 'priced') ? (
                            <>
                              {userRole === 'client' && (
                                <button
                                  className={styles.approveBtn}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClientApprove(request.id);
                                  }}
                                  disabled={paymentProcessingId === request.rawId}
                                >
                                  {paymentProcessingId === request.rawId ? 'Processing...' : 'Pay'}
                                </button>
                              )}
                              <button
                                className={styles.rejectBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClientReject(request.id);
                                }}
                                disabled={updatingId === request.rawId}
                              >
                                {updatingId === request.rawId ? 'Processing...' : (userRole === 'client' ? 'Cancel' : 'Reject')}
                              </button>
                            </>
                          ) : request.status === 'paid' ? (
                            <span className={`${styles.statusBadge} ${styles.statuspaid}`}>Paid ✓</span>
                          ) : request.status === 'rejected' ? (
                            <span className={styles.statusBadge}>Rejected ✗</span>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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

                    {/* Created By removed per UI request */}

                    {/* Attached Files */}
                    {viewingRequest.attachedFiles && viewingRequest.attachedFiles.length > 0 && (
                      <div className={styles.detailSection}>
                        <span className={styles.detailLabel}>Attached Files:</span>
                        <div className={styles.attachedFilesList}>
                          {viewingRequest.attachedFiles.map((file, index) => {
                            const raw = file.name || '';
                            const displayName = raw.length > 36 ? `${raw.slice(0, 20)}...${raw.slice(-12)}` : raw;
                            return (
                              <div key={index} className={styles.attachedFileItem}>
                                <span className={styles.fileIcon}>{getFileIcon(raw)}</span>
                                <span className={styles.attachedFileName} title={raw}>{displayName}</span>
                                <span className={styles.attachedFileSize}>
                                  ({(file.size / 1024).toFixed(2)} KB)
                                </span>
                                <button
                                  className={styles.downloadFileBtn}
                                  onClick={() => handleFileDownload(file)}
                                  aria-label={`Download ${raw}`}
                                >
                                  Download
                                </button>
                              </div>
                            );
                          })}
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
                      text={modalProcessing ? 'Processing...' : 'Confirm'}
                      onClick={modalProcessing ? undefined : handleModalConfirm}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Modal - must be at root level to render properly via portal */}
      <ConfirmModal
        open={showCancelConfirm}
        title="Cancel Change Request"
        message="Are you sure you want to cancel this change request? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="No, Keep"
        loading={deleting}
        onConfirm={confirmCancel}
        onCancel={cancelCancel}
      />
      {/* Reject confirmation modal (for developer or client reject) */}
      <ConfirmModal
        open={showRejectConfirm}
        title="Reject Change Request"
        message="Are you sure you want to reject this change request? This action cannot be undone."
        confirmText="Yes, Reject"
        cancelText="No, Keep"
        loading={updatingId === pendingRejectRawId}
        onConfirm={() => {
          if (!pendingRejectRawId) return;
          setUpdatingId(pendingRejectRawId);
          requestChangesApi.updateStatus(pendingRejectRawId, 'rejected')
            .then(() => {
              showAlert('Request rejected', 'success');
              loadRequests();
            })
            .catch((err) => {
              showAlert(err?.response?.data?.message || 'Failed to reject request', 'error');
            })
            .finally(() => {
              setUpdatingId(null);
              setShowRejectConfirm(false);
              setPendingRejectRawId(null);
              setPendingRejectRequestId(null);
            });
        }}
        onCancel={() => {
          setShowRejectConfirm(false);
          setPendingRejectRawId(null);
          setPendingRejectRequestId(null);
        }}
      />
    </div>
  );
};

export default RequestChange;

