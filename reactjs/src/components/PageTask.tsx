import React from "react";
import * as Utils from "common/Utils";
import { Store } from "classes/Store";
import { ControllerUser } from "controller/ControllerUser";
import { Button, Grid, GridColumn, GridRow, Header, Icon, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import { ControllerTask } from "controller/ControllerTask";

export default class PageUser extends React.Component {
    
    public render(): React.ReactNode {
        if(Store.state.user == null)
            return null;
        
        return <Grid verticalAlign='middle'>
            <GridRow columns={2}>
                <GridColumn verticalAlign="middle" textAlign="left">
                    <Button
                        primary
                        icon="plus"
                        onClick={Store.onClick(
                            async () => {
                                console.log("ciao");
                            }
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
                </GridColumn>
                <GridColumn verticalAlign="middle" textAlign="right">
                    <Header as='h3' style={{ display: "inline-block", margin: "0 0.5em" }}>{Store.state.user.email}</Header>
                    <Button
                        color="red"
                        icon="sign-out alternate"
                        onClick={Store.onClick(
                            async () => {
                                await ControllerUser.signOut();

                                await Store.set({
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
                            {Store.state.tasks?.map(task => {
                                return <TableRow key={task.id}>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell textAlign="center">{Utils.formatDateToScreen(task.creationTime)}</TableCell>
                                    <TableCell textAlign="center">{Utils.formatDateToScreen(task.expirationDate)}</TableCell>
                                    <TableCell textAlign="center">{task.priority}</TableCell>
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
                </GridColumn>
            </GridRow>
        </Grid>
        ;
    }
}