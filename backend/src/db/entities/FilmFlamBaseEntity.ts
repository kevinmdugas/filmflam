import { BaseEntity, PrimaryKey, Property } from "@mikro-orm/core";

export class FilmFlamBaseEntity extends BaseEntity<FilmFlamBaseEntity, "id"> {
	@PrimaryKey()
	id!: number;

	@Property()
	created_at = new Date();

	@Property({ onUpdate: () => new Date() })
	updated_at = new Date();

	@Property({ nullable: true })
	deleted_at?: Date;
}
