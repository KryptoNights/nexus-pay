export const collapseAddress = (address: any): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('@aptos-connect/keyless-accounts');
    if (serializedState === null) return undefined;
    console.log(JSON.parse(serializedState));

    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined;
  }
};
