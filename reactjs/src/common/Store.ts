import App from "components/App";
import merge from "deepmerge";
import * as Types from "./Types";
import * as Utils from "./Utils";
import { isPlainObject } from "is-plain-object";
import { SignUpDto } from "models/SignUp";
import { SignInDto } from "models/SignIn";
import { User } from "models/User";
import { Task, TaskDto } from "models/Task";
import { ControllerUser } from "controller/ControllerUser";
import { ControllerTask } from "controller/ControllerTask";
import { toast } from "react-semantic-toasts";
import { NotImplementedError, ToastError } from "./Errors";

export interface IStore {
    readonly loader: boolean;

    readonly logged: {
        readonly active: "list" | "new";
        readonly user: User;
        readonly tasks: Task[];
        readonly taskNew: TaskDto;
        readonly sorting: {
            readonly column;
            readonly direction;
        };
    };

    readonly unlogged: {
        readonly active: "signIn" | "signUp";
        readonly signIn: SignInDto;
        readonly signUp: SignUpDto;
    };
}

export class Store implements IStore {
    
    private static singleton: Store = new Store();
    private components = { app: null as App };

    public get loader(): boolean { return this.components.app.state.loader; }

    public get logged(): IStore["logged"] { return this.components.app.state.logged; }
    public get unlogged(): IStore["unlogged"] { return this.components.app.state.unlogged; }

    /* Shortcut
    -------------------------- */
    public get user(): User { return Store.state.logged.user; }
    public get tasks(): Task[] { return Store.state.logged.tasks; }

    public get signIn(): SignInDto { return Store.state.unlogged.signIn; }
    public get signUp(): SignUpDto { return Store.state.unlogged.signUp; }

    public static init(): IStore {
        return {
            loader: false,

            logged: {
                active: "list",
                user: null,
                tasks: null,
                taskNew: null,
                sorting: null,
            },

            unlogged: {
                active: "signIn",
                signIn: null,
                signUp: null,
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

    /* Toast
    -----------------------------------*/
    public static showToast(type: Types.ToastType, content: string): void {
        let title: { [tooltype in Types.ToastType]: string } = {
            error: "Error",
            warning: "Warning",
            success: "Success",
        };

        toast({
            time: 10000,
            size: "small",
            type: type,
            title: title[type],
            description: content,
        });
    }

    public static showToastError(content: string = null): void {
        Store.showToast("error", content ?? "There was an unexpected error.");
    }

    public static showToastSuccess(content: string = null): void {
        Store.showToast("success", content ?? "The operation was successful.");
    }

    /* Loader
    -----------------------------------*/
    public static async onLoadindig(doAction: () => Promise<void>): Promise<void> {
        try {
            await Store.set({ loader: true });
            await Utils.sleep(500);
            await doAction();
        }

        catch (err) {
            console.error(err);

            if (err instanceof ToastError)
                return Store.showToastError(err.message);

            if (err instanceof NotImplementedError)
                return Store.showToastError(err.message);

            return Store.showToastError();
        }

        finally {
            await Store.set({ loader: false });
        }
    }

    public static onClick(doAction: () => Promise<void>): (() => void) {
        return async () => await Store.onLoadindig(doAction);
    }

    public static async refresh(): Promise<void> {
        let user = await ControllerUser.getLoggedUser();
        let tasks = user == null ? null : await ControllerTask.getAll();
        await Store.set({
            logged: {
                active: "list",
                user: user,
                tasks: tasks,
                taskNew: null,
            },

            unlogged: {
                active: "signIn",
                signIn: null,
                signUp: null,
            },
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

    /* Setter - Logged
    -----------------------------------*/
    public static async setLogged(data: Types.RecursivePartial<IStore["logged"]>): Promise<void> {
        await Store.set({ logged: data });
    }

    public static async setLoggedUser(data: Types.RecursivePartial<IStore["logged"]["user"]>): Promise<void> {
        await Store.setLogged({ user: data });
    }

    public static async setLoggedTasks(data: Types.RecursivePartial<IStore["logged"]["tasks"]>): Promise<void> {
        await Store.setLogged({ tasks: data });
    }

    public static async setLoggedTaskNew(data: Types.RecursivePartial<IStore["logged"]["taskNew"]>): Promise<void> {
        await Store.setLogged({ taskNew: data });
    }

    /* Setter - Unlogged
    -----------------------------------*/
    public static async setUnlogged(data: Types.RecursivePartial<IStore["unlogged"]>): Promise<void> {
        await Store.set({ unlogged: data });
    }

    public static async setUnloggedSignIn(data: Types.RecursivePartial<IStore["unlogged"]["signIn"]>): Promise<void> {
        await Store.setUnlogged({ signIn: data });
    }

    public static async setUnloggedSignUp(data: Types.RecursivePartial<IStore["unlogged"]["signUp"]>): Promise<void> {
        await Store.setUnlogged({ signUp: data });
    }
}