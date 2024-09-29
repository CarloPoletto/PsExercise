import React from "react";
import { IPages, Store } from "classes/Store";
import { Form, Header, List, Segment } from "semantic-ui-react";
import { ControllerUser } from "controller/ControllerUser";

export default class PageUser extends React.Component {
    
    private getPage(page: IPages, title: string, content: React.ReactNode): React.ReactNode {
        if(Store.state.active != page)
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
                value={Store.state.pages.signIn.email ?? ""}
                onChange={event => Store.setPagesSignIn({ email: event.target.value })}
            />
            
            <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={Store.state.pages.signIn.password ?? ""}
                onChange={event => Store.setPagesSignIn({ password: event.target.value })}
            />

            <Form.Button
                fluid
                primary
                icon="check"
                labelPosition="left"
                content="Confirm"
                onClick={Store.onClick(
                    async () => {
                        console.log(Store.state.pages.signIn.email);
                        console.log(Store.state.pages.signIn.password);
    
                        await ControllerUser.signIn({
                            email: Store.state.pages.signIn.email,
                            password: Store.state.pages.signIn.password,
                        });
    
                        await Store.set({
                            user: await ControllerUser.getLoggedUser(),
                            pages: Store.init().pages,
                        });
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
                        await Store.set({
                            ...Store.init(),
                            active: "signUp",
                        });
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
                value={Store.state.pages.signUp.email ?? ""}
                onChange={event => Store.setPagesSignUp({ email: event.target.value })}
            />
            
            <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={Store.state.pages.signUp.password ?? ""}
                onChange={event => Store.setPagesSignUp({ password: event.target.value })}
            />

            <Form.Button
                fluid
                primary
                icon="check"
                labelPosition="left"
                content="Confirm"
                onClick={Store.onClick(
                    async () => {
                        console.log(Store.state.pages.signUp.email);
                        console.log(Store.state.pages.signUp.password);
    
                        await ControllerUser.signUp({
                            email: Store.state.pages.signUp.email,
                            password: Store.state.pages.signUp.password,
                        });
    
                        await Store.set({
                            user: await ControllerUser.getLoggedUser(),
                            pages: Store.init().pages,
                        });
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
                        await Store.set({
                            ...Store.init(),
                            active: "signIn",
                        });
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