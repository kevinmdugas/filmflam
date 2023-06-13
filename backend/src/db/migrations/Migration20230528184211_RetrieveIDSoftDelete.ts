import { Migration } from "@mikro-orm/migrations";

export class Migration20230528184211_RetrieveIDSoftDelete extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table "statement" add column "deleted_at" timestamptz(0) null;');

		this.addSql('alter table "users" add column "deleted_at" timestamptz(0) null;');
	}

	async down(): Promise<void> {
		this.addSql('alter table "statement" drop column "deleted_at";');

		this.addSql('alter table "users" drop column "deleted_at";');
	}
}
