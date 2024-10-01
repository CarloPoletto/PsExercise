import * as Utils from "misc/Utils";

export class TaskDto {
	public readonly id: number;
	public readonly creationTime: string;
	public readonly expirationDate: string;
	public readonly userId: number;
	public readonly title: string;
	public readonly description: string;
	public readonly completed: boolean;
	public readonly priority: number;
}

export class Task {
	public readonly id: number;
	public readonly creationTime: Date;
	public readonly expirationDate: Date;
	public readonly userId: number;
	public readonly title: string;
	public readonly description: string;
	public readonly completed: boolean;
	public readonly priority: number;

	constructor(task: TaskDto = null) {
		if(task != null) {
			this.id = task.id;
			this.creationTime = Utils.stringToDate(task.creationTime);
			this.expirationDate = Utils.stringToDate(task.expirationDate);
			this.userId = task.userId;
			this.title = task.title;
			this.description = task.description;
			this.completed = task.completed;
			this.priority = task.priority;
		}
    }
}