/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { env } from 'process';
import { Storage } from '@google-cloud/storage';

import https from 'https';
import axios from 'axios';
import path from 'path';

@Injectable()
export class PixService {
  accessToken: string = '';
  headersConfig: object = {};
  
  // Pix Configurations
  storage = new Storage({
    keyFilename: path.join(
      __dirname,
      '../../../../e-gest-firebase-keyfile.json'
    ),
    projectId: 'e-gest-954ea',
  });

  bucketName = 'e-gest-954ea.appspot.com';
  filename = 'egest-estoque-hmg-cert.p12';

  file = this.storage.bucket(this.bucketName).file(this.filename);

  data = JSON.stringify({ grant_type: 'client_credentials' });
  credentials = `${env.CLIENT_ID}:${env.CLIENT_SECRET}`;
  auth = Buffer.from(this.credentials).toString('base64');
  agent = new https.Agent();

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
    this.getCertificateAndInit()
  }

  private getCertificateAndInit() {
    const stream = this.file.createReadStream();
    const chunks = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      const fileContent = Buffer.concat(chunks);
      this.agent.options.pfx = fileContent;

      this.authConfig.httpsAgent,
      this.qrcodeConfig.httpsAgent,
      this.cobConfig.httpsAgent = this.agent;

      this.init()
    });

    stream.on('error', (err) => {
      console.error(err);
    });
  }

  private async init() {
    if (!this.accessToken.length) {
      setTimeout(async () => {
        await this.getPixAccessToken();
      });
    }

    setInterval(async () => {
      await this.getPixAccessToken();
    }, 5000 * 1000);
  }

  private async getPixAccessToken(): Promise<void> {
    try {
      const response = await axios(this.authConfig);

      this.accessToken = response.data.access_token;
      this.headersConfig = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      };
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
