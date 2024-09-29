import React from "react";
import { IPages, Store } from "classes/Store";
import { ControllerUser } from "controller/ControllerUser";
import { Button } from "semantic-ui-react";

export default class PageUser extends React.Component {
    
    public render(): React.ReactNode {
        if(Store.state.user == null)
            return null;
        
        return <Button
            fluid
            primary
            icon="check"
            labelPosition="left"
            content="Logout"
            onClick={Store.onClick(
                    async () => {
                        console.log(Store.state.pages.signUp.email);
                        console.log(Store.state.pages.signUp.password);
        
                        await ControllerUser.signOut();
        
                        await Store.set({
                            user: await ControllerUser.getLoggedUser(),
                            pages: Store.init().pages,
                        });
                    }
                )}
            />;
    }
}