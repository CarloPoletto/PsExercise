import App from "components/App";
import merge from "deepmerge";
import * as Types from "../common/Types";
import * as Utils from "../common/Utils";
import { isPlainObject } from "is-plain-object";
import { SignUpDto } from "models/SignUp";
import { SignInDto } from "models/SignIn";
import { User } from "models/User";

export interface IStore {
    readonly loader: boolean;
    readonly user: User;
    readonly active: IPages;
    readonly pages: {
        readonly signIn: SignInDto;
        readonly signUp: SignUpDto;
    };
}

export type IPages = keyof IStore["pages"];

export class Store implements IStore {
    
    private static singleton: Store = new Store();
    private components = { app: null as App };

    public get loader(): boolean { return this.components.app.state.loader; }
    public get user(): User { return this.components.app.state.user; }
    public get active(): IPages { return this.components.app.state.active; }
    public get pages(): IStore["pages"] { return this.components.app.state.pages; }

    public static init(): IStore {
        return {
            loader: false,
            user: null,
            active: "signIn",
            pages: {
                signIn: {
                    email: null,
                    password: null,
                },
                signUp: {
                    email: null,
                    password: null,
                },
            }
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

    public static async setPages(data: Types.RecursivePartial<IStore["pages"]>): Promise<void> {
        await Store.set({ pages: data });
    }

    public static async setPagesSignIn(data: Types.RecursivePartial<IStore["pages"]["signIn"]>): Promise<void> {
        await Store.setPages({ signIn: data });
    }

    public static async setPagesSignUp(data: Types.RecursivePartial<IStore["pages"]["signUp"]>): Promise<void> {
        await Store.setPages({ signUp: data });
    }
}