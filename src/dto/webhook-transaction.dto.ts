import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
