/**
 * Agreement Creation Service
 * 
 * Handles the complete flow of creating an agreement:
 * 1. Upload files to IPFS (Pinata)
 * 2. Create agreement on blockchain (via ContractService)
 * 3. Save agreement data to backend database
 */

import type { AgreementFormData } from '../context/AgreementContext';

// @ts-ignore - ContractService is a JS file
import { createAgreement as createBlockchainAgreement } from './ContractService';

// ============================================
// TYPES
// ============================================

interface UploadFileResponse {
  success: boolean;
  ipfsHash: string;
  cid: string;
  url: string;
  name: string;
  size: number;
}

interface CreateAgreementResponse {
  success: boolean;
  agreementId?: string;
  blockchainTxHash?: string;
  ipfsHash?: string;
  offchainAgreement?: any;
  error?: string;
}

// ============================================
// CONFIGURATION
// ============================================

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// ============================================
// FILE UPLOAD TO IPFS (via Backend Pinata Service)
// ============================================

/**
 * Upload a file to IPFS using the backend Pinata service
 * @param file - File to upload
 * @returns Upload response with IPFS hash and URL
 */
export async function uploadFileToIPFS(file: File): Promise<UploadFileResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    const response = await fetch(`${BACKEND_URL}/upload/ipfs`, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Include auth cookies if needed
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || 'Failed to upload file to IPFS');
    }

    const data = await response.json();
    
    return {
      success: true,
      ipfsHash: data.ipfsHash || data.cid,
      cid: data.cid || data.ipfsHash,
      url: data.url,
      name: file.name,
      size: file.size,
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
}

/**
 * Upload multiple files to IPFS
 * @param files - Array of files to upload
 * @returns Array of upload responses
 */
export async function uploadMultipleFilesToIPFS(files: File[]): Promise<UploadFileResponse[]> {
  const uploadPromises = files.map(file => uploadFileToIPFS(file));
  return await Promise.all(uploadPromises);
}

// ============================================
// CREATE AGREEMENT (FULL FLOW)
// ============================================

/**
 * Create agreement with complete flow:
 * 1. Upload files to IPFS
 * 2. Create on blockchain
 * 3. Save to database
 * 
 * @param formData - Agreement form data from context
 * @returns Creation response with IDs and transaction hashes
 */
export async function createAgreementComplete(
  formData: AgreementFormData
): Promise<CreateAgreementResponse> {
  try {
    console.log('Starting agreement creation process...', formData);

    // ============================================
    // STEP 1: Upload files to IPFS
    // ============================================
    let ipfsHash = '';
    const uploadedFilesData: UploadFileResponse[] = [];

    if (formData.uploadedFiles && formData.uploadedFiles.length > 0) {
      console.log(`Uploading ${formData.uploadedFiles.length} files to IPFS...`);
      
      const uploadResults = await uploadMultipleFilesToIPFS(formData.uploadedFiles);
      uploadedFilesData.push(...uploadResults);
      
      // Use the first file's CID as the main document CID
      ipfsHash = uploadResults[0].ipfsHash;
      console.log('Files uploaded successfully. Main CID:', ipfsHash);
    } else {
      // If no files, create a JSON metadata document
      console.log('No files uploaded, creating metadata document...');
      const metadataJson = {
        projectName: formData.projectName,
        projectDescription: formData.projectDescription,
        createdAt: new Date().toISOString(),
      };
      
      const metadataBlob = new Blob([JSON.stringify(metadataJson, null, 2)], {
        type: 'application/json',
      });
      const metadataFile = new File([metadataBlob], 'agreement-metadata.json', {
        type: 'application/json',
      });
      
      const metadataUpload = await uploadFileToIPFS(metadataFile);
      ipfsHash = metadataUpload.ipfsHash;
      uploadedFilesData.push(metadataUpload);
      console.log('Metadata uploaded. CID:', ipfsHash);
    }

    // ============================================
    // STEP 2: Create agreement on blockchain
    // Normalize and validate wallet addresses before calling the blockchain
    // ============================================
    console.log('Creating agreement on blockchain...');

    const normalizeAddress = (addr?: string) => {
      if (!addr) return '';
      let a = addr.trim();
      // allow addresses without prefix
      if (a.startsWith('0X')) a = '0x' + a.slice(2);
      if (!a.startsWith('0x')) a = '0x' + a;
      a = a.toLowerCase();
      if (!/^0x[a-f0-9]{40}$/.test(a)) {
        throw new Error(`Invalid wallet address: ${addr}`);
      }
      return a;
    };

    let developerWalletAddr = '';
    let clientWalletAddr = '';

    try {
      developerWalletAddr = normalizeAddress(formData.developerWallet);
    } catch (err: any) {
      throw new Error(`Developer wallet is invalid: ${err?.message || String(err)}`);
    }

    try {
      clientWalletAddr = normalizeAddress(formData.clientWallet);
    } catch (err: any) {
      // Client wallet is optional in some flows; surface a clear error
      throw new Error(`Client wallet is invalid: ${err?.message || String(err)}`);
    }

    // Set startDate to current time + 5 minutes buffer to avoid contract revert
    // (contract requires: _startDate >= block.timestamp)
    // 5-minute buffer accounts for MetaMask confirmation time and transaction mining
    const startDate = Math.floor(Date.now() / 1000) + 300; // Current + 5 min buffer
    const endDate = formData.deadline 
      ? Math.floor(new Date(formData.deadline).getTime() / 1000)
      : Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000); // Default 30 days

    console.log('Blockchain params:', {
      developer: developerWalletAddr,
      projectName: formData.projectName,
      docCid: ipfsHash,
      totalValue: formData.totalValue,
      startDate,
      endDate,
      currentTime: Math.floor(Date.now() / 1000)
    });

    const blockchainTx = await createBlockchainAgreement(
      developerWalletAddr,
      formData.projectName,
      ipfsHash,
      formData.totalValue,
      startDate,
      endDate
    );

    console.log('Blockchain transaction submitted:', blockchainTx);
    
    // Wait for transaction confirmation
    if (!blockchainTx.transactionHash) {
      throw new Error('Transaction hash not found in response');
    }
    
    const blockchainTxHash = blockchainTx.transactionHash;
    console.log('Transaction hash:', blockchainTxHash);
    
    // Check if transaction was successful (thirdweb returns receipt in some cases)
    if (blockchainTx.status === 0 || blockchainTx.status === 'reverted') {
      throw new Error(`Transaction reverted. Hash: ${blockchainTxHash}`);
    }

    // ============================================
    // STEP 3: Save agreement to backend database
    // ============================================
    console.log('Saving agreement to database...');

    const agreementPayload = {
      clientInfo: {
        name: formData.clientName,
        email: formData.clientEmail,
        walletAddress: clientWalletAddr || formData.clientWallet,
      },
      developerInfo: {
        name: formData.developerName,
        email: formData.developerEmail,
        walletAddress: developerWalletAddr || formData.developerWallet,
      },
      project: {
        name: formData.projectName,
        description: formData.projectDescription,
        requirements: formData.filesNote || '',
        expectedEndDate: formData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      financials: {
        totalValue: parseFloat(formData.totalValue) || 0,
        currency: formData.currency || 'ETH',
      },
      documents: {
        contractPdf: {
          ipfsHash: ipfsHash,
          url: uploadedFilesData[0]?.url,
        },
        projectFiles: uploadedFilesData.map(file => ({
          name: file.name,
          ipfsHash: file.ipfsHash,
          url: file.url,
        })),
      },
      blockchain: {
        transactionHash: blockchainTxHash,
        ipfsHash: ipfsHash,
        isRecorded: true,
        network: 'sepolia',
      },
      status: 'pending_signatures',
      milestones: formData.milestones.map((m, index) => ({
        title: m.title,
        description: m.description || '',
        value: parseFloat(m.amount) || 0,
        order: index + 1,
      })),
    };

    // Attach Authorization header when a token exists in localStorage (if using JWT auth)
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const dbResponse = await fetch(`${BACKEND_URL}/agreements`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(agreementPayload),
    });

    if (!dbResponse.ok) {
      const errorData = await dbResponse.json().catch(() => ({ message: 'Database save failed' }));
      console.error('Database save error:', errorData);
      console.error('Response status:', dbResponse.status);
      console.error('Response statusText:', dbResponse.statusText);
      // Don't throw - blockchain tx already succeeded
      console.warn('⚠️ Agreement created on blockchain but database save failed');
      console.warn('Transaction hash:', blockchainTxHash);
      console.warn('IPFS hash:', ipfsHash);
      
      // Return partial success - blockchain succeeded but DB failed
      return {
        success: true,
        blockchainTxHash,
        ipfsHash,
        error: 'Agreement created on blockchain but failed to save to database. Transaction hash: ' + blockchainTxHash,
      };
    }

    const dbData = await dbResponse.json();
    console.log('✅ Agreement saved to database successfully:', dbData);

    return {
      success: true,
      agreementId: dbData.data?.agreementId || dbData.data?._id,
      blockchainTxHash,
      ipfsHash,
      offchainAgreement: dbData.data,
    };

  } catch (error: any) {
    console.error('Agreement creation error:', error);
    
    // Provide detailed error message
    let errorMessage = 'Failed to create agreement';
    
    if (error.message) {
      errorMessage = error.message;
      
      // Parse common contract errors
      if (error.message.includes('Start date must be in the future')) {
        errorMessage = 'Start date validation failed. Please try again.';
      } else if (error.message.includes('Must send exact total value')) {
        errorMessage = 'ETH amount mismatch. Check your wallet balance and try again.';
      } else if (error.message.includes('Client and developer must be different')) {
        errorMessage = 'Client and developer addresses cannot be the same.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was rejected in MetaMask.';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH balance to complete transaction.';
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ============================================
// RETRIEVE AGREEMENT
// ============================================

/**
 * Fetch agreement by ID from backend
 * @param agreementId - Agreement ID
 */
export async function getAgreementById(agreementId: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/agreements/${agreementId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agreement');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Fetch agreement error:', error);
    throw error;
  }
}

/**
 * Fetch all agreements for current user
 */
export async function getAllAgreements() {
  try {
    const response = await fetch(`${BACKEND_URL}/agreements`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agreements');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Fetch agreements error:', error);
    throw error;
  }
}
