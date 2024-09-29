import { AController } from "./Controller";
import { UserDto, User } from "models/User";
import { SignInDto } from "models/SignIn";
import { SignUpDto } from "models/SignUp";

export class ControllerUser extends AController {

    public static async signUp(signUpDto: SignUpDto): Promise<void> {
        let response = await ControllerUser.apiPost(`User/SignUp`, signUpDto);
        console.log(response);
    }

    public static async signIn(signInDto: SignInDto): Promise<void> {
        let response = await ControllerUser.apiPost(`User/SignIn`, signInDto);
        console.log(response);
    }

    public static async signOut(): Promise<void> {
        let response = await ControllerUser.apiGet(`User/SignOut`);
        console.log(response);
    }

    public static async getLoggedUser(): Promise<User> {
        let response = await ControllerUser.apiGet(`User/GetLoggedUser`);
        console.log(response);
        let res = await response.body as UserDto;
        return res == null ? null : new User(res);
    }
}
