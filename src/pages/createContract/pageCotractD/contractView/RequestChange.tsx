import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './RequestChange.module.css';
import authStyles from '../../../../components/auth/AuthForm.module.css';
import heroOutlineup from '../../../../assets/Login/cardBackgroundup.svg';
import heroOutlinedown from '../../../../assets/Login/cardBackgrounddown.svg';
import Button2 from '../../../../components/button/Button2/Button2';
import Button3Black1 from '../../../../components/button/Button3Black1/Button3Black1';
import { ChangeRequestService, type ChangeRequest as ApiChangeRequest, type AttachedFile } from '../../../../api/changeRequestService';
import { useAuth } from '../../../../context/AuthContext';
import { requestChange } from '../../../../services/ContractService';

type ChangeRequest = ApiChangeRequest;

const RequestChange: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialAgreement = location.state?.agreement;
  const agreementId = initialAgreement?._id;
  const { user } = useAuth();
  const userRole = user?.role || 'client';

  const [agreement, setAgreement] = useState<any>(initialAgreement);
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed'>('pending');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [modalDetails, setModalDetails] = useState('');
  const [modalAmount, setModalAmount] = useState('');
  const [modalCurrency, setModalCurrency] = useState('ETH');

  // New change request form state (client-only)
  const [newRequestTitle, setNewRequestTitle] = useState('');
  const [newRequestDescription, setNewRequestDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // View details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<ChangeRequest | null>(null);

  // Data from backend
  const [pendingRequests, setPendingRequests] = useState<ChangeRequest[]>([]);
  const [confirmedRequests, setConfirmedRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch change requests on mount
  useEffect(() => {
    if (!agreementId) {
      setError('No agreement found. Please navigate from the contract view.');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('Please log in to view change requests.');
      setLoading(false);
      // Redirect to login after 2 seconds
      const timer = setTimeout(() => {
        navigate('/login', { state: { from: location.pathname } });
      }, 2000);
      return () => clearTimeout(timer);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch updated agreement data to get blockchain.agreementId
        const { AgreementService } = await import('../../../../api/agreementService');
        const agreementResponse = await AgreementService.getAgreementById(agreementId);
        if (agreementResponse.success && agreementResponse.data) {
          let updatedAgreement = agreementResponse.data;
          const blockchainData = (updatedAgreement as any).blockchain;
          
          // If blockchain transaction exists but no agreementId, extract it
          if (blockchainData?.transactionHash && !blockchainData?.agreementId) {
            console.log('⚠️ Blockchain ID missing. Extracting from transaction:', blockchainData.transactionHash);
            try {
              const ContractService = await import('../../../../services/ContractService') as any;
              const extractedId = await ContractService.getAgreementIdFromTransaction(blockchainData.transactionHash);
              console.log('✅ Extracted blockchain agreement ID:', extractedId);
              
              // Save it to backend
              await AgreementService.extractBlockchainId(agreementId, extractedId);
              console.log('✅ Saved blockchain agreement ID to database');
              
              // Update local agreement object
              (updatedAgreement as any).blockchain.agreementId = extractedId;
            } catch (extractError) {
              console.error('❌ Failed to extract blockchain ID:', extractError);
            }
          }
          
          setAgreement(updatedAgreement);
          console.log('✅ Agreement loaded with blockchain ID:', (updatedAgreement as any).blockchain?.agreementId);
        }

        // Fetch change requests
        const response = await ChangeRequestService.getChangeRequestsByAgreement(agreementId);
        
        if (response.success) {
          const pending = response.data.filter(req => req.status === 'pending');
          const confirmed = response.data.filter(req => req.status === 'confirmed');
          setPendingRequests(pending);
          setConfirmedRequests(confirmed);
        }
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        if (err.message.includes('Authentication') || err.message.includes('log in')) {
          setError('Session expired. Redirecting to login...');
          setTimeout(() => {
            navigate('/login', { state: { from: location.pathname } });
          }, 2000);
        } else {
          setError(err.message || 'Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agreementId, user, navigate, location.pathname]);

  const handleConfirmClick = (request: ChangeRequest) => {
    setSelectedRequest(request);
    setModalDetails('');
    setModalAmount('');
    setShowModal(true);
  };

  const handleIgnore = async (requestId: string) => {
    try {
      await ChangeRequestService.ignoreChangeRequest(requestId);
      setPendingRequests(prev => prev.filter(req => req._id !== requestId));
      alert('Change request ignored');
    } catch (err: any) {
      console.error('Failed to ignore request:', err);
      alert(err.message || 'Failed to ignore request');
    }
  };

  const handleModalConfirm = async () => {
    if (!selectedRequest || !modalAmount) {
      alert('Please enter an amount');
      return;
    }

    try {
      const amount = parseFloat(modalAmount);
      const response = await ChangeRequestService.confirmChangeRequest(
        selectedRequest._id,
        amount,
        modalCurrency,
        modalDetails
      );

      if (response.success) {
        setConfirmedRequests(prev => [...prev, response.data]);
        setPendingRequests(prev => prev.filter(req => req._id !== selectedRequest._id));
        setShowModal(false);
        setSelectedRequest(null);
        alert('Change request confirmed successfully');
      }
    } catch (err: any) {
      console.error('Failed to confirm request:', err);
      alert(err.message || 'Failed to confirm request');
    }
  };

  const handleClientApprove = async (requestId: string) => {
    const request = confirmedRequests.find(req => req._id === requestId);
    if (!request) return;

    const amount = request.confirmation?.amount || 0;
    const currency = request.confirmation?.currency || 'ETH';
    const blockchainId = agreement?.blockchain?.agreementId;

    console.log('🔍 Agreement blockchain data:', {
      hasBlockchain: !!agreement?.blockchain,
      agreementId: blockchainId,
      transactionHash: agreement?.blockchain?.transactionHash,
      fullBlockchainObject: agreement?.blockchain
    });

    // Check if we should process on blockchain
    const shouldUseBlockchain = blockchainId && currency === 'ETH';

    if (!shouldUseBlockchain && currency === 'ETH') {
      console.warn('⚠️ No blockchain ID found. Agreement blockchain data:', agreement?.blockchain);
      const proceedOffChain = window.confirm(
        'This agreement was not created on the blockchain. The change request will be processed off-chain only. Do you want to continue?'
      );
      if (!proceedOffChain) return;
    }

    if (currency !== 'ETH' && blockchainId) {
      alert('Currently only ETH payments are supported for blockchain transactions. This will be processed off-chain.');
    }

    try {
      let txHash = undefined;

      // Step 1: Call smart contract if blockchain ID exists and currency is ETH
      if (shouldUseBlockchain) {
        const changeDescription = `${request.title}: ${request.description}`;
        const amountEth = amount.toString();

        console.log('Calling smart contract requestChange:', {
          blockchainId,
          changeDescription,
          amountEth
        });

        const txResult = await requestChange(blockchainId, changeDescription, amountEth);
        console.log('Blockchain transaction successful:', txResult);
        txHash = txResult.transactionHash;
      }

      // Step 2: Update backend to mark as approved
      const response = await ChangeRequestService.approveChangeRequest(
        requestId,
        undefined,
        txHash
      );
      
      if (response.success) {
        setConfirmedRequests(prev =>
          prev.map(req =>
            req._id === requestId ? response.data.changeRequest : req
          )
        );
        
        if (txHash) {
          alert(`Request approved! Contract price updated by ${amount} ${currency}.\nBlockchain transaction: ${txHash}`);
        } else {
          alert(`Request approved! Contract price updated by ${amount} ${currency}.\n(Off-chain only)`);
        }
      }
    } catch (err: any) {
      console.error('Failed to approve request:', err);
      if (err.message?.includes('user rejected')) {
        alert('Transaction cancelled by user');
      } else if (err.message?.includes('insufficient funds')) {
        alert('Insufficient funds to complete the transaction');
      } else {
        alert(err.message || 'Failed to approve request');
      }
    }
  };

  const handleClientReject = async (requestId: string) => {
    try {
      const response = await ChangeRequestService.rejectChangeRequest(requestId);
      
      if (response.success) {
        setConfirmedRequests(prev =>
          prev.map(req =>
            req._id === requestId ? response.data : req
          )
        );
        alert('Change request rejected');
      }
    } catch (err: any) {
      console.error('Failed to reject request:', err);
      alert(err.message || 'Failed to reject request');
    }
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

  const handleSubmitNewRequest = async () => {
    if (!newRequestTitle.trim() || !newRequestDescription.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    if (!agreementId) {
      alert('No agreement found');
      return;
    }

    try {
      setUploadingFiles(true);

      // Upload files to IPFS first
      const uploadedFiles: AttachedFile[] = [];
      for (const file of attachedFiles) {
        const response = await ChangeRequestService.uploadFileToIPFS(file);
        if (response.success) {
          uploadedFiles.push(response.data);
        }
      }

      console.log('Uploaded files:', uploadedFiles);
      console.log('Creating change request with:', {
        agreementId,
        title: newRequestTitle,
        description: newRequestDescription,
        attachedFiles: uploadedFiles
      });

      // Create change request with IPFS hashes
      const response = await ChangeRequestService.createChangeRequest(
        agreementId,
        newRequestTitle,
        newRequestDescription,
        uploadedFiles // Always pass the array, even if empty
      );

      if (response.success) {
        setPendingRequests(prev => [...prev, response.data]);
        setNewRequestTitle('');
        setNewRequestDescription('');
        setAttachedFiles([]);
        alert('Change request submitted successfully!');
      }
    } catch (err: any) {
      console.error('Failed to submit request:', err);
      alert(err.message || 'Failed to submit request');
    } finally {
      setUploadingFiles(false);
    }
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

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingState}>Loading change requests...</div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorState}>
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>

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
                text={uploadingFiles ? "Uploading..." : "Submit Request"} 
                onClick={handleSubmitNewRequest} 
              />
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
                    <tr key={request._id} className={styles.clickableRow}>
                      <td className={styles.idCell} onClick={() => handleRowClick(request)}>{request.requestId}</td>
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
                            handleIgnore(request._id);
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
                    <tr key={request._id} className={styles.clickableRow}>
                      <td className={styles.idCell} onClick={() => handleRowClick(request)}>{request.requestId}</td>
                      <td className={styles.titleCell} onClick={() => handleRowClick(request)}>{request.title}</td>
                      <td className={styles.descCell} onClick={() => handleRowClick(request)}>{request.confirmation?.details || request.description}</td>
                      <td className={styles.amountCell} onClick={() => handleRowClick(request)}>{request.confirmation?.amount} {request.confirmation?.currency || 'ETH'}</td>
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
                                handleClientApprove(request._id);
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className={styles.rejectBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClientReject(request._id);
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
                <span className={styles.detailValue}>{viewingRequest.requestId}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Title:</span>
                <span className={styles.detailValue}>{viewingRequest.title}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Description:</span>
                <span className={styles.detailValue}>{viewingRequest.description}</span>
              </div>

              {viewingRequest.confirmation?.details && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Additional Details:</span>
                  <span className={styles.detailValue}>{viewingRequest.confirmation.details}</span>
                </div>
              )}

              {viewingRequest.confirmation?.amount && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Amount:</span>
                  <span className={styles.detailValue}>{viewingRequest.confirmation.amount} {viewingRequest.confirmation.currency}</span>
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
                <span className={styles.detailValue}>
                  {viewingRequest.createdBy.role === 'client' ? 'Client' : 'Developer'}
                  {viewingRequest.createdBy.user.profile?.name && ` (${viewingRequest.createdBy.user.profile.name})`}
                </span>
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
              <div className={styles.modalValue}>{selectedRequest.requestId}</div>
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
                Amount of Change Request:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  id="modalAmount"
                  type="number"
                  step="0.01"
                  className={styles.modalInput}
                  placeholder="Enter amount"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  style={{ flex: 1 }}
                />
                <select
                  className={styles.modalInput}
                  value={modalCurrency}
                  onChange={(e) => setModalCurrency(e.target.value)}
                  style={{ width: '100px' }}
                >
                  <option value="ETH">ETH</option>
                  <option value="USD">USD</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
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
          </>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestChange;
