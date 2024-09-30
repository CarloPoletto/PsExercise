import * as Utils from "common/Utils";

export class UserDto {
	public readonly id: number;
	public readonly creationTime: string;
	public readonly email: string;
}

export class User {
	public readonly id: number;
	public readonly creationTime: Date;
	public readonly email: string;

	constructor(user: UserDto = null) {
		if(user != null) {
			this.id = user.id;
			this.creationTime = Utils.stringToDate(user.creationTime);
			this.email = user.email;
		}
    }
}