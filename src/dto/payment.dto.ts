import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PaymentDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
}
