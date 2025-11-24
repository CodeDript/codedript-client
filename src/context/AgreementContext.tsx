import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface Milestone {
  title: string;
  amount: string;
  description?: string;
}

export interface DeveloperProfile {
  id?: string;
  name: string;
  email: string;
  walletAddress: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  rating?: number;
  reviewCount?: number;
}

export interface GigData {
  id: string;
  title: string;
  description: string;
  category?: string;
  deliveryTime?: number;
  developer?: DeveloperProfile;
  packages?: Array<{
    name: string;
    price: number;
    currency: string;
    deliveryTime: number;
    revisions: number;
    features: string[];
  }>;
}

export interface AgreementFormData {
  // Project Details
  projectName: string;
  projectDescription: string;
  
  // Client Information
  clientName: string;
  clientEmail: string;
  clientWallet: string;
  
  // Developer Information
  developerName: string;
  developerEmail: string;
  developerWallet: string;
  developerReceivingAddress: string; // Client-entered receiving address
  
  // Financial Information
  totalValue: string;
  currency: string;
  deadline: string;
  milestones: Milestone[];
  
  // Files & Terms
  filesNote: string;
  uploadedFiles: File[];
  uploadedFilesCids: string[]; // IPFS CIDs for uploaded files
  
  // IPFS / Blockchain
  ipfsHash?: string;
  blockchainTxHash?: string;
  agreementId?: string;
  
  // Gig & Developer Context (fetched data stored here)
  gigId?: string;
  gigData?: GigData;
  developerProfile?: DeveloperProfile;
  
  // Status tracking
  currentStep: number;
  isDraft: boolean;
}

interface AgreementContextType {
  formData: AgreementFormData;
  updateFormData: (data: Partial<AgreementFormData>) => void;
  resetFormData: () => void;
  setCurrentStep: (step: number) => void;
  uploadFile: (file: File) => void;
  removeFile: (index: number) => void;
  setGigData: (gigData: GigData) => void;
  setDeveloperProfile: (profile: DeveloperProfile) => void;
  uploadFilesToIPFS: () => Promise<{ success: boolean; cids: string[]; error?: string }>;
  createAgreement: (uploadedCids?: string[]) => Promise<{ success: boolean; agreementId?: string; error?: string }>
}

// ============================================
// DEFAULT STATE
// ============================================

const DEFAULT_FORM_DATA: AgreementFormData = {
  projectName: '',
  projectDescription: '',
  clientName: '',
  clientEmail: '',
  clientWallet: '',
  developerName: '',
  developerEmail: '',
  developerWallet: '',
  developerReceivingAddress: '',
  totalValue: '',
  currency: 'ETH',
  deadline: '',
  milestones: [],
  filesNote: '',
  uploadedFiles: [],
  uploadedFilesCids: [],
  currentStep: 1,
  isDraft: true,
};

// ============================================
// CONTEXT
// ============================================

const AgreementContext = createContext<AgreementContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface AgreementProviderProps {
  children: ReactNode;
}

export const AgreementProvider: React.FC<AgreementProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<AgreementFormData>(DEFAULT_FORM_DATA);

  const updateFormData = (data: Partial<AgreementFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetFormData = () => {
    setFormData(DEFAULT_FORM_DATA);
  };

  const setCurrentStep = (step: number) => {
    setFormData((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  const uploadFile = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, file],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
    }));
  };

  const setGigData = (gigData: GigData) => {
    setFormData((prev) => ({
      ...prev,
      gigId: gigData.id,
      gigData,
      projectName: gigData.title || prev.projectName,
      projectDescription: gigData.description || prev.projectDescription,
    }));
  };

  const setDeveloperProfile = (profile: DeveloperProfile) => {
    setFormData((prev) => ({
      ...prev,
      developerProfile: profile,
      developerName: profile.name || prev.developerName,
      developerEmail: profile.email || prev.developerEmail,
      developerWallet: profile.walletAddress || prev.developerWallet,
    }));
  };

  const createAgreement = async (uploadedCids?: string[]) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      
      // Use provided CIDs or fall back to context CIDs
      const cidsToUse = uploadedCids || formData.uploadedFilesCids;
      
      console.log('createAgreement called with formData:', formData);
      console.log('Uploaded files CIDs (parameter):', uploadedCids);
      console.log('Uploaded files CIDs (context):', formData.uploadedFilesCids);
      console.log('CIDs to use:', cidsToUse);
      
      // Prepare agreement payload matching backend schema
      const agreementPayload = {
        gigId: formData.gigId,
        clientInfo: {
          name: formData.clientName,
          email: formData.clientEmail,
          walletAddress: formData.clientWallet?.toLowerCase().trim()
        },
        developerInfo: {
          name: formData.developerName,
          email: formData.developerEmail,
          walletAddress: (formData.developerReceivingAddress || formData.developerWallet)?.toLowerCase().trim()
        },
        project: {
          name: formData.projectName,
          description: formData.projectDescription,
          expectedEndDate: formData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          requirements: formData.filesNote || ''
        },
        financials: {
          totalValue: parseFloat(formData.totalValue) || 0,
          currency: formData.currency
        },
        milestones: formData.milestones.length > 0 ? formData.milestones.map((m, index) => ({
          milestoneNumber: index + 1,
          title: m.title || `Milestone ${index + 1}`,
          description: m.description || m.title || `Milestone ${index + 1}`,
          deliverables: [],
          financials: {
            value: parseFloat(m.amount) || 0,
            currency: formData.currency || 'ETH'
          },
          timeline: {
            dueDate: formData.deadline ? new Date(formData.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        })) : [],
        terms: {
          additionalTerms: formData.filesNote || ''
        },
        documents: {
          contractPdf: {
            ipfsHash: cidsToUse.length > 0 ? cidsToUse[0] : undefined,
            url: cidsToUse.length > 0 
              ? `https://copper-near-junglefowl-259.mypinata.cloud/ipfs/${cidsToUse[0]}`
              : undefined,
            uploadedAt: cidsToUse.length > 0 ? new Date() : undefined
          },
          projectFiles: cidsToUse.map((cid, index) => ({
            name: formData.uploadedFiles[index]?.name || `file-${index}`,
            ipfsHash: cid,
            url: `https://copper-near-junglefowl-259.mypinata.cloud/ipfs/${cid}`,
            description: 'Project file uploaded during contract creation',
            uploadedAt: new Date()
          }))
        }
      };
      
      console.log('Sending agreement payload:', agreementPayload);
      console.log('Documents object:', JSON.stringify(agreementPayload.documents, null, 2));
      
      const response = await fetch(`${API_URL}/agreements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agreementPayload)
      });
      
      console.log('Create agreement response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Agreement creation failed:', errorData);
        return { success: false, error: errorData.message || `HTTP ${response.status}` };
      }
      
      const result = await response.json();
      console.log('Agreement created successfully:', result);
      
      // Store agreement ID in context
      const agreementId = result.data?._id || result.data?.agreementId;
      if (agreementId) {
        updateFormData({ agreementId });
      }
      
      return { success: true, agreementId };
    } catch (error) {
      console.error('Error creating agreement:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const uploadFilesToIPFS = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const files = formData.uploadedFiles;
      
      console.log('uploadFilesToIPFS called with files:', files);
      
      if (files.length === 0) {
        console.log('No files to upload');
        return { success: true, cids: [] };
      }

      const cids: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Uploading file ${i + 1}/${files.length}:`, file.name, 'Size:', file.size);
        
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('filename', file.name);

        console.log('Sending request to:', `${API_URL}/upload/ipfs`);

        const response = await fetch(`${API_URL}/upload/ipfs`, {
          method: 'POST',
          body: formDataToSend,
          credentials: 'include',
        });

        console.log('Response status:', response.status, response.statusText);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          console.error('Upload failed:', errorData);
          throw new Error(errorData.message || 'File upload failed');
        }

        const result = await response.json();
        console.log('Upload result:', result);
        
        if (result.success && result.data?.ipfsHash) {
          cids.push(result.data.ipfsHash);
          console.log('File uploaded successfully. CID:', result.data.ipfsHash);
        } else {
          console.warn('Upload response missing ipfsHash:', result);
        }
      }

      console.log('All files uploaded. Total CIDs:', cids);

      // Store CIDs in context
      setFormData((prev) => ({
        ...prev,
        uploadedFilesCids: cids,
      }));

      return { success: true, cids };
    } catch (error: any) {
      console.error('IPFS upload error:', error);
      return { success: false, cids: [], error: error.message };
    }
  };

  return (
    <AgreementContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        setCurrentStep,
        uploadFile,
        removeFile,
        setGigData,
        setDeveloperProfile,
        uploadFilesToIPFS,
        createAgreement,
      }}
    >
      {children}
    </AgreementContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useAgreement = (): AgreementContextType => {
  const context = useContext(AgreementContext);
  if (!context) {
    throw new Error('useAgreement must be used within an AgreementProvider');
  }
  return context;
};
