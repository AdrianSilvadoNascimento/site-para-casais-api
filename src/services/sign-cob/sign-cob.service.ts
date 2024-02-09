import { Injectable } from '@nestjs/common';
import { env } from 'process';

import https from 'https';
import axios from 'axios';
import * as fs from 'node:fs';
import path from 'path';

@Injectable()
export class SignCobService {
  /**
   * Fluxo para criar uma recorrência:
   * 1 - Criar um plano de assinatura;
   * 2 - Criar inscrições (assinaturas) para vincular ao plano em One Step ou Two Steps;
   * 3 - Definir forma de pagamento da assinatura e inserir os dados do cliente.
   *
   * Obrigatório informar:
   * name -> nome da assinatura;
   * interval (meses) -> periodo das cobranças (exemplo '1' para mensal);
   * repeats -> quantas cobranças devem ser geradas para essa assinatura.
   *
   * TODO: Criar assinaturas One Step ou Two Steps
   * 
   * One Step:
   *  - Vincular o plano utilizando o plan_id do plano criado anteriormente;
   *  - Fazer requisição para: /plan/:plan_id/subscriptions/one-step;
   *  - Opcional -> atributo 'trial_days' para informar quantos dias de teste.
   *  - Padrão:
   *    {
          "items": [
            {
              "name": "Assinatura plano prata",
              "value": 74999,
              "amount": 1
            }
          ],
          "trial_days": 7,
          "payment": {
            "credit_card": {
              "customer": {
                "name": "Adrian's MasterCard",
                "cpf": "94271564656",
                "email": "adrian@exemplo.com",
                "birth": "2001-11-08",
                "phone_number": "819123456789"
              },
              "payment_token": "8ad299b108c9cce032ad26377ff871236745053c",
              "billing_address": {
                "street": "Rua Desembargador João Paes",
                "number": "1000",
                "neighborhood": "Boa Viagem",
                "zipcode": "51021000",
                "city": "Recife",
                "complement": "apt 600",
                "state": "PE"
              }
            }
          }
        }
   */

  accessToken: string = '';
  headersConfig: object = {};

  // Cob configurations
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
    url: `${env.ROUTE_COB}/v1/authorize`,
    headers: {
      Authorization: `Basic ${this.auth}`,
      'Content-Type': 'application/json',
    },
    httpsAgent: this.agent,
    data: this.data,
  };

  planConfig = {
    method: 'POST',
    url: `${env.ROUTE_COB}/v1/plan`,
    headers: {},
    httpsAgent: this.agent,
    data: {},
  };

  constructor() {
    this.init().then((res) => res);
  }

  private async init(): Promise<void> {
    if (!this.accessToken.length) {
      await this.getAccessToken();
    }

    setInterval(async () => {
      await this.getAccessToken();
    }, 600 * 1000);
  }

  private async getAccessToken(): Promise<void> {
    try {
      const res = await axios(this.authConfig);

      this.accessToken = res.data.access_token;
      this.headersConfig = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getPlans(): Promise<any> {
    try {
      await this.init();
      const plans = await axios({
        method: 'GET',
        url: `${env.ROUTE_COB}/v1/plans`,
        headers: this.headersConfig,
        httpsAgent: this.agent,
      });

      return plans.data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  private getPlanId(plans: object[], plan_name: string): number {
    let plan_id: number;
    plans.filter((plan) => {
      if (plan['name'] == plan_name) {
        plan_id = plan['plan_id'];
      }
    });

    return plan_id;
  }

  async createPlans(): Promise<any> {
    try {
      await this.init();
      this.planConfig.headers = this.headersConfig;
      this.planConfig.data = {
        name: 'Assinatura - Plano Prata',
        interval: 1,
        repeats: 6,
      };

      const res = await axios(this.planConfig);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createSubscriptions(plan_name: string): Promise<any> {
    try {
      await this.init();
      const plans = await this.getPlans();
      const plan_id = this.getPlanId(plans, plan_name).toString();
      const url = `${env.ROUTE_COB}/v1/plan/${plan_id}/subscription/one-step`;

      const subscriptionsRes = await axios({
        method: 'POST',
        url: url,
        httpsAgent: this.agent,
        headers: this.headersConfig,
        data: JSON.stringify({
          items: [
            {
              name: 'Meu Produto',
              value: 74999,
              amount: 1,
            },
          ],
          payment: {
            credit_card: {
              customer: {
                name: "Adrian's MasterCard",
                cpf: '71090382464',
                email: 'adrianfsf10@gmail.com',
                birth: '2001-11-08',
                phone_number: '819123456789',
              },
              payment_token: '7b49adac8793067af29c94949889888ee2990c42',
              billing_address: {
                street: 'Rua Desembargador João Paes',
                number: '1000',
                neighborhood: 'Boa Viagem',
                zipcode: '51021360',
                city: 'Recife',
                complement: 'apt 603',
                state: 'PE',
              },
            },
          },
        }),
      });

      console.log(subscriptionsRes.data);
      return subscriptionsRes.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
