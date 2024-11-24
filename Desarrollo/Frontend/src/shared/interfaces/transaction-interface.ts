export interface TransactionResponse {
  date: Date;
  from: string;
  to: string;
  txHash: string;
  newBalance: number;
}
