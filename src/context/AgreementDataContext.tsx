import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Milestone {
  title: string;
  amount?: string;
}

interface AgreementData {
  // Project Details (Step 1)
  title: string;
  description: string;
  
  // Parties (Step 2)
  clientName: string;
  clientEmail: string;
  clientWallet: string;
  developerWallet: string;
  
  // Files & Terms (Step 3)
  uploadedFiles: File[];
  filesNote: string;
  
  // Payment (Step 4)
  value: string;
  currency: string;
  deadline: string;
  milestones: Milestone[];
  
  // Additional
  gigId?: string;
  developerReceivingAddress?: string;
}

interface AgreementDataContextType {
  agreementData: AgreementData;
  setProjectDetails: (title: string, description: string) => void;
  setPartiesDetails: (clientName: string, clientEmail: string, clientWallet: string, developerWallet: string) => void;
  setFilesAndTerms: (files: File[], note: string) => void;
  setPaymentDetails: (value: string, currency: string, deadline: string, milestones: Milestone[]) => void;
  setGigId: (gigId: string) => void;
  setDeveloperReceivingAddress: (address: string) => void;
  resetAgreementData: () => void;
}

const initialAgreementData: AgreementData = {
  title: '',
  description: '',
  clientName: '',
  clientEmail: '',
  clientWallet: '',
  developerWallet: '',
  uploadedFiles: [],
  filesNote: '',
  value: '',
  currency: 'ETH',
  deadline: '',
  milestones: [],
  gigId: undefined,
  developerReceivingAddress: '',
};

const AgreementDataContext = createContext<AgreementDataContextType | undefined>(undefined);

export const AgreementDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agreementData, setAgreementData] = useState<AgreementData>(initialAgreementData);

  const setProjectDetails = (title: string, description: string) => {
    setAgreementData((prev) => ({ ...prev, title, description }));
  };

  const setPartiesDetails = (clientName: string, clientEmail: string, clientWallet: string, developerWallet: string) => {
    setAgreementData((prev) => ({ ...prev, clientName, clientEmail, clientWallet, developerWallet }));
  };

  const setFilesAndTerms = (files: File[], note: string) => {
    setAgreementData((prev) => ({ ...prev, uploadedFiles: files, filesNote: note }));
  };

  const setPaymentDetails = (value: string, currency: string, deadline: string, milestones: Milestone[]) => {
    setAgreementData((prev) => ({ ...prev, value, currency, deadline, milestones }));
  };

  const setGigId = (gigId: string) => {
    setAgreementData((prev) => ({ ...prev, gigId }));
  };

  const setDeveloperReceivingAddress = (address: string) => {
    setAgreementData((prev) => ({ ...prev, developerReceivingAddress: address }));
  };

  const resetAgreementData = () => {
    setAgreementData(initialAgreementData);
  };

  return (
    <AgreementDataContext.Provider
      value={{
        agreementData,
        setProjectDetails,
        setPartiesDetails,
        setFilesAndTerms,
        setPaymentDetails,
        setGigId,
        setDeveloperReceivingAddress,
        resetAgreementData,
      }}
    >
      {children}
    </AgreementDataContext.Provider>
  );
};

export const useAgreementData = () => {
  const context = useContext(AgreementDataContext);
  if (!context) {
    throw new Error('useAgreementData must be used within an AgreementDataProvider');
  }
  return context;
};

export type { Milestone, AgreementData };
