import { Migration } from "@mikro-orm/migrations";

export class Migration20230612195335_UserLoginUID extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table "users" add column "login_uid" varchar(255) not null;');
		this.addSql(
			'alter table "users" add constraint "users_login_uid_unique" unique ("login_uid");'
		);
	}

	async down(): Promise<void> {
		this.addSql('alter table "users" drop constraint "users_login_uid_unique";');
		this.addSql('alter table "users" drop column "login_uid";');
	}
}
