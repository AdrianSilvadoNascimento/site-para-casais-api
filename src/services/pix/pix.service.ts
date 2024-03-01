/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { env } from 'process';

import axios from 'axios';

import { EfiManagement } from '../../utils/efi-management/efi-management';

@Injectable()
export class PixService {
  efiManager = new EfiManagement()

  // Pix Configurations
  qrcodeConfig = {
    method: 'GET',
    url: `${env.ROUTE_PIX}/v2/loc`,
    httpsAgent: this.efiManager.agent,
    headers: this.efiManager.headersConfig,
    data: {
      tipoCob: 'cob',
    },
  };

  cobConfig = {
    method: 'POST',
    url: `${env.ROUTE_PIX}/v2/cob`,
    httpsAgent: this.efiManager.agent,
    headers: this.efiManager.headersConfig,
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
    this.efiManager.getCertificate(env.ROUTE_PIX);
  }

  async createPixCob(): Promise<any> {
    try {
      await this.efiManager.getAccessToken()

      this.cobConfig = {
        ...this.cobConfig,
        headers: this.efiManager.headersConfig,
        httpsAgent: this.efiManager.agent,
      };

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
      await this.efiManager.getAccessToken()

      this.qrcodeConfig = {
        ...this.qrcodeConfig,
        headers: this.efiManager.headersConfig,
        httpsAgent: this.efiManager.agent,
        url: `${this.qrcodeConfig.url}/${locId}/qrcode`,
      };

      const res = await axios(this.qrcodeConfig);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
