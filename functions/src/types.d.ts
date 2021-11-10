export interface PaymentRequest {
  amount: any;
  successUrl: string;
  cancelUrl: string;
  callbackUrl: string;
}

export interface PaymentResponse {
  url: string;
  transactionId: string;
}

export interface WebHookData {
  event: string;
  transactionId: string;
  amount: number;
}
