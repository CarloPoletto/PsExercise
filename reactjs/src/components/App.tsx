import React from "react";
import { IPages, IStore, Store } from "classes/Store";
import { Button, Divider, Form, FormInput, Grid, GridColumn, List, Segment } from "semantic-ui-react";

export default class App extends React.Component<{}, IStore> {

    constructor(props) {
        super(props);
        this.state = {
            ...Store.init(),
            loader: true,
        };

        Store.setComponentApp(this);
    }

    private getPage(page: IPages, content: React.ReactNode): React.ReactNode {
        if(Store.state.active != page)
            return null;
    
        return <Segment secondary padded="very" className="centerXY" style={{ maxWidth: 500 }}>
            <List horizontal style={{ width: "100%" }}>
                {content}
            </List>
        </Segment>;
    }

    private getPageHome(): React.ReactNode {
        return this.getPage("home", <Form>
            <Button
                fluid
                primary
                icon="check"
                labelPosition="left"
                content="Sign In"
                onClick={async () => Store.set({ active: "signIn" })}
            />
            <Button
                fluid
                primary
                icon="check"
                labelPosition="left"
                content="Sign Up"
                onClick={async () => Store.set({ active: "signUp" })}
            />
        </Form>);
    }

    private getPageSignIn(): React.ReactNode {
        return this.getPage("signIn", <Form>
            <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Email"
            />
            
            <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
            />

            <Button
                fluid
                primary
                icon="check"
                labelPosition="left"
                content="Confirm"
                onClick={async () => console.log("ciao")} />
        </Form>);
    }

    private getPageSignUp(): React.ReactNode {
        return this.getPage("signUp", <Form>
            <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Email"
            />
            
            <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
            />

            <Button
                fluid
                primary
                icon="check"
                labelPosition="left"
                content="Confirm"
                onClick={async () => console.log("ciao")} />
        </Form>);
    }

    public render(): React.ReactNode {
        return <>
            {this.getPageHome()}
            {this.getPageSignIn()}
            {this.getPageSignUp()}
        </>;
    }
}