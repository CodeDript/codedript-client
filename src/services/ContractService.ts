import * as JSService from './ContractService.js';

export interface TxResult {
  transactionHash: string;
  blockHash?: string;
  to?: string;
  [key: string]: any;
}

export interface TxDetails {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  blockNumber: string;
  timestamp: string;
  status: string;
  input: string;
  decodedInput: any;
  [key: string]: any;
}

// Typed wrappers over the JS implementation to satisfy TypeScript
export async function createAgreement(
  developer: string,
  projectName: string,
  docCid: string,
  totalValueEth: string | number,
  startDate: number,
  endDate: number
): Promise<TxResult> {
  // @ts-ignore - JS implementation
  return await JSService.createAgreement(developer, projectName, docCid, totalValueEth, startDate, endDate);
}

export async function getTransactionDetails(txHash: string): Promise<TxDetails> {
  // @ts-ignore
  return await JSService.getTransactionDetails(txHash);
}

export async function depositEscrow(id: number | string, amountEth: string | number): Promise<any> {
  // @ts-ignore
  return await JSService.depositEscrow(id, amountEth);
}

export async function requestChange(id: number | string, requestedChange: string, additionalCostEth: string | number): Promise<any> {
  // @ts-ignore
  return await JSService.requestChange(id, requestedChange, additionalCostEth);
}

export async function completeAgreement(id: number | string): Promise<any> {
  // @ts-ignore
  return await JSService.completeAgreement(id);
}

export async function getAgreementSummary(id: number | string): Promise<any> {
  // @ts-ignore
  return await JSService.getAgreementSummary(id);
}

export async function getChangeRequest(agreementId: number | string, changeIndex: number | string): Promise<any> {
  // @ts-ignore
  return await JSService.getChangeRequest(agreementId, changeIndex);
}

export async function getNextId(): Promise<number> {
  // @ts-ignore
  return await JSService.getNextId();
}

// Expose wallet connect from JS implementation for TypeScript consumers
export async function connectWallet(): Promise<any> {
  // @ts-ignore
  return await JSService.connectWallet();
}
