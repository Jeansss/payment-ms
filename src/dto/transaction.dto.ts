import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly paymentMethodId: string;
}
