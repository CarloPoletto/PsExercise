import React from "react";
import * as Utils from "common/Utils";
import { Store } from "common/Store";
import { ControllerUser } from "controller/ControllerUser";
import { Button, Form, Grid, GridColumn, GridRow, Header, Icon, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import { ControllerTask } from "controller/ControllerTask";
import { Task } from "models/Task";
import { NotImplementedError, ToastError } from "common/Errors";

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
                                async () => { throw new NotImplementedError(); }
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
                                await Store.refresh();
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
        let reverseDirection = (direction) => {
            if (direction == null)
                return "ascending";

            if (direction == "ascending")
                return "descending";

            return "ascending";
        }

        let getTableHeaderCell = (key: keyof Task, title: string, width: number) => {
            let column = Store.state.logged.sorting?.column;
            let direction = Store.state.logged.sorting?.direction;
            return <TableHeaderCell
                textAlign="center"
                content={title}
                style={{ width: width }}
                sorted={(column != null && column == title) ? direction : null}
                onClick={async () => {
                    if(key == null)
                        return;
                    
                    let directionNew = column != title ? "ascending" : reverseDirection(direction);
                    await Store.setLogged({
                        sorting: { column: title, direction: directionNew },
                        tasks: await Store.state.logged.tasks.sort((a, b) => {
                            let value = a[key]?.toString().localeCompare(b[key]?.toString());
                            return directionNew == "ascending" ? value : value - (2 * value);
                        }),
                    })
                }}
            />
        }

        if(Store.state.logged.active != "list")
            return null;

        return this.getTask(
            <Table celled sortable compact striped selectable unstackable>
                <TableHeader>
                    <TableRow>
                        {getTableHeaderCell("title", "Title", null)}
                        {getTableHeaderCell("description", "Description", null)}
                        {getTableHeaderCell("creationTime", "Start Date", 100)}
                        {getTableHeaderCell("expirationDate", "Due Date", 100)}
                        {getTableHeaderCell("priority", "Priority", 100)}
                        {getTableHeaderCell("completed", "Completed", 100)}
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
                                        async () => { throw new NotImplementedError(); }
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
                    label="Expiration Date"
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
                            if(Store.state.logged.taskNew?.title == null || Store.state.logged.taskNew?.title == "")
                                throw new ToastError("Invalid title");

                            if(Store.state.logged.taskNew?.description == null || Store.state.logged.taskNew?.description == "")
                                throw new ToastError("Invalid description");

                            if(Store.state.logged.taskNew?.expirationDate == null || Store.state.logged.taskNew?.expirationDate == "" || !/^[0-9]{1,2}[\/|-][0-9]{1,2}[\/|-][0-9]{4}$/.test(Store.state.logged.taskNew?.expirationDate))
                                throw new ToastError("Invalid expiration date");
                            
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