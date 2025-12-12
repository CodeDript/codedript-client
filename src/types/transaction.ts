/**
 * Transaction type definitions aligned with server Transaction model
 */

export interface Transaction {
  _id: string;
  transactionID: string;
  type: "creation" | "modification" | "completion";
  agreement: string;
  price: number;
  network: "mainnet" | "sepolia" | "goerli" | "polygon" | "mumbai";
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  contractAddress: string;
  from: string;
  to: string;
  transactionFee: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTransactionRequest {
  type: "creation" | "modification" | "completion";
  agreement: string;
  price: number;
  network: "mainnet" | "sepolia" | "goerli" | "polygon" | "mumbai";
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  contractAddress: string;
  from: string;
  to: string;
  transactionFee: string;
  timestamp: string;
}
