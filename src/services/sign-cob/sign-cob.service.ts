import { Injectable } from '@nestjs/common';
import { env } from 'process';

import https from 'https';
import axios from 'axios';
import * as fs from 'node:fs';
import path from 'path';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/entity/user.entity';

@Injectable()
export class SignCobService {
  accessToken: string = '';
  headersConfig: object = {};

  certificate = fs.readFileSync(
    path.join(__dirname, `../../../../certs/${env.CERTIFICATE}`)
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

  constructor(private readonly accountService: UserService) {
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

  async getSpecificPlan(plan_name: string): Promise<any> {
    try {
      await this.init();
      const plans = await axios({
        method: 'GET',
        url: `${env.ROUTE_COB}/v1/plans?name=${plan_name}`,
        headers: this.headersConfig,
        httpsAgent: this.agent,
      });

      return plans.data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async getPlanId(plan_name: string): Promise<number> {
    const plan = await this.getSpecificPlan(plan_name);

    const plan_id: number = plan[0]['plan_id'];

    return plan_id;
  }

  async createPlans(plan_config: {
    name: string;
    interval: number;
    repeats: number;
  }): Promise<any> {
    try {
      await this.init();
      this.planConfig.headers = this.headersConfig;
      this.planConfig.data = {
        name: plan_config.name,
        interval: plan_config.interval,
        repeats: plan_config.repeats,
      };

      const res = await axios(this.planConfig);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createSubscriptions(plan_data: {
    payment_token: string;
    plan_name: string;
    value: number;
    account_id: string;
    billing_address: {
      street: string;
      number: string;
      neighborhood: string;
      zipcode: string;
      city: string;
      complement: string;
      state: string;
    };
  }): Promise<any> {
    try {
      await this.init();
      const plan_id = await this.getPlanId(plan_data.plan_name);
      const url = `${env.ROUTE_COB}/v1/plan/${plan_id}/subscription/one-step`;

      const items = [
        {
          name: plan_data.plan_name,
          amount: 1,
          value: plan_data.value,
        },
      ];

      const accountUser: UserEntity = await this.accountService.getAccountInfo(
        plan_data.account_id
      );
      const accountBirth = new Date(accountUser.created_at);
      const customer = {
        name: accountUser.name,
        cnpj: accountUser.cnpj,
        email: accountUser.email,
        birth: `${accountBirth.getUTCFullYear()}-${accountBirth.getUTCMonth()}-${accountBirth.getUTCDate()}`,
        phone_number: accountUser.phone_number,
      };

      // const billingAddress = {
      //   street: 'Rua Desembargador João Paes',
      //   number: '1000',
      //   neighborhood: 'Boa Viagem',
      //   zipcode: '51021360',
      //   city: 'Recife',
      //   complement: 'apt 603',
      //   state: 'PE',
      // };

      const data = {
        items: items,
        payment: {
          credit_card: {
            trial_days: 7,
            customer: customer,
            // payment_token: 'b4b3e7f36c92f487eab7d3d3df6b1899c42dab0e',
            payment_token: plan_data.payment_token,
            billing_address: plan_data.billing_address,
          },
        },
      };

      console.log(this.headersConfig);
      const subscriptionsRes = await axios({
        method: 'POST',
        url: url,
        headers: this.headersConfig,
        httpsAgent: this.agent,
        data: data,
      });

      return subscriptionsRes.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
