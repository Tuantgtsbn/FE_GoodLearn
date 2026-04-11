import { fetcher, fetcherWithMetadata } from './Fetcher';

const path = {
  getPayments: '/payments',
  createPayment: '/payments/create-payment',
  paymentStatus: (orderId: string) => `/payments/payment-status/${orderId}`,
  webhook: '/payments/webhook',
};

// Types for GET payments list
export interface IPaymentListItem {
  orderId: string;
  code: string;
  userId: string;
  packageId: string;
  paymentMethod: string;
  amountPaid: string;
  paymentStatus:
    | 'UNPAID'
    | 'PENDING'
    | 'PAID'
    | 'CANCELED'
    | 'FAILED'
    | 'REFUNDED';
  createdAt: string;
  package?: {
    packageId: string;
    name: string;
    type: 'FREE' | 'BASIC' | 'PREMIUM';
    isPopular: boolean;
    price: number;
    discountPrice?: number | null;
    unitPrice: string;
    maxCredits: number;
    maxCreateVideos: number;
    maxChatMessages?: number | null;
    maxFlashcards: number;
    maxVoiceCalls: number;
    bonusCredits: number;
    canShareContent: boolean;
    description?: string | null;
    isActive: boolean;
  };
  transactions?: Array<{
    id: number;
    gateway: string;
    transactionDate: string;
    accountNumber?: string | null;
    subAccount?: string | null;
    amountIn: string;
    amountOut: string;
    accumulated: string;
    code?: string | null;
    transactionContent?: string | null;
    referenceNumber?: string | null;
    createdAt: string;
  }>;
}

export interface IPaymentListApiQuery {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  paymentStatus?:
    | 'UNPAID'
    | 'PENDING'
    | 'PAID'
    | 'CANCELED'
    | 'FAILED'
    | 'REFUNDED';
  search?: string;
}

export interface ICreatePaymentPayload {
  packageId: string;
}

export interface ICreatePaymentResponse {
  linkQR: string;
  orderId: string;
  amount: number;
}

export interface IGetPaymentStatusResponse {
  orderId: string;
  paymentStatus: 'UNPAID' | 'PENDING' | 'PAID' | 'FAILED' | string;
}

export interface IWebhookPaymentPayload {
  [key: string]: unknown;
}

const getPaymentsList = (query: IPaymentListApiQuery) => {
  return fetcherWithMetadata<IPaymentListItem[]>(
    {
      url: path.getPayments,
      method: 'GET',
      params: query,
    },
    {
      withToken: true,
      displayError: false,
      withMetadata: true,
    }
  );
};

const createPayment = (payload: ICreatePaymentPayload) => {
  return fetcher<ICreatePaymentResponse>(
    {
      url: path.createPayment,
      method: 'POST',
      data: payload,
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const getPaymentStatus = (orderId: string) => {
  return fetcher<IGetPaymentStatusResponse>(
    {
      url: path.paymentStatus(orderId),
      method: 'GET',
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const webhookOrder = (
  payload: IWebhookPaymentPayload,
  authorization: string
) => {
  return fetcher<Record<string, unknown>>(
    {
      url: path.webhook,
      method: 'POST',
      data: payload,
      headers: {
        Authorization: authorization,
      },
    },
    {
      withToken: false,
      displayError: false,
    }
  );
};

export default {
  getPaymentsList,
  createPayment,
  getPaymentStatus,
  webhookOrder,
};
