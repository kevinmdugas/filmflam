import {FastifyInstance, FastifyReply} from "fastify";
import {CreateUserBody, ParamType, RatingType, UpdateUserBody} from "../types.js";
import {User, UserRole} from "../db/entities/User.js";
import {Title} from "../db/entities/Title.js";
import {Statement} from "../db/entities/Statement.js";
import {EntityManager} from "@mikro-orm/postgresql";

export function UserRoutes(app: FastifyInstance) {
    // Create user
    app.post<{ Body: CreateUserBody }>("/users", async (req, reply: FastifyReply) => {
        // Fish data out of request (auto converts from json)
        const { email, name, favActor, favFilm, favTVShow, password } = req.body;
        try {
            // Get our manager from the plugin we wrote
            const newUser = await req.em.create(User, {
                email,
                name,
                favActor,
                favFilm,
                favTVShow,
                role: UserRole.USER,
                password
            });
            // This will immediately update the real database.  You can store up several changes and flush only once
            // NOTE THE AWAIT -- do not forget it or weirdness abounds
            await req.em.flush();
            return reply.send(newUser);
        } catch (err) {
            return reply.status(500).send({ message: err.message });
        }
    });

    // Get all users
    app.get("/users", async (req, reply) => {
        try {
            const theUser = await req.em.find(User, {});
            reply.send(theUser);
        } catch (err) {
            reply.status(500).send(err);
        }
    });

    // Retrieve user
    app.search("/users", async (req, reply) => {
        const { id } = req.body;

        try {
            const theUser = await req.em.findOneOrFail(User, id, {strict: true});
            reply.send(theUser);
        } catch (err) {
            reply.status(500).send(err);
        }
    });

    // Update user
    app.put<{ Body: UpdateUserBody }>("/users", async (req, reply) => {
        const { id, name, favActor, favFilm, favTVShow } = req.body;

        const userToChange = await req.em.findOneOrFail(User, id, {strict: true});
        userToChange.name = name;
        userToChange.favActor = favActor;
        userToChange.favFilm = favFilm;
        userToChange.favTVShow = favTVShow;

        await req.em.flush();
        reply.send(userToChange);
    });

    // Delete user
    app.delete<{ Body: { my_id: number; id_to_delete: number, password: string } }>("/users", async (req, reply) => {
        const { my_id, id_to_delete, password } = req.body;

        try{
            const me = await req.em.findOneOrFail(User, my_id, {strict: true});

            if (me.password !== password) {
                return reply.status(401).send();
            }

            if (me.role === UserRole.USER) {
                return reply.status(401).send({ "message": "You are not an admin!"})
            }

            const userToDelete = await req.em.findOneOrFail(User, id_to_delete, {strict: true});

            if (userToDelete.role === UserRole.ADMIN) {
                return reply.status(401).send({"message": "You do not have enough privileges to delete an Admin!"})
            }
            await req.em.remove(userToDelete).flush();
            return reply.send(userToDelete);
        } catch(err) {
            reply.status(500).send(err);
        }
    });

    app.post<{ Body: { userId: number | null, titleId: string } }>("/reviews", async (req, reply) => {
        const { userId, titleId } = req.body;
        try{
            const foundTitle = await req.em.findOneOrFail(Title, titleId, {strict: true})
            const possibleMainStmts = await req.em.find(Statement, {
                paramType: "main",
                ratingType: foundTitle.ratingType,
            });
            let randomOffset = Math.floor(Math.random() * possibleMainStmts.length);
            const mainPreds = possibleMainStmts[randomOffset].predicates;
            let response = { mainStmt: [mainPreds[0], foundTitle.primaryTitle, mainPreds[1]] }
            if (userId) {
                const theUser = await req.em.findOneOrFail(User, userId, {strict: true});
                const addonStmt = await getAddonStatement(req.em, theUser, foundTitle.ratingType);
                response["addonStmt"] = addonStmt;
            }
            return reply.send(response)
        } catch (err) {
            reply.status(500).send(err);
        }
    });
}

async function getAddonStatement(em: EntityManager, theUser: User, ratingType: RatingType) {
    let possibleParams: ParamType[] = ["favFilm", "favTVShow", "favActor"]
    let index = Math.floor(Math.random() * possibleParams.length);
    let paramType: ParamType | null = null;
    let favValue = "";
    for (let i = 0; i < possibleParams.length; i++) {
        if (possibleParams[index] == "favFilm" && theUser.favFilm) {
            paramType = "favFilm";
            favValue = theUser.favFilm;
            break;
        }
        else if (possibleParams[index] == "favTVShow" && theUser.favTVShow) {
            paramType = "favTVShow";
            favValue = theUser.favTVShow;
            break;
        }
        else if (possibleParams[index] == "favActor" && theUser.favActor) {
            paramType = "favActor";
            favValue = theUser.favActor;
            break;
        }
        index = (index + 1) % possibleParams.length;
    }

    console.log(`index: ${index}, param: ${paramType}, favVal: ${favValue}`)
    if (paramType){
        const stmts = await em.find(Statement, {
            paramType: paramType,
            ratingType: ratingType,
        });
        index = Math.floor(Math.random() * stmts.length);
        const addonPreds = stmts[index].predicates;
        return [addonPreds[0], favValue, addonPreds[1]];
    }
    return "";
}