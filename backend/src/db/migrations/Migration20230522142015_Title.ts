import { Migration } from '@mikro-orm/migrations';

export class Migration20230522142015_Title extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "title" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "title" alter column "average_rating" type varchar(255) using ("average_rating"::varchar(255));');
    this.addSql('alter table "title" drop column "created_at";');
    this.addSql('alter table "title" drop column "updated_at";');
    this.addSql('alter table "title" alter column "id" drop default;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "title" add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;');
    this.addSql('alter table "title" alter column "id" type int using ("id"::int);');
    this.addSql('alter table "title" alter column "average_rating" type int using ("average_rating"::int);');
    this.addSql('create sequence if not exists "title_id_seq";');
    this.addSql('select setval(\'title_id_seq\', (select max("id") from "title"));');
    this.addSql('alter table "title" alter column "id" set default nextval(\'title_id_seq\');');
  }

}
