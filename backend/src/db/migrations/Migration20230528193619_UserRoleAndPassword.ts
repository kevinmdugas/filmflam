import { Migration } from "@mikro-orm/migrations";

export class Migration20230528193619_UserRoleAndPassword extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table "users" add column "password" varchar(255) not null, add column "role" text check ("role" in (\'Admin\', \'User\')) not null;'
		);
	}

	async down(): Promise<void> {
		this.addSql('alter table "users" drop column "password";');
		this.addSql('alter table "users" drop column "role";');
	}
}
