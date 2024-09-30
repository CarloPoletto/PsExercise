import { AController } from "./Controller";
import { UserDto, User } from "models/User";
import { SignInDto } from "models/SignIn";
import { SignUpDto } from "models/SignUp";

export class ControllerUser extends AController {

    public static async signUp(signUpDto: SignUpDto): Promise<void> {
        await ControllerUser.apiPost(`User/SignUp`, signUpDto);
    }

    public static async signIn(signInDto: SignInDto): Promise<void> {
        await ControllerUser.apiPost(`User/SignIn`, signInDto);
    }

    public static async signOut(): Promise<void> {
        await ControllerUser.apiGet(`User/SignOut`);
    }

    public static async getLoggedUser(): Promise<User> {
        let response = await ControllerUser.apiGet(`User/GetLoggedUser`);
        let res = await response.body as UserDto;
        return res == null ? null : new User(res);
    }
}
