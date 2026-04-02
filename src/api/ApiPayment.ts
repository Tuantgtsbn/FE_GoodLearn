import { fetcher } from './Fetcher';

const path = {
  createPayment: '/payments/create-payment',
  paymentStatus: (orderId: string) => `/payments/payment-status/${orderId}`,
  webhook: '/payments/webhook',
};

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
  createPayment,
  getPaymentStatus,
  webhookOrder,
};
