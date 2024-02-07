/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get } from '@nestjs/common';
import { env } from 'process';

import https from 'https';
import axios from 'axios';
import * as fs from 'node:fs';
import path from 'path';

@Controller('pix')
export class PixController {
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
    url: `${env.ROUTE_PIX_HMG}/oauth/token`,
    headers: {
      Authorization: `Basic ${this.auth}`,
      'Content-Type': 'application/json',
    },
    httpsAgent: this.agent,
    data: this.data,
  };

  accessToken: string = '';

  locConfig = {
    method: 'POST',
    url: `${env.ROUTE_PIX_HMG}/v2/loc`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
    httpsAgent: this.agent,
    data: {
      tipoCob: 'cob',
    },
  };

  constructor() {}

  @Get('loc')
  async createPixLoc() {
    try {
      await this.getPixAccessToken();
      this.locConfig.headers.Authorization = `Bearer ${this.accessToken}`;

      const locResponse = await axios(this.locConfig);
      const qrCode = this.getPixQRcode(locResponse.data?.id);

      return qrCode;
    } catch (error) {
      console.log(error);
    }
  }

  async getPixQRcode(locId: string) {
    try {
      await this.getPixAccessToken();
      this.locConfig.headers.Authorization = `Bearer ${this.accessToken}`;
      this.locConfig.method = 'GET';
      this.locConfig.url = `${this.locConfig.url}/${locId}/qrcode`;

      const response = await axios(this.locConfig);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async getPixAccessToken(): Promise<void> {
    try {
      const response = await axios(this.authConfig);
      this.accessToken = response.data.access_token;
    } catch (error) {
      console.log(error);
    }
  }
}
