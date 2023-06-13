import { Migration } from "@mikro-orm/migrations";

export class Migration20230610220125_TitleGenreYear extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table "title" add column "year" varchar(255) not null, add column "genres" text[] not null;'
		);
	}

	async down(): Promise<void> {
		this.addSql('alter table "title" drop column "year";');
		this.addSql('alter table "title" drop column "genres";');
	}
}
