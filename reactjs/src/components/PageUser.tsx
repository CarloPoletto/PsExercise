import React from "react";
import { Store, IStore } from "classes/Store";
import { Form, Header, List, Segment } from "semantic-ui-react";
import { ControllerUser } from "controller/ControllerUser";

export default class PageUser extends React.Component {
    
    private getPage(active: IStore["unlogged"]["active"], title: string, content: React.ReactNode): React.ReactNode {
        if(Store.state.unlogged.active != active)
            return null;
    
        return <Segment secondary padded="very" className="centerXY" style={{ maxWidth: 500 }}>
            <List horizontal style={{ width: "100%" }}>
                <Header as='h1' style={{ textAlign: "center" }}>{title}</Header>
                {content}
            </List>
        </Segment>;
    }

    private getPageSignIn(): React.ReactNode {
        return this.getPage("signIn", "Sign In", <Form>
            <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Email"
                value={Store.state.unlogged.signIn?.email ?? ""}
                onChange={event => Store.setUnloggedSignIn({ email: event.target.value })}
            />
            
            <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={Store.state.signIn?.password ?? ""}
                onChange={event => Store.setUnloggedSignIn({ password: event.target.value })}
            />

            <Form.Button
                fluid
                primary
                icon="check"
                labelPosition="left"
                content="Confirm"
                onClick={Store.onClick(
                    async () => {
                        await ControllerUser.signIn({
                            email: Store.state.signIn.email,
                            password: Store.state.signIn.password,
                        });
    
                        await Store.refresh();
                    }
                )}
            />

            <Form.Button
                fluid
                icon="reply"
                labelPosition="left"
                content="Sign Up"
                onClick={Store.onClick(
                    async () => {
                        await Store.set(Store.init());
                        await Store.setUnlogged({ active: "signUp" });
                    }
                )}
            />
        </Form>);
    }

    private getPageSignUp(): React.ReactNode {
        return this.getPage("signUp", "Sign Up", <Form>
            <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Email"
                value={Store.state.signUp?.email ?? ""}
                onChange={event => Store.setUnloggedSignUp({ email: event.target.value })}
            />
            
            <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={Store.state.signUp?.password ?? ""}
                onChange={event => Store.setUnloggedSignUp({ password: event.target.value })}
            />

            <Form.Button
                fluid
                primary
                icon="check"
                labelPosition="left"
                content="Confirm"
                onClick={Store.onClick(
                    async () => {
                        await ControllerUser.signUp({
                            email: Store.state.unlogged.signUp?.email,
                            password: Store.state.unlogged.signUp?.password,
                        });
    
                        await Store.refresh();
                    }
                )}
            />

            <Form.Button
                fluid
                icon="reply"
                labelPosition="left"
                content="Sign In"
                onClick={Store.onClick(
                    async () => {
                        await Store.set(Store.init());
                        await Store.setUnlogged({ active: "signIn" });
                    }
                )}
            />
        </Form>);
    }

    public render(): React.ReactNode {
        if(Store.state.user != null)
            return null;
        
        return <>
            {this.getPageSignIn()}
            {this.getPageSignUp()}
        </>;
    }
}