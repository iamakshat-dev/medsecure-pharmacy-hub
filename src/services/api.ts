export type InventoryItem = {
  id: string;
  medicine_id: number;
  medicine_name: string;
  name: string;
  batch_id: string;
  batch: string;
  stock: number;
  price: number;
  expiry_date: string | null;
  expiry: string | null;
  current_owner_id: number | null;
  current_owner_name: string;
  current_owner_role: 'manufacturer' | 'distributor' | 'pharmacy' | null;
  verification_status: 'Verified' | 'Tampered' | 'Unverified';
  status: 'In Stock' | 'Out of Stock';
};

export type VerifyBatchResponse = {
  valid: boolean;
  reason: string;
  hash_match?: boolean;
  signature_valid?: boolean;
  chain_valid?: boolean;
  recorded_hash?: string;
  expected_hash?: string;
  latest_actor?: {
    id: number | null;
    name: string | null;
    role: string | null;
  };
  current_owner?:
    | number
    | {
        id: number | null;
        name: string | null;
        role: string | null;
  };
};

export type AppUser = {
  id: number;
  name: string;
  role: 'manufacturer' | 'distributor' | 'pharmacy';
  public_key?: string;
};

export type BatchHistoryResponse = {
  batch: {
    batch_id: string;
    medicine_id: number;
    quantity: number;
    price?: number;
    manufacture_date: string;
    expiry_date: string;
    current_owner: number | null;
  };
  verification: VerifyBatchResponse;
  actors_involved: Array<{
    id: number;
    name: string;
    role: string;
  }>;
  blockchain_trail: Array<{
    block_id: number;
    batch_id: string;
    data_hash: string;
    previous_hash: string;
    current_hash: string;
    actor: {
      id: number | null;
      name: string | null;
      role: string | null;
    };
    signature: string;
    timestamp: string;
    transaction: {
      id: number;
      action: string;
      from_actor: {
        id: number | null;
        name: string | null;
        role: string | null;
      };
      to_actor: {
        id: number | null;
        name: string | null;
        role: string | null;
      };
      quantity_snapshot: number;
      remarks: string | null;
      timestamp: string;
    } | null;
  }>;
};

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  `${window.location.protocol}//${window.location.hostname}:3000/api`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const rawText = await response.text();
  const payload = rawText ? JSON.parse(rawText) : null;

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed');
  }

  return payload as T;
}

export function getInventory() {
  return request<InventoryItem[]>('/inventory');
}

export function createInventoryItem(payload: {
  name: string;
  batch: string;
  stock: number;
  price: number;
  expiry: string;
}) {
  return request<InventoryItem>('/inventory', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateInventoryItem(
  batchId: string,
  payload: {
    name: string;
    batch: string;
    stock: number;
    price: number;
    expiry: string;
  },
) {
  return request<InventoryItem>(`/inventory/${batchId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteInventoryItem(batchId: string) {
  return request<{ message: string }>(`/inventory/${batchId}`, {
    method: 'DELETE',
  });
}

export function verifyBatch(batchId: string) {
  return request<VerifyBatchResponse>(`/batch/verify/${encodeURIComponent(batchId)}`);
}

export function getBatchHistory(batchId: string) {
  return request<BatchHistoryResponse>(`/batch/history/${encodeURIComponent(batchId)}`);
}

export function listUsers() {
  return request<AppUser[]>('/users');
}

export function createBlockchainBatch(payload: {
  batchId: string;
  medicineId: number;
  quantity: number;
  price?: number;
  manufactureDate: string;
  expiryDate: string;
  actorId: number;
}) {
  return request('/batch/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function transferBlockchainBatch(payload: {
  batchId: string;
  fromActorId: number;
  toActorId: number;
}) {
  return request('/batch/transfer', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
