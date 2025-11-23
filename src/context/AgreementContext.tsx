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
  
  // Financial Information
  totalValue: string;
  currency: string;
  deadline: string;
  milestones: Milestone[];
  
  // Files & Terms
  filesNote: string;
  uploadedFiles: File[];
  
  // IPFS / Blockchain
  ipfsHash?: string;
  blockchainTxHash?: string;
  agreementId?: string;
  
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
  totalValue: '',
  currency: 'ETH',
  deadline: '',
  milestones: [],
  filesNote: '',
  uploadedFiles: [],
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

  return (
    <AgreementContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        setCurrentStep,
        uploadFile,
        removeFile,
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
