import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ApiGatewayService {
  constructor(private readonly httpService: HttpService) {}

  async getUsers() {
    const response = await firstValueFrom(
      this.httpService.get('http://localhost:3001/api') // URL user service
    );
    return response.data;
  }


}
