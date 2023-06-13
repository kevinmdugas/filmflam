import { Migration } from '@mikro-orm/migrations';

export class Migration20230610055843_TitleRatingType extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "title" add column "rating_type" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "title" drop column "rating_type";');
  }

}
