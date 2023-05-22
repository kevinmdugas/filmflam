import { Migration } from '@mikro-orm/migrations';

export class Migration20230522042303_Initial extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "statement" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "predicates" text[] not null, "param_type" varchar(255) not null, "rating_type" varchar(255) not null);');

    this.addSql('create table "title" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title_type" varchar(255) not null, "primary_title" varchar(255) not null, "average_rating" int not null);');

    this.addSql('create table "users" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "name" varchar(255) not null, "fav_actor" varchar(255) null, "fav_film" varchar(255) null, "fav_tvshow" varchar(255) null, "reviews" text[] null);');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
  }

}
