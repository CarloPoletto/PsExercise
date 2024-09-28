export class UserDto {
	public readonly id: number;
	public readonly creationTime: string;
	public readonly email: string;
}

export class User {
	public readonly id: number;
	public readonly creationTime: Date;
	public readonly name: string;
}