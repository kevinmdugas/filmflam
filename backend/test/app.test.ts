import 'chai/register-should.js';  // Using Should style

import {test, teardown} from "tap";
import {faker} from "@faker-js/faker";
import app from '../src/app.js';
import {User} from "../src/db/entities/User.js";

// Cleanup, runs after ALL this file's tests have finished!
teardown( () => app.close());

test('Listing all users from /dbTest', async () => {
    const response = await app.inject({
        method: 'GET',
        url: '/dbTest'
    });

    response.statusCode.should.equal(200);
});

test('Creating new user', async () => {

    const payload = {
        name: "Testname",
        email: "testemail@email.com",
        favActor: faker.person.fullName(),
        favTVShow: "Fake show",
        favMovie: "Fake movie"
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
    resPayload.name.should.equal("Testname");
    resPayload.favActor.should.equal(payload.favActor);
});
