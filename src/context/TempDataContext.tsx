import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Package {
  name: 'basic' | 'standard' | 'premium';
  price: number;
  deliveryTime: number;
  features: string[];
  description: string;
}

interface TempGigData {
  title: string;
  description: string;
  packages: Package[];
  files: File[];
  filesNote: string;
}

interface TempDataContextType {
  gigData: TempGigData;
  setGigTitle: (title: string) => void;
  setGigDescription: (description: string) => void;
  setGigPackages: (packages: Package[]) => void;
  setGigFiles: (files: File[]) => void;
  setGigFilesNote: (note: string) => void;
  resetGigData: () => void;
}

const initialGigData: TempGigData = {
  title: '',
  description: '',
  packages: [],
  files: [],
  filesNote: '',
};

const TempDataContext = createContext<TempDataContextType | undefined>(undefined);

export const TempDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gigData, setGigData] = useState<TempGigData>(initialGigData);

  const setGigTitle = (title: string) => {
    setGigData((prev) => ({ ...prev, title }));
  };

  const setGigDescription = (description: string) => {
    setGigData((prev) => ({ ...prev, description }));
  };

  const setGigPackages = (packages: Package[]) => {
    setGigData((prev) => ({ ...prev, packages }));
  };

  const setGigFiles = (files: File[]) => {
    setGigData((prev) => ({ ...prev, files }));
  };

  const setGigFilesNote = (note: string) => {
    setGigData((prev) => ({ ...prev, filesNote: note }));
  };

  const resetGigData = () => {
    setGigData(initialGigData);
  };

  return (
    <TempDataContext.Provider
      value={{
        gigData,
        setGigTitle,
        setGigDescription,
        setGigPackages,
        setGigFiles,
        setGigFilesNote,
        resetGigData,
      }}
    >
      {children}
    </TempDataContext.Provider>
  );
};

export const useTempData = () => {
  const context = useContext(TempDataContext);
  if (!context) {
    throw new Error('useTempData must be used within a TempDataProvider');
  }
  return context;
};

export type { Package, TempGigData };
