import { Injectable } from '@nestjs/common';
import { env } from 'process';

import https from 'https';
import axios from 'axios';
import * as fs from 'node:fs';
import path from 'path';

@Injectable()
export class PixService {
  accessToken: string = '';
  headersConfig: object = {};

  // Pix Configurations
  certificate = fs.readFileSync(
    path.join(__dirname, `../../../certs/${env.CERTIFICATE}`)
  );

  data = JSON.stringify({ grant_type: 'client_credentials' });
  credentials = `${env.CLIENT_ID}:${env.CLIENT_SECRET}`;
  auth = Buffer.from(this.credentials).toString('base64');
  agent = new https.Agent({
    pfx: this.certificate,
    passphrase: '',
  });

  authConfig = {
    method: 'POST',
    url: `${env.ROUTE_PIX}/oauth/token`,
    headers: {
      Authorization: `Basic ${this.auth}`,
      'Content-Type': 'application/json',
    },
    httpsAgent: this.agent,
    data: this.data,
  };

  qrcodeConfig = {
    method: 'GET',
    url: `${env.ROUTE_PIX}/v2/loc`,
    httpsAgent: this.agent,
    headers: {},
    data: {
      tipoCob: 'cob',
    },
  };

  cobConfig = {
    method: 'POST',
    url: `${env.ROUTE_PIX}/v2/cob`,
    httpsAgent: this.agent,
    headers: {},
    data: {
      calendario: {
        expiracao: 3600,
      },
      valor: {
        original: parseFloat('123.45').toString(),
      },
      chave: env.CHAVE_PIX,
      solicitacaoPagador: 'Cobrança teste',
    },
  };

  constructor() {
    this.init();
  }

  private async init() {
    if (!this.accessToken.length) {
      await this.getPixAccessToken();
    }

    setInterval(async () => {
      await this.getPixAccessToken();
    }, 5000 * 1000);

    this.headersConfig = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  private async getPixAccessToken(): Promise<void> {
    try {
      const response = await axios(this.authConfig);
      this.accessToken = response.data.access_token;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async createPixCob(): Promise<any> {
    try {
      this.cobConfig.headers = this.headersConfig;

      const cobRes = await axios(this.cobConfig);
      const code = await this.getPixQrcode(cobRes.data.loc.id);

      return {
        cob: cobRes.data,
        code,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getPixQrcode(locId: string) {
    try {
      this.qrcodeConfig = {
        ...this.qrcodeConfig,
        headers: this.headersConfig,
        url: `${this.qrcodeConfig.url}/${locId}/qrcode`,
      };

      const res = await axios(this.qrcodeConfig);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
