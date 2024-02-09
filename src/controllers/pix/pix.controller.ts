/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get } from '@nestjs/common';

import { PixService } from '../../services/pix/pix.service';

@Controller('pix')
export class PixController {
  constructor(private readonly pixService: PixService) {}

  @Get('cob')
  async createCob() {
    return await this.pixService.createPixCob();
  }
}
