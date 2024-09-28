import React from "react";
import { IStore, Store } from "classes/Store";


export default class App extends React.Component<{}, IStore> {

    constructor(props) {
        super(props);
        this.state = {
            ...Store.init(),
            loader: {
                full: true,
                navbar: false,
                viewport: false,
            },
        };

        Store.setComponentApp(this);
    }

    public render(): React.ReactNode {
        return <>
            CIAO
        </>;
    }
}