import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "src/app.service";
import { Auth } from "src/dtos/user_auth_dto";
import { AuthService } from "./jwt.authService";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post("/auth")
    authCheck(@Body() auth:Auth ){
        this.authService.login(auth)
    

    }

}