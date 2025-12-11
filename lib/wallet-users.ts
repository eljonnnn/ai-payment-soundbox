// Demo user data for wallet interface
export interface WalletUser {
  id: string;
  name: string;
  balance: number;
  avatar: string;
}

export const WALLET_USERS: WalletUser[] = [
  {
    id: "user-1",
    name: "Juan dela Cruz",
    balance: 353.01,
    avatar: "👤",
  },
  {
    id: "user-2",
    name: "Maria Santos",
    balance: 1250.0,
    avatar: "👩",
  },
  {
    id: "user-3",
    name: "Pedro Reyes",
    balance: 500.0,
    avatar: "👨",
  },
];

export const DEFAULT_USER = WALLET_USERS[0];

export function getStoredUser(): WalletUser {
  if (typeof window === "undefined") return DEFAULT_USER;
  
  const stored = localStorage.getItem("wallet-user");
  if (!stored) return DEFAULT_USER;
  
  try {
    const parsed = JSON.parse(stored);
    return WALLET_USERS.find((u) => u.id === parsed.id) || DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

export function setStoredUser(user: WalletUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("wallet-user", JSON.stringify(user));
}
