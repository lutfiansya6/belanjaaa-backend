import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface CreateSnapTransactionParams {
  orderId: string;
  grossAmount: number;
  customerDetails?: {
    first_name?: string;
    email?: string;
    phone?: string;
  };
  itemDetails?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface SnapTransactionResult {
  token: string;
  redirectUrl: string;
}

@Injectable()
export class MidtransService {
  private readonly logger = new Logger(MidtransService.name);

  getServerKey(): string {
    return process.env.MIDTRANS_SERVER_KEY ?? '';
  }

  getClientKey(): string {
    return process.env.MIDTRANS_CLIENT_KEY ?? '';
  }

  private isPlaceholderKey(key: string): boolean {
    return (
      !key ||
      key === 'SB-Mid-server-' ||
      key.trim() === '' ||
      key.startsWith('dummy')
    );
  }

  async createSnapTransaction(
    params: CreateSnapTransactionParams,
  ): Promise<SnapTransactionResult> {
    const serverKey = this.getServerKey();

    // If server key is a placeholder or not yet filled, provide a mock token in sandbox
    if (this.isPlaceholderKey(serverKey)) {
      this.logger.warn(
        `MIDTRANS_SERVER_KEY is a placeholder ('${serverKey}'). Generating mock sandbox Snap token for order ${params.orderId}.`,
      );
      const mockToken = `mock-snap-${params.orderId}-${Date.now()}`;
      return {
        token: mockToken,
        redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${mockToken}`,
      };
    }

    const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`;
    const endpoint = 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const body = {
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.grossAmount,
      },
      customer_details: params.customerDetails,
      item_details: params.itemDetails,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        this.logger.error(`Midtrans Snap API returned error: ${JSON.stringify(data)}`);

        // If placeholder-like unauthorized error occurs during sandbox testing
        if (response.status === 401 && serverKey.length <= 15) {
          const mockToken = `mock-snap-${params.orderId}-${Date.now()}`;
          return {
            token: mockToken,
            redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${mockToken}`,
          };
        }

        const errorMsg = Array.isArray(data.error_messages)
          ? data.error_messages.join(', ')
          : (data.error ?? data.message ?? 'Unknown error from Midtrans');
        throw new BadGatewayException(`Gagal membuat transaksi Midtrans Snap: ${errorMsg}`);
      }

      return {
        token: data.token,
        redirectUrl: data.redirect_url,
      };
    } catch (err: any) {
      if (err instanceof BadGatewayException) {
        throw err;
      }
      this.logger.error(`Midtrans connection error: ${err.message}`);
      throw new BadGatewayException(`Koneksi ke server Midtrans gagal: ${err.message}`);
    }
  }

  verifySignature(payload: {
    order_id: string;
    status_code: string;
    gross_amount: string;
    signature_key: string;
  }): boolean {
    const serverKey = this.getServerKey();
    if (!serverKey) {
      return false;
    }
    const raw = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
    const expected = crypto.createHash('sha512').update(raw).digest('hex');
    return payload.signature_key.toLowerCase() === expected.toLowerCase();
  }

  createSignature(orderId: string, statusCode: string, grossAmount: string): string {
    const serverKey = this.getServerKey();
    const raw = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    return crypto.createHash('sha512').update(raw).digest('hex');
  }
}
