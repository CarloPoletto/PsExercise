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
}