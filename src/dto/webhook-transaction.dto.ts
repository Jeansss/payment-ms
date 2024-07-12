import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WebhookDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly transactionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly orderId: string;
}
