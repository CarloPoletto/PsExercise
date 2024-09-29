import App from "components/App";
import merge from "deepmerge";
import * as Types from "../common/Types";
import * as Utils from "../common/Utils";
import { isPlainObject } from "is-plain-object";
import { SignUpDto } from "models/SignUp";
import { SignInDto } from "models/SignIn";
import { User } from "models/User";
import { Task } from "models/Task";
import { ControllerUser } from "controller/ControllerUser";
import { ControllerTask } from "controller/ControllerTask";

export interface IStore {
    readonly loader: boolean;

    readonly user: User;
    readonly tasks: Task[];

    readonly signIn: SignInDto;
    readonly signUp: SignUpDto;
    readonly activeSign: "signIn" | "signUp";
}

export class Store implements IStore {
    
    private static singleton: Store = new Store();
    private components = { app: null as App };

    public get loader(): boolean { return this.components.app.state.loader; }

    public get user(): User { return this.components.app.state.user; }
    public get tasks(): Task[] { return this.components.app.state.tasks; }

    public get signIn(): IStore["signIn"] { return this.components.app.state.signIn; }
    public get signUp(): IStore["signUp"] { return this.components.app.state.signUp; }
    public get activeSign(): IStore["activeSign"] { return this.components.app.state.activeSign; }

    public static init(): IStore {
        return {
            loader: false,

            user: null,
            tasks: null,

            signIn: null,
            signUp: null,
            activeSign: "signIn",
        };
    }

    /* Singleton
    -----------------------------------*/
    public static setComponentApp(app: App): void {
        Store.singleton.components.app = app;
    }

    public static get state(): Store {
        return Store.singleton;
    }

    /* Loader
    -----------------------------------*/
    public static async onLoadindig(doAction: () => Promise<void>): Promise<void> {
        try {
            await Store.set({ loader: true });
            await Utils.sleep(500);
            await doAction();
        }

        finally {
            await Store.set({ loader: false });
        }
    }

    public static onClick(doAction: () => Promise<void>): (() => void) {
        return async () => await Store.onLoadindig(doAction);
    }

    public static async refresh(): Promise<void> {
        await Store.set({
            user: await ControllerUser.getLoggedUser(),
            tasks: await ControllerTask.getAll(),
            signIn: null,
            signUp: null,
        });
    }

    /* Setter
    -----------------------------------*/
    public static async set(...data: Types.RecursivePartial<IStore>[]): Promise<void> {
        let getState = () => {
            let state = Store.state.components.app.state;
            for(let single of data) {
                state = merge(
                    state, 
                    single as any,
                    {
                        isMergeableObject: isPlainObject,
                        arrayMerge: (destinationArray, sourceArray, options) => sourceArray,
                    }
                )
            }
            return state;
        }

        await Store.state.components.app.setState(getState());
    }

    public static async setSignIn(data: Types.RecursivePartial<IStore["signIn"]>): Promise<void> {
        await Store.set({ signIn: data });
    }

    public static async setSignUp(data: Types.RecursivePartial<IStore["signUp"]>): Promise<void> {
        await Store.set({ signUp: data });
    }
}