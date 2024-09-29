import React from "react";
import { IPages, IStore, Store } from "classes/Store";
import { Button, Dimmer, Form, Header, List, Loader, Segment } from "semantic-ui-react";
import { ControllerUser } from "controller/ControllerUser";
import PageUser from "./PageUser";
import PageTask from "./PageTask";

export default class App extends React.Component<{}, IStore> {

    constructor(props) {
        super(props);
        this.state = {
            ...Store.init(),
            loader: true,
        };

        Store.setComponentApp(this);
    }

	public override async componentDidMount(): Promise<void> {
        await Store.onLoadindig(
            async () => {
                let user = await ControllerUser.getLoggedUser();
    
                await Store.set({
                    user: user,
                });
            } 
        );
	}

    public render(): React.ReactNode {
        return <>
			{Store.state.loader == true && <Dimmer
				active
				inverted
				style={{
                    zIndex: 1000,
                    backgroundColor: "white",
                }}
            >
				<Loader inverted size="large" />
			</Dimmer>}

            <PageUser />
            <PageTask />
        </>;
    }
}