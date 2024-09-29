import React from "react";
import { IStore, Store } from "classes/Store";
import { Dimmer, Loader } from "semantic-ui-react";
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
                await Store.refresh();
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