import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesEnum } from './common/decorators/roles/roles.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
