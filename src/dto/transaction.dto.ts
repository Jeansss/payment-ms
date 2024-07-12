import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly paymentMethodId: string;
}
