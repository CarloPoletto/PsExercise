import React from "react";
import * as Utils from "common/Utils";
import { Store } from "classes/Store";
import { ControllerUser } from "controller/ControllerUser";
import { Button, Form, Grid, GridColumn, GridRow, Header, Icon, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import { ControllerTask } from "controller/ControllerTask";

const PRIORITY = [
    { value: 0, text: "Low",  },
    { value: 1, text: "Medium" },
    { value: 2, text: "High" },
];

export default class PageTask extends React.Component {

    private getTask(content: React.ReactNode): React.ReactNode {
        return <Grid verticalAlign='middle'>
            <GridRow columns={2}>
                <GridColumn verticalAlign="middle" textAlign="left">
                    {Store.state.logged.active == "new" && <>
                        <Button
                            primary
                            icon="reply"
                            onClick={Store.onClick(
                                async () => Store.setLogged({ active: "list" })
                            )}
                        />
                    </>}
                    {Store.state.logged.active == "list" && <>
                        <Button
                            primary
                            icon="plus"
                            onClick={Store.onClick(
                                async () => Store.setLogged({ active: "new" })
                            )}
                        />
                        <Button
                            primary
                            icon="filter"
                            onClick={Store.onClick(
                                async () => {
                                    console.log("ciao");
                                }
                            )}
                        />
                    </>}
                    
                </GridColumn>
                <GridColumn verticalAlign="middle" textAlign="right">
                    <Header as='h3' style={{ display: "inline-block", margin: "0 0.5em" }}>{Store.state.user.email}</Header>
                    <Button
                        color="red"
                        icon="sign-out alternate"
                        onClick={Store.onClick(
                            async () => {
                                await ControllerUser.signOut();

                                await Store.setLogged({
                                    user: await ControllerUser.getLoggedUser(),
                                    tasks: null,
                                });
                            }
                        )}
                    />
                </GridColumn>
            </GridRow>

            <GridRow columns={1}>
                <GridColumn>
                    {content}
                </GridColumn>
            </GridRow>
        </Grid>;
    }

    private getTaskList(): React.ReactNode {
        if(Store.state.logged.active != "list")
            return null;

        console.log(Store.state.logged.tasks);

        return this.getTask(
            <Table celled sortable compact striped selectable unstackable>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell textAlign="center">Title</TableHeaderCell>
                        <TableHeaderCell textAlign="center">Description</TableHeaderCell>
                        <TableHeaderCell textAlign="center" style={{ width: 100 }}>Start Date</TableHeaderCell>
                        <TableHeaderCell textAlign="center" style={{ width: 100 }}>Due Date</TableHeaderCell>
                        <TableHeaderCell textAlign="center" style={{ width: 100 }}>Priority</TableHeaderCell>
                        <TableHeaderCell textAlign="center" style={{ width: 100 }}>Completed</TableHeaderCell>
                        <TableHeaderCell textAlign="center" style={{ width: 100 }} />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Store.state.logged.tasks?.map(task => {
                        return <TableRow key={task.id}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.description}</TableCell>
                            <TableCell textAlign="center">{Utils.formatDateToScreen(task.creationTime)}</TableCell>
                            <TableCell textAlign="center">{Utils.formatDateToScreen(task.expirationDate)}</TableCell>
                            <TableCell textAlign="center">{PRIORITY.find(el => el.value == task.priority).text}</TableCell>
                            <TableCell textAlign="center"><Icon name={task.completed ? "check" : "times"} /></TableCell>
                            <TableCell textAlign="center">
                                <Button
                                    primary
                                    compact
                                    icon="pencil"
                                    size="small"
                                    onClick={Store.onClick(
                                        async () => { console.log("ciao"); }
                                    )}
                                />
                                <Button
                                    compact
                                    color="red"
                                    icon="trash"
                                    size="small"
                                    onClick={Store.onClick(
                                        async () => {
                                            await ControllerTask.delete(task);
                                            await Store.refresh();
                                        }
                                    )}
                                />
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        );
    }

    private getTaskNew(): React.ReactNode {
        if(Store.state.logged.active != "new")
            return null;
        
        return this.getTask(
            <Form>
                <Form.Input
                    fluid
                    label="Title"
                    placeholder="Title"
                    value={Store.state.logged.taskNew?.title ?? ""}
                    onChange={event => Store.setLoggedTaskNew({ title: event.target.value })}
                />
                
                <Form.Input
                    fluid
                    label="Description"
                    placeholder="Description"
                    value={Store.state.logged.taskNew?.description ?? ""}
                    onChange={event => Store.setLoggedTaskNew({ description: event.target.value })}
                />
                
                <Form.Input
                    fluid
                    label="Expiration Dat"
                    placeholder="Expiration Date"
                    value={Store.state.logged.taskNew?.expirationDate ?? ""}
                    onChange={event => Store.setLoggedTaskNew({ expirationDate: event.target.value })}
                />

                <Form.Dropdown
                    label="Priority"
                    placeholder="Priority"
                    fluid
                    selection
                    options={PRIORITY}
                    value={Store.state.logged.taskNew?.priority ?? 0}
                    onChange={(event, data) => Store.setLoggedTaskNew({ priority: data.value as number })}
                />

                <Form.Button
                    fluid
                    primary
                    icon="check"
                    labelPosition="left"
                    content="Confirm"
                    onClick={Store.onClick(
                        async () => {
                            await ControllerTask.create({
                                ...Store.state.logged.taskNew,
                                expirationDate: Utils.formatDate(Store.state.logged.taskNew.expirationDate, "YYYY-MM-DD"),
                            });
                            await Store.refresh();
                        }
                    )}
                />
            </Form>
        );
    }
    
    public render(): React.ReactNode {
        if(Store.state.user == null)
            return null;

        return <>
            {this.getTaskList()}
            {this.getTaskNew()}
        </>;
    }
}