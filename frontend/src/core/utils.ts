export const collapseAddress = (address: any): string => {
  if (typeof address === 'string') {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  } else {
    console.error("Provided address is not a string:", address);
    return ''; 
  }
};

export const divideByTenMillion = (value:number) => {
  return value/100000000;
}

export const getAddressAsString = (address: any): any => {
  if (typeof address === 'string') {
    return address; // It's already a string
  } else if (Array.isArray(address)) {
    return address[0] || ''; // Ensure the array has an element
  } else if (typeof address === 'object' && address !== null) {
    const values = Object.values(address);
    if (typeof values[0] === 'string') {
      return values[0] as string; // Return the first value as a string
    }
  }
  return ''; // Default fallback if address is not usable
};

export const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(
      "@aptos-connect/keyless-accounts"
    );
    if (serializedState === null) return undefined;

    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined;
  }
};

export const getStoredAddress = (): string | undefined => {
  try {
    const storedAddress = localStorage.getItem("activeAccount");

    if (storedAddress) {
      return storedAddress;
    }
  } catch (error) {
    console.error("Error parsing address:", error);
  }
  return undefined;
};

export const isValidWalletAddress = (address: string): boolean => {
  const walletAddressPattern = /^0x[a-fA-F0-9]{64}$/; // Ethereum-like address pattern
  return walletAddressPattern.test(address);
};

// Function to validate custom text format (e.g., xyz@nexus)
export const isValidCustomText = (text: string): boolean => {
  const customTextPattern = /^[a-zA-Z0-9]+.nexus$/; // Custom pattern for the text
  return customTextPattern.test(text);
};