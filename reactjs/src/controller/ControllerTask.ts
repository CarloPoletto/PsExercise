import { AController } from "./Controller";
import { Task, TaskDto } from "models/Task";

export class ControllerTask extends AController {

    public static async getAll(): Promise<Task[]> {
        let response = await ControllerTask.apiGet(`Task/GetAll`);
        let res = await response.body as TaskDto[];
        return res == null ? null : res.map(el => new Task(el));
    }

    public static async delete(task: Task): Promise<void> {
        await ControllerTask.apiDel(`Task/Delete`, task.id);
    }

    public static async create(taskDto: TaskDto): Promise<void> {
        await ControllerTask.apiPost(`Task/Create`, taskDto);
    }
}
