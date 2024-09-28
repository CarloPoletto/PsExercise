import App from "components/App";
import merge from "deepmerge";
import * as Types from "../common/Types";
import * as Utils from "../common/Utils";
import { isPlainObject } from "is-plain-object";

export interface IStore {
    readonly loader: boolean;
    readonly active: IPages;
    readonly pages: {
        readonly home: {};
        readonly signIn: {};
        readonly signUp: {};
    };
}

export type IPages = keyof IStore["pages"];

export class Store implements IStore {
    
    private static singleton: Store = new Store();
    private components = { app: null as App };

    public get loader(): boolean { return this.components.app.state.loader; }
    public get active(): IPages { return this.components.app.state.active; }
    public get pages(): IStore["pages"] { return this.components.app.state.pages; }

    public static init(): IStore {
        return {
            loader: false,
            active: "home",
            pages: {
                home: {},
                signIn: {},
                signUp: {},
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
}