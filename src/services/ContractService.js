// ContractService.js
// Service layer for blockchain contract interactions
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import {
  sendTransaction,
  prepareContractCall,
  readContract,
  getRpcClient,
  eth_getTransactionByHash,
  eth_getTransactionReceipt,
  eth_getBlockByNumber,
} from "thirdweb";

// ============================================
// CONFIGURATION
// ============================================

// Lazily initialize Thirdweb client to avoid errors when env var is missing
let client = null;
try {
  if (import.meta.env.VITE_THIRDWEB_CLIENT_ID) {
    client = createThirdwebClient({
      clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
    });
  }
} catch (e) {
  console.warn('Thirdweb client initialization failed:', e);
  client = null;
}

const wallet = createWallet("io.metamask");

export const CONTRACT_ADDRESS = import.meta.env.VITE_AGREEMENT_CONTRACT;

// ============================================
// CONTRACT ABI
// ============================================
export const ABI = [
  {
    name: "createAgreement",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "_developer", type: "address" },
      { name: "_projectName", type: "string" },
      { name: "_docCid", type: "string" },
      { name: "_totalValue", type: "uint256" },
      { name: "_startDate", type: "uint256" },
      { name: "_endDate", type: "uint256" }
    ],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "depositEscrow",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "_id", type: "uint256" }],
    outputs: []
  },
  {
    name: "requestChange",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "_id", type: "uint256" },
      { name: "_requestedChange", type: "string" },
      { name: "_additionalCost", type: "uint256" }
    ],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "completeAgreement",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_id", type: "uint256" }],
    outputs: []
  },
  {
    name: "getAgreementSummary",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_id", type: "uint256" }],
    outputs: [
      { name: "client", type: "address" },
      { name: "developer", type: "address" },
      { name: "projectName", type: "string" },
      { name: "docCid", type: "string" },
      { name: "totalValue", type: "uint256" },
      { name: "escrowBalance", type: "uint256" },
      { name: "startDate", type: "uint256" },
      { name: "endDate", type: "uint256" },
      { name: "status", type: "uint8" },
      { name: "changeCount", type: "uint256" }
    ]
  },
  {
    name: "getChangeRequest",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "_id", type: "uint256" },
      { name: "index", type: "uint256" }
    ],
    outputs: [
      { name: "agreementId", type: "uint256" },
      { name: "developer", type: "address" },
      { name: "client", type: "address" },
      { name: "projectName", type: "string" },
      { name: "requestedChange", type: "string" },
      { name: "additionalCost", type: "uint256" },
      { name: "timestamp", type: "uint256" }
    ]
  },
  {
    name: "nextId",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get contract instance
 * @private
 */
function getContractInstance() {
  if (!CONTRACT_ADDRESS) {
    throw new Error('CONTRACT_ADDRESS is not set. Please add VITE_AGREEMENT_CONTRACT to your .env');
  }

  return getContract({
    client,
    chain: sepolia,
    address: CONTRACT_ADDRESS,
    abi: ABI,
  });
}

/**
 * Generic function to write to contract
 * @private
 */
async function writeToContract(functionName, args, valueEth = "0") {
  const account = await wallet.connect({ client });
  const contract = getContractInstance();

  const transaction = await prepareContractCall({
    contract,
    method: functionName,
    params: args,
    value: BigInt(Math.floor(parseFloat(valueEth) * 1e18)),
  });

  return await sendTransaction({ account, transaction });
}

// ============================================
// WALLET OPERATIONS
// ============================================

/**
 * Connect wallet - always show MetaMask account selector
 */
export async function connectWallet() {
  // Ensure MetaMask is available
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  // Request permissions first — if user rejects, stop and surface a clear error
  try {
    await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
  } catch (err) {
    // User cancelled or denied the permission request. Do not continue to wallet.connect()
    throw new Error('MetaMask permission request was cancelled');
  }

  // Disconnect existing wallet session if present (safe-guard)
  try {
    const existing = typeof wallet.getAccount === 'function' ? await wallet.getAccount() : null;
    if (existing) {
      await wallet.disconnect();
    }
  } catch (e) {
    // ignore disconnect errors
  }

  // Connect to MetaMask (this will open the MetaMask connect popup if needed)
  if (!client) {
    throw new Error('Thirdweb client not initialized. Please configure VITE_THIRDWEB_CLIENT_ID');
  }
  const account = await wallet.connect({ client });
  return account;
}

// ============================================
// AGREEMENT WRITE OPERATIONS
// ============================================

/**
 * Create agreement with full details and automatic escrow deposit
 * @param {string} developer - Developer wallet address
 * @param {string} projectName - Name of the project
 * @param {string} docCid - IPFS CID of agreement document
 * @param {string} totalValueEth - Total value in ETH (will be deposited as escrow)
 * @param {number} startDate - Unix timestamp for start date
 * @param {number} endDate - Unix timestamp for end date
 * @returns {Promise<{transactionHash: string, agreementId: number}>} Transaction result with agreement ID
 */
export async function createAgreement(developer, projectName, docCid, totalValueEth, startDate, endDate) {
  const totalValueWei = BigInt(Math.floor(parseFloat(totalValueEth) * 1e18));
  const account = await wallet.connect({ client });
  const contract = getContractInstance();

  const transaction = await prepareContractCall({
    contract,
    method: "function createAgreement(address _developer, string _projectName, string _docCid, uint256 _totalValue, uint256 _startDate, uint256 _endDate) payable returns (uint256)",
    params: [developer, projectName, docCid, totalValueWei, BigInt(startDate), BigInt(endDate)],
    value: totalValueWei,
  });

  const txResult = await sendTransaction({ account, transaction });
  
  // Wait for transaction to be mined and extract the returned agreement ID
  let agreementId = null;
  let retries = 0;
  const maxRetries = 30; // 30 attempts * 3 seconds = 90 seconds max wait
  
  while (retries < maxRetries && agreementId === null) {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between attempts
      
      // Get transaction receipt
      const rpcClient = getRpcClient({ client, chain: sepolia });
      const receipt = await eth_getTransactionReceipt(rpcClient, {
        hash: txResult.transactionHash,
      });
      
      if (receipt && receipt.status === 'success') {
        // Parse logs to extract the agreement ID from the contract's return value
        // The createAgreement function returns uint256 agreementId
        // We need to get it from the transaction simulation or use getNextId() - 1 as fallback
        
        // For now, use getNextId() - 1 as a reliable fallback since the transaction is confirmed
        const nextId = await getNextId();
        agreementId = nextId - 1;
        
        if (agreementId <= 0) {
          agreementId = null;
          retries++;
          continue;
        }
        
        break;
      } else if (receipt && receipt.status === 'reverted') {
        throw new Error('Transaction reverted on blockchain');
      }
      
      retries++;
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        throw new Error('Failed to extract agreement ID from transaction. Transaction may still be pending.');
      }
    }
  }
  
  if (agreementId === null) {
    throw new Error('Failed to extract agreement ID from transaction after maximum retries');
  }
  
  return {
    ...txResult,
    agreementId: agreementId
  };
}

/**
 * Deposit escrow ETH
 */
export async function depositEscrow(id, amountEth) {
  return await writeToContract("depositEscrow", [BigInt(id)], amountEth);
}

/**
 * Request change with description and additional cost (client only)
 * @param {number} id - Agreement ID
 * @param {string} requestedChange - Description of the change
 * @param {string} additionalCostEth - Additional cost in ETH (must be greater than 0)
 */
export async function requestChange(id, requestedChange, additionalCostEth) {
  if (!additionalCostEth || parseFloat(additionalCostEth) <= 0) {
    throw new Error('Additional cost must be greater than 0');
  }
  
  const additionalCostWei = BigInt(Math.floor(parseFloat(additionalCostEth) * 1e18));
  return await writeToContract(
    "requestChange", 
    [BigInt(id), requestedChange, additionalCostWei], 
    additionalCostEth
  );
}

/**
 * Complete agreement and release funds to developer (client only)
 * @param {number} id - Agreement ID
 */
// (Duplicate getChangeRequest removed - single implementation remains later in the file)
export async function completeAgreement(id) {
  const account = await wallet.connect({ client });
  const contract = getContractInstance();

  const transaction = await prepareContractCall({
    contract,
    method: "function completeAgreement(uint256 _id)",
    params: [BigInt(id)],
  });

  return await sendTransaction({ account, transaction });
}

// ============================================
// AGREEMENT READ OPERATIONS
// ============================================

/**
 * Get agreement summary by ID
 * @param {number} id - Agreement ID
 */
export async function getAgreementSummary(id) {
  const contract = getContractInstance();

  const result = await readContract({
    contract,
    method: "getAgreementSummary",
    params: [BigInt(id)],
  });

  return {
    client: result[0],
    developer: result[1],
    projectName: result[2],
    docCid: result[3],
    totalValue: result[4].toString(),
    escrowBalance: result[5].toString(),
    startDate: Number(result[6]),
    endDate: Number(result[7]),
    status: Number(result[8]),
    changeCount: Number(result[9])
  };
}

/**
 * Get change request details by agreement ID and index
 * @param {number} agreementId - Agreement ID
 * @param {number} changeIndex - Change request index
 */
export async function getChangeRequest(agreementId, changeIndex) {
  const contract = getContractInstance();

  const result = await readContract({
    contract,
    method: "getChangeRequest",
    params: [BigInt(agreementId), BigInt(changeIndex)],
  });

  return {
    agreementId: Number(result[0]),
    developer: result[1],
    client: result[2],
    projectName: result[3],
    requestedChange: result[4],
    additionalCost: result[5].toString(),
    timestamp: Number(result[6])
  };
}

/**
 * Get next agreement ID
 */
export async function getNextId() {
  const contract = getContractInstance();

  const result = await readContract({
    contract,
    method: "nextId",
    params: [],
  });

  return Number(result);
}

// ============================================
// TRANSACTION OPERATIONS
// ============================================

/**
 * Decode contract input data
 * @private
 */
function decodeContractInput(inputData) {
  try {
    if (!inputData || inputData === '0x') {
      return null;
    }

    // Get function selector (first 4 bytes / 8 hex chars after 0x)
    const functionSelector = inputData.slice(0, 10);
    
    // For createAgreement: (address _developer, string _projectName, string _docCid, uint256 _totalValue, uint256 _startDate, uint256 _endDate)
    if (inputData.length > 10) {
      try {
        // Remove 0x and function selector
        const paramData = inputData.slice(10);
        
        // Developer address (first 32 bytes, but address is in the last 20 bytes)
        const developerHex = paramData.slice(24, 64);
        const developer = '0x' + developerHex;
        
        // Extract IPFS hash from the input data
        // The IPFS CID is stored as a string parameter (_docCid)
        // We need to find it in the encoded data
        let ipfsHash = null;
        
        // Look for typical IPFS hash patterns (Qm... or bafy...)
        const inputStr = inputData.toLowerCase();
        
        // Try to extract IPFS hash by looking for common IPFS CID patterns
        // Convert hex to ASCII to find the IPFS hash
        try {
          // Skip function selector and decode hex to string
          const hexStr = inputData.slice(10);
          let decoded = '';
          for (let i = 0; i < hexStr.length; i += 2) {
            const byte = parseInt(hexStr.substr(i, 2), 16);
            if (byte > 31 && byte < 127) { // Printable ASCII characters
              decoded += String.fromCharCode(byte);
            }
          }
          
          // Look for IPFS CID patterns (Qm... is base58, bafy... is CIDv1)
          const ipfsMatch = decoded.match(/\b(Qm[1-9A-HJ-NP-Za-km-z]{44,}|bafy[a-z0-9]{50,})\b/);
          if (ipfsMatch) {
            ipfsHash = ipfsMatch[1];
          }
        } catch (e) {
          // Ignore extraction errors
        }
        
        return {
          functionName: 'createAgreement',
          functionSelector: functionSelector,
          developer: developer,
          ipfsHash: ipfsHash,
          inputDataLength: inputData.length,
          hasIPFSHash: !!ipfsHash,
        };
      } catch (decodeError) {
        // Ignore decoding errors
      }
    }
    
    return {
      functionName: 'Contract Call',
      functionSelector: functionSelector,
      inputDataLength: inputData.length,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get transaction details by hash using Thirdweb SDK
 * @param {string} txHash - Transaction hash
 */
export async function getTransactionDetails(txHash) {
  try {
    // Get RPC client for Sepolia
    const rpcRequest = getRpcClient({ client, chain: sepolia });
    
    // Fetch transaction and receipt using Thirdweb's helper functions
    const [txData, txReceipt] = await Promise.all([
      eth_getTransactionByHash(rpcRequest, { hash: txHash }),
      eth_getTransactionReceipt(rpcRequest, { hash: txHash })
    ]);

    if (!txData || !txReceipt) {
      throw new Error('Transaction not found');
    }

    // Get block details for timestamp
    const blockData = await eth_getBlockByNumber(rpcRequest, {
      blockNumber: txReceipt.blockNumber,
      includeTransactions: false
    });

    // Convert hex values to readable formats
    const valueInWei = BigInt(txData.value || 0n);
    const valueInEth = (Number(valueInWei) / 1e18).toFixed(6);
    
    const gasUsed = Number(txReceipt.gasUsed);
    const gasPrice = Number(txData.gasPrice || 0n);
    const gasPriceInGwei = (gasPrice / 1e9).toFixed(2);
    
    const blockNumber = Number(txReceipt.blockNumber);
    const timestamp = new Date(Number(blockData.timestamp) * 1000).toLocaleString();
    
    const status = txReceipt.status === 'success' ? 'Success ✓' : 'Failed ✗';

    // Decode input data to extract parameters
    const decodedInput = decodeContractInput(txData.input);

    // Try to get IPFS hash from transaction logs (emitted events)
    let ipfsHashFromLogs = null;
    if (txReceipt.logs && txReceipt.logs.length > 0) {
      // Look for IPFS hash in log data
      for (const log of txReceipt.logs) {
        if (log.data && log.data.length > 2) {
          try {
            const logDataStr = log.data;
            let decoded = '';
            for (let i = 2; i < logDataStr.length; i += 2) {
              const byte = parseInt(logDataStr.substr(i, 2), 16);
              if (byte > 31 && byte < 127) {
                decoded += String.fromCharCode(byte);
              }
            }
            const ipfsMatch = decoded.match(/\b(Qm[1-9A-HJ-NP-Za-km-z]{44,}|bafy[a-z0-9]{50,})\b/);
            if (ipfsMatch) {
              ipfsHashFromLogs = ipfsMatch[1];
              break;
            }
          } catch (e) {
            // Continue checking other logs
          }
        }
      }
    }

    // If IPFS hash found in logs, add it to decoded input
    if (ipfsHashFromLogs && decodedInput) {
      decodedInput.ipfsHash = ipfsHashFromLogs;
      decodedInput.hasIPFSHash = true;
    }

    return {
      hash: txHash,
      from: txData.from,
      to: txData.to || 'Contract Creation',
      value: valueInEth,
      gasUsed: gasUsed.toLocaleString(),
      gasPrice: gasPriceInGwei,
      blockNumber: blockNumber.toString(),
      timestamp: timestamp,
      status: status,
      input: txData.input,
      decodedInput: decodedInput
    };
  } catch (error) {
    throw new Error('Failed to fetch transaction details. Please check the transaction hash.');
  }
}

