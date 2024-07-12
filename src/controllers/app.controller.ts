import { Controller, Get, Res } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController()
@Controller()
export class AppController {

    @Get()
    redirectToSwagger(@Res() res) {
        return res.redirect('/api#');
    }
}