- housekeeping - virtualbox vm - https://drive.google.com/file/d/1FFoUqQJB-Z2EZBQ8Cb7EJQcqZQWK5yX9/view?usp=share_link

### ASYNC

This is really the only somewhat complex Javascript we're going to encounter that lots of people seemed unfamiliar with.  If you're confused about some other aspect of JS please ask!

- Before we start, we need a quick utility `pnpm i -g nodemon` which we'll use to run this js script `nodemon --quiet tinker.js`

- JS is SINGLE threaded - there is no threading here! Each of these happens sequentially always in the same order
```js
/* eslint-disable */  
// @ts-nocheck
console.log("hello");
console.log("World");
```

- This works fine in basic situations, but what if instead:
```js
console.log("Getting user")
let fooUser = RemoteDatabase.GetUser(1);
console.log("Got user")
```

-  What happens to my server now?  Everyone trying to use it has to wait. Every user. Until that database retthreade urns a result.  HTTP servers are supposed to serve hundreds of thousands of requests PER SECOND
- In C++ we might decide to thread - not in JS!  So we must instead use cooperative multitasking to "emulate" threads.  Interestingly, lots of modern languages are finding this a simpler means of threading as well via work-sharing queues.  JS's first go at these are known as callbacks:

```js
function GetUser(userId, finishedCallback) {
  let user = ActualGet(userId);
  finishedCallback(user);
}

let fooUser = RemoteDatabase.GetUser(1, (user) => {
	console.log("Finished getting the user and we're calling fooUser's fn");
	//do things with user
}
```

- This is synchronous still, but what if we give it a timeout?

```js
function GetUser(userId, finishedCallback) {
  let user = ActualGet(userId); // Pretend this takes a while (database query)
  setTimeout(() => finishedCallback(user), 5000);
}
```
- Now we've entered async land, this fn will return immediately, but finishedCallback won't happen for 5 seconds.
- Problems with this method: NESTED HELL
```js
function GetAllUserInfo(userId, getAllCB) {
	let info = GetUser(1, (user) => {
		if (user) GetUserCountry(user, (country) => {
			if (country) GetUserState(country, (state) => {
				if (state) GetUserCity(state, (city) => {  
			      if (city) console.log(city); //etc  
				})
			})
		})
	})
}
```

- Next iteration after callbacks: PROMISES
- Instead of callbacks, these work like irl promises - You ask for something, and I give you a promise that soon I'll give you what you asked for, but not quite yet.  You can then carry on with your work in the meantime while I finish up whatever I promised you.

```js
let userPromise = new Promise(function (resolve, reject) {
	let user = GetUser(1);	
	//could be false?
	if (user) resolve(user)
	else reject("User not found!");
})
```

- How does this help in our quest to reduce nesting?  Now we basically still have to check, right? 
- JS has a special set of Promise-related methods to help us! `then, catch, and finally`

```js
userPromise.then( result => {
	console.log("Promise completed successfully: ", result);
}).catch( error => {
	console.log("Promise was rejected: ", error);
}).finally( () => {
	console.log("Promise has completed");
})
```

- Lets see what this would look like in a real world "server" example:
```js

let netData = url => {  
  return new Promise (function (resolve, reject) {  
    let request = fetch(url)  
      .then( res => {  
        console.log(res);  
        if (res.status === 200) {  
          resolve(res);  
        } else {  
          reject(res.status);  
        }  
      })  
      .catch( err => {  
        console.error("unable to fetch: ", err);  
        reject(err);  
      });  
  })  
}

const apiurl = "https://catfact.ninja/fact";
netData(apiurl)
.then( res => console.log(res.json()))
.catch( err => console.log(err))
.finally(() => console.log("Done"));
```

- So lets look at what this printed -- Big blob of response, but also `Promise { <pending> }`  
-  What have we done wrong here?
- This is INCREDIBLY easy mistake to make that will totally confuse your bug hunting abilities.  `res.json()` ALSO returns a promise!  But our Console.log uses it as if it weren't.
- So we need to `then()` it, too!
```js
netData(apiurl)	
	.then( (res: Response): Promise<JSON> => {
		console.log("Initial response is: ", res);		
		return res.json();
	})
	.then( (json: JSON) => {
		console.log("JSON body is:", json);
	})
	.catch((err) => {
		console.log("Unable to fetch:", err);
	})
	.finally(() => console.log("Done"));

```

- Note what res and resData actually are, and where they come from - relate to functional piping


- Problems remaining with this method?  Not too many, but you can end up with a huuuuuuge chain of `then()` methods instead.  Looks slightly better but not much
- ES2017 saves the day!  Async/await syntax.  Lets try an example where we need to programmatically restart a database, make sure it's working, then signal that its ready for connections.  Starting with our Promise-based way:

```js
let databaseReady = () => {
  return new Promise( resolve => {
	  //imagine we do some database things
	  //we'll fake it by starting a 10 second timer
	  setTimeout(() => resolve("Database is ready."), 2000);
  })
}
```

- Now lets actually use this in a normal JS function and observe:
```js
function checkDatabase() {
  const dbStatus = databaseReady();
  console.log("Database ready?:", dbStatus);
  return dbStatus;
}
```

- What's going to happen here?  Since we're not using `then` syntax, JS considers dbStatus to be a totally plain obj, not any special async thing.  How do we fix this?  ES2017 added a new keyword for this, `async` which you decorate your function with.
```js
async function checkDatabase()
```

- Now JS knows that THIS function returns a Promise, and it knows to watch for asynchronous things in this function.  BUT it still has no idea where they are, just that it should expect to handle some and eventually return some.  For this, we have a second keyword `await` which is placed in front of any Promises you're wanting the response to:

```js
async function checkDatabase() {
  const dbStatus = await databaseReady();
 console.log("Status", dbStatus);
  return dbStatus;
}
```

- This now LOOKS like synchronous programming!  No hint of anything tricky, no nesting, no confusion at all.  But in practice, it will happen asynchronously in between the other 800k requests.  Lets add some more async fns just to reinforce:
```js
const databaseReady = () => {
	return new Promise( resolve => {
		//imagine we do some database things
		//we'll fake it by starting a 2 second timer
		setTimeout(() => resolve("Database is ready."), 2000);
	});
};

const connectToDatabase = () => {
	return new Promise( resolve => {
		setTimeout(() => resolve("Connected To Database"), 1000);
	});
};

const databaseQuery = () => {
	return new Promise( resolve => {
		setTimeout(() => resolve("Query Successful"), 1000);
	});
};


async function checkDatabase() {
	const dbStatus = await databaseReady();
	console.log(dbStatus);
	const dbConn = await connectToDatabase();
	console.log(dbConn);
	const dbQuery = await databaseQuery();
	console.log(dbQuery);
	console.log("Database ops completed");
}

await checkDatabase();

export {};
```

- Hooray, this works JUST like sync code, but isn't! RIght?  Well...
- These keywords are nice, but actually rather insidious, although you wouldn't know it just by looking.  By using `async` to decorate, we've colored our function.  Now it can only interact nicely with other async functions, so likely we're going to be scattering quite a few more asyncs around just to use this one!

- So now we've come from sync to callbacks to promises to await, each fixing the problems of the latter.  Up next, to fix async/await, we have....nothing.  This is what we have now.  It is not a JS-only issue.  Amazing reading on this topic:
- https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/
- More reading on async/await with pretty animations: https://dev.to/lydiahallie/javascript-visualized-promises-async-await-5gke

- We're going to ignore the problems, as a server is going to be painted all-async either way!  We will also almost never write our own Promises, as every library we're using already comes with async support.  This is new!  

Break before switching to backend:

### SERVER (nastify)

We will later use a production grade server, but this is an institute of higher learning, not a bootcamp, so that one is less interesting than building our own to really see how things work.  Ours won't be EVERY feature, but it WILL have a minimal full framework.  Once we've finished, we'll trade it out for our real server and everyone can enjoy the power of JS on display at how few lines of code need to change

Before we start writing any code, we need to figure out what we're trying to do exactly.

- Web is a bunch of pages all hosted on various computers around the world.  When we open our browser to google.com, we ask Google's server to send us the web page it's hosting.  This is a request.  Google determines what we wanted based on this request, and sends it back.  This is a response.  Our browser takes that response and uses it to render google's search.  ALL of the web operates using this same cycle.  This also goes for ALL types of things, files, images, videos, etc, not just HTML!
- To be thorough, at a lower level, it follows this flow:
	- Browser sees request to google.com
	- Browser asks a DNS server which IP address is assigned to google.com
	- Browser requests a connection to that remote IP address using a lower level protocol called TCP or Transmission Control Protocol.
	- If the server accepts the request, it will open a TCP socket to the browser, send a response back via that socket, then close the connection
	- THIS STARTS OVER on EACH request!
- This cycle of request/response, above the socket layer, uses a particular language protocol itself, called HTTP.  As you might expect based on sockets closing after each request, HTTP is stateless as well.  That means each request has to include ALL of its relevant information.
- If we look at a basic HTTP request `GET /index.html HTTP/1.1` we can see that it specifies the exact file it wants, identifies which version of HTTP it is using, and has one other GET
- HTTP Verbs - think of them as request methods, important ones:
```
GET - retrieve data
POST - submit new data to server, changing state and causing side effects
PUT - replace data already on the server
DELETE - delete something already on the server
```
- HTTP Status Codes - similar, but for responses and indicate result status:
```
404 - Not Found
200 - Successful
301 - Redirected
500 - Something bad happened who knows maybe fire
```
- So we might already start to imagine that we'll be using these status codes somewhere in our server.  In fact, we already know everything we need to piece together what our server needs to do!
1. Accept incoming connections from clients
2. Figure out which type of request (verb) it is
3. Make whatever changes/collect whatever resources the request wanted
4. Send back a response with the status code and resources, if any
5. Close connection

- Luckily, NodeJS comes pre-packaged with a lot of built in modules for HTTP, conveniently called "http".  We'll start there
- comment out app.ts entirely for now, we'll use only index.ts for the moment, which conveniently already has a great example of what we need to do.
- We're going to use http module to start a server and accept some requests:
```js
import http from "http";  
  // createServer( fn requestListener)
  // requestListener(request, response)
const server = http.createServer( (request, response) => {  
  //handle the request  
  console.log("Received Request");  
});  
  
server.listen(8080, () => console.log("Server running on port 8080"));
```

- We can run this already, and even `curl` localhost:8080 against it
- What, though, did we do?  HTTP module handles all the low level sockets and such for us via that listen() call, and we're left with only the high level server implementation to deal with.
- The module helps us here, too, by providing a createServer() method.  This method takes a callback fn (requestListener) like we talked about earlier.  It provides 2 already-populated object parameters to that callback, the request and response.  These are EXACTLY the HTTP request and response in JS object form.  All of the data provided in the request is present on that request object, and `http` expects us to put all the data we want to respond with onto that `response` object.  HTTP contained in a pair of objects!
- We are now to OUR job.  We have a request and a place to put the response, so we need to fill up that response, then send it back.
- Lets start via standard hello world, HTTP Response edition.
- A Response, as we've talked about, contains a status code and optional data, or payload.  The status code goes inside a piece called a Header, which exist for metadata about the request/response.  We have fns for interacting with these already built into our response object:
```js
 console.log("Received hello world request");
 res.writeHead(200, {"Content-Type": "text/html"});
 res.write("Hello world");
 res.end();
```
- We've now set up our headers to include a status code and also what type of resource we're sending back, we've written data to the client, and told `http` we're done, so it can close the connection!

- Hooray we have something working, lets git commit!  Now we can also refactor a bit by making use of the .env file we set up last week to remove the hardcoded port.

```js
// at the very top
import * as dotenv from 'dotenv';  
dotenv.config();
```
- We'll also add `PORT=8080` to our .env file and also .env.example
- Now we can make use of it via `process.env.PORT`
- If we run it again, we'll see it works just the same!

- So this is working-ish, but if we look at it in a browser, it's....not a page.  For that, we need to send *actual* HTML!  The simplest, and most traditional way still in use by static websites, is to have a .html file sitting on the server that you simply send back.  Lets implement that now:
- For ease, lets make a public/ subdir to hold our html and other resources, then put an index.html file in it with basic contents

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Nastify Hello World</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            background-color: #ececec;
        }
    </style>
</head>
<body>
Hello World from HTML!
</body>
</html>


```

- Hooray we have an html page, but how do we send it?  Just like we would in C++, we open the file, read its contents, then ship them on across.  We'll use some fun extra pieces of Node like `http` to interact with the file system:

```js
import * as dotenv from 'dotenv';
dotenv.config();

import http, {IncomingMessage, Server, ServerResponse} from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import ErrnoException = NodeJS.ErrnoException;

// ES Modules argh https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
	fs.readFile(path.resolve(__dirname, '..', 'public', 'index.html'), (err: ErrnoException, data: Buffer) => {
		res.setHeader('Content-Type', 'text/html');
		if (err) {
			console.log(err);
			res.writeHead(500);
			return res.end('Some error occured: ');
		}
		res.writeHead(200);
		return res.end(data);
	});
});

server.listen(8080, () => {
	console.log("Server running on port 8080");
});

```

We can now run our server and connect from a browser to see real html!  However, if we look at this code, it's all ugly and callback-y.  This is because `fs` existed LONG before promises!  Node itself, in fact, is pretty infamous for being a server runtime with synchronous APIs everywhere

- That is, however, not the case.  Node has quietly offered async-valid alternatives which people hardly ever mention, so we'll use those instead!
```js
import fs from "fs/promises";

...

const server = http.createServer( async (req, res) => {  
  
const indexFile = await fs.readFile(path.resolve(__dirname, 'public', 'index.html'))  
    .catch( err =>  {  
      console.error(err);  
      //send error result - 500!  
      res.setHeader('Content-Type', 'text/html');  
      res.writeHead(500);  
      return res.end(err);  
    });  
  
  // Now here, we're SURE indexFile was read properly  
  res.setHeader('Content-Type', 'text/html');  
  res.writeHead(200);  
  return res.end(indexFile);

```
- Note here we've specified the function we're passing to createServer() as async
- Now we've opened a file, read its contents, and sent it back to our client browser.  We've done it, we built our own server!  We'll stop here, then next class start building a framework to make using our server easier.