import { Migration } from '@mikro-orm/migrations';

export class Migration20230521195529_Initial extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "name" varchar(255) not null, "fav_actor" varchar(255) null, "fav_film" varchar(255) null, "fav_tvshow" varchar(255) null);');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
  }

}
