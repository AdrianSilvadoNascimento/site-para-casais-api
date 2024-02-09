import { Controller, Get, Query } from '@nestjs/common';

import { SignCobService } from '../../services/sign-cob/sign-cob.service';

enum Subscriptions {
  prata = 'Assinatura - Plano Prata',
}

@Controller('credit')
export class SignCobController {
  constructor(private readonly signCobService: SignCobService) {}

  @Get('plans')
  async getPlans(): Promise<any> {
    return await this.signCobService.getPlans();
  }

  @Get('subscription')
  async createSubscription(@Query() params: any): Promise<any> {
    const res = await this.signCobService.createSubscriptions(
      Subscriptions[params.plan_name]
    );

    return res;
  }

  @Get('create-plan')
  async createAccountSign(): Promise<any> {
    const res = this.signCobService.createPlans();

    return res;
  }
}
