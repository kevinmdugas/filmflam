## Testing

- Before we go any further with MikroOrm, now that we have it set up, we need to add in testing.
- Testing is VERY easy, we only need a couple packages

- [ ] pnpm i -D chai tap @types/chai @types/tap @faker-js/faker
- [ ] add to package.json

```
"test": "NODE_NO_WARNINGS=1 tap test/",
.....

  "tap": {
    "node-arg": [
      "--loader=ts-node/esm"
    ],
    "coverage": false,
    "ts": true
  },

```

- [ ] Now we need a tests subdir for our tests to go, right next to ./src

Now we have a problem -- all our code is jumbled up in index.ts and there's no separation of our website code from our bootstrap code!  More importantly, for our testing, we don't want to run a "Real" server!  We want to fake it, like everything else in testing.  So we need our listening separated from our server.  Lets instead move our "site" things to app.ts

- [ ] Create src/app.ts and test/app.test.ts
- [ ] Move everything from index.ts except the listen to app.ts
```ts - app.ts
import Fastify, {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {User} from "./db/entities/User.js";
import {FastifyMikroOrmPlugin} from "./plugins/mikro.js";

import config from "./db/mikro-orm.config.ts";

const app: FastifyInstance = Fastify();

await app.register(FastifyMikroOrmPlugin, config);

app.get("/hello", async(req: FastifyRequest, reply: FastifyReply) => {
	return 'hello';
});

app.get("/hello2", async(req, reply) => {
	return 'hello2';
});

app.get("/dbTest", async (req, reply) => {
	return req.em.find(User, {});
});

export default app;

```

- [ ] Now we can add a basic test
```ts
import 'chai/register-should.js';  // Using Should style

import {test, teardown} from "tap";
import {faker} from "@faker-js/faker";
import app from '../src/app.js';


// Cleanup, runs after ALL this file's tests have finished!
teardown( () => app.close());

test('requests the "/hello" route', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/hello'
  });
  
  response.statusCode.should.equal(200);
  response.body.should.equal("hello");
});

test('requests the "/hello2" route', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/hello2'
  });
  
  response.statusCode.should.equal(200);
  response.body.should.equal("hello2");
});

test('Listing all users from /dbTest', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/dbTest'
  });
  
  response.statusCode.should.equal(200);
});


```

Now we're also testing our MikroORM setup.  We dont have any users in our database yet, so we expect our length returned to be zero!  We can now do a bit of TDD as we test our new MikroORM setup we wrote last class, and let this test guide us.

- [ ] First, lets reset our database to a completely fresh state
	- [ ] docker compose down
	- [ ] docker rm volumes
	- [ ] docker compose up/click in jetbrains
- [ ] Now we can run our test!
	- [ ] pnpm test

Uh oh what happened?  We blew up on the database status code.  If we look at our Docker logs for Postgres, we can see we're missing a user table entirely.  That makes sense, as we've not done anything to the database yet! 

- [ ] Lets go ahead and open a connection to Postgres from jetbrains so we can watch it indepedently of our code.

We need to set up the schema, or its tables/fields, before we can start using the database itself.  We could do this manually, but that is painful and prone to errors.  Therefore, for now, we're going to have MikroORM internally manage our database for us.  Every time we change our Entities or data models, we'll update the database itself to match.

- [ ] We're going to use MikroORM's cli for this.
	- [ ] pnpm i @mikro-orm/cli

This CLI interfaces with our same mikro-orm config file.  We can view its possibilities from MikroORM's documentation here https://mikro-orm.io/docs/installation under Setting up the Commandline Tool

## WARNING 
- We are using ECMA modules, so our CLI is slightly differently named.  Instead of mikro-orm it's mikro-orm-esm

We only care about schema:update right now
- [ ] pnpm schema:update
- [ ] view in jetbrains
- [ ] Add name field to User
- [ ] Add @Unique() over email below @Property
- [ ] and schema:update again
- [ ] Add a new user to the database and query console look for it
	- [ ] uh oh, this table can't be called user, lets change it to users

`@Entity({tableName: "users"})
`export class User extends BaseEntity 

- [ ] Add petType: string to User and update again
- [ ] Go look at users in the database

It won't let us update, because now our database has data in it.  Our added petType! can't be null, but if we add that column, ALL of the items already in the database will be null!  So we instead have to realize that we cannot "Update" a schema when we have conflicting data already in the database.

 - [ ]   "s:drop": "mikro-orm-esm schema:drop --run"
 - [ ] Update again and it works fine, but we're missing data! Dropping dropped it, too, which is why we can now update.

# Seeding

Seeding is how we'll add basic or test data to our db automatically after we drop our database.

- [ ] make new `seeders` subdir
- [ ] pnpm i @mikro-orm/seeder

### Adjusting config - 

- [ ] Rename to mikro-orm.config.ts
- [ ] change it at the bottom of package.json
- [ ] Add seeder section
```ts
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, "seeders");
const entitiesJSPath = path.join(__dirname, "..", "..", "build", "db", "entities");
const entitiesTSPath = path.join(__dirname, "entities");


.......
	entities: [entitiesJSPath],
	entitiesTs: [entitiesTSPath],

.......

seeder: {
		pathTs: seedPath, // path to the folder with seeders
		defaultSeeder: 'DatabaseSeeder', // default seeder class name
		glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
		emit: 'ts', // seeder generation mode
	},
```

- [ ] Add seed command to package.json `"seed:create": "mikro-orm-esm seeder:create "`
- [ ] Test by adding Database Seeder `pnpm seed:create DatabaseSeeder`
- [ ] Same for UserSeeder
- [ ] DatabaseSeeder merely calls all the others
```ts
async run(em: EntityManager): Promise<void> {
		return this.call(em, [
			UserSeeder
		]);
	}
```

- [ ] UserSeeder creates us exactly 1 new user
```ts
async run(em: EntityManager): Promise<void> {
		em.create(User, {
			name: "Spot",
			email: "email@email.com",
			petType: "Dog"
		});
	}
```

- [ ] Now we can execute the entire flow as a single script
- [ ] `"db:reset": "pnpm db:drop && pnpm db:update && pnpm seed:run" `
- [ ] Now we can clean up some by moving our routes out of app.ts and into a plugin just for Routes
```ts - routes.ts
// Routes.ts
import {User} from "./db/entities/User.js";
import { FastifyInstance, FastifyReply, FastifyRequest} from "fastify";


async function DoggrRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during route construction");
	}
  
  app.get("/hello", async(_req: FastifyRequest, _reply: FastifyReply) => {
	return 'hello';
  });
  
  app.get("/hello2", async(_req, _reply) => {
	return 'hello2';
  });
  
  app.get("/dbTest", async (req, _reply) => {
	return req.em.find(User, {});
  });
}

export default DoggrRoutes;

```

- [ ] and in app.ts
```ts
await app.register(DoggrRoutes);

```

- First we need to look at how we'll pass this data to the server.  It comes in JSON form, so that's what we're going to expect

```ts
 app.post("/users", async (req, reply: FastifyReply) => {
	// Fish data out of request (auto converts from json)
	const {name, email, petType} = req.body;
	
	try {
	  // Get our manager from the plugin we wrote
	  const newUser = await req.em.create(User, {
		name,
		email,
		petType
	  });
	
	  // This will immediately update the real database.  You can store up several changes and flush only once
	  // NOTE THE AWAIT -- do not forget it or weirdness abounds
	  await req.em.flush();
	  
	  console.log("Created new user:", newUser);
	  return reply.send(newUser);
	} catch (err) {
	  console.log("Failed to create new user: ", err.message);
	  return reply.status(500).send({ message: err.message});
	}
  });
}
```

- [ ] Only missing a single thing now!  We have no type safety, but Fastify makes it incredibly easy to add to both our request and response:

```ts
  app.post<{
	Body: {
	  name: string,
	  email: string,
	  petType: string,
	},
	Reply: {
	  message: string,
	}
  }>(
```

### DONE!  

We now have a fully functioning database, ORM, backend, and API.  The rest of our backend will look JUST like this!  


We can now go ahead and add a test for our user creation:

```ts
test('Creating new user', async () => {

  const payload = {
	name: "Testname",
	email: faker.internet.email(),
	petType: "Dog"
  };

  const response = await app.inject({
	method: 'POST',
	url: '/users',
	payload
  });
  
  response.statusCode.should.equal(200);
  response.payload.should.not.equal(payload);
  const resPayload = response.json();
  resPayload.email.should.equal(payload.email);
  resPayload.petType.should.equal("Dog");
});
```

