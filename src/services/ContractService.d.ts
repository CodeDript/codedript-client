// Type declarations for ContractService.js

export interface Account {
  address: string;
  [key: string]: any;
}

export function connectWallet(): Promise<Account>;
export function createAgreement(
  developer: string,
  projectName: string,
  docCid: string,
  totalValueEth: string,
  startDate: number,
  endDate: number
): Promise<any>;
export function depositEscrow(id: number, amountEth: string): Promise<any>;
export function requestChange(id: number, requestedChange: string, additionalCostEth: string): Promise<any>;
export function completeAgreement(id: number): Promise<any>;
export function getAgreementSummary(id: number): Promise<{
  client: string;
  developer: string;
  projectName: string;
  docCid: string;
  totalValue: string;
  escrowBalance: string;
  startDate: number;
  endDate: number;
  status: number;
  changeCount: number;
}>;
export function getChangeRequest(agreementId: number, changeIndex: number): Promise<{
  agreementId: number;
  developer: string;
  client: string;
  projectName: string;
  requestedChange: string;
  additionalCost: string;
  timestamp: number;
}>;
export function getNextId(): Promise<number>;
export function getTransactionDetails(transactionHash: string): Promise<any>;

export const CONTRACT_ADDRESS: string;
export const ABI: any[];
