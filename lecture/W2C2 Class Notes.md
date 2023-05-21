### Housekeeping
- Project description releases
- Put these notes on canvas

## Backend
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

We can now run our server and connect from a browser to see real html!  However, if we look at this code, it's all ugly and callback-y.  This is because `fs` existed LONG before promises!  Node itself, in fact, is pretty infamous for b
eing a server runtime with synchronous APIs everywhere

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
- Now ready to start modeling on express/fastify
- app.use/get/listen/post

- Entrypoint - we want to model this using our http module
```js
const http = require('http');

export function Nastify() {
  function listen(port = 8080, cb) {
    return http
      .createServer((req, res) => {})
      .listen({ port }, cb);
  }

  return {
    listen
  };
}
```

- We can also move our requestListener from last time into this wrapper

```js
export function Nastify() {
  async function listen(port = 8080, cb) {
    return http
      .createServer(async (req, res) => {
        const indexFile = await fs.readFile(path.resolve(__dirname, 'public', 'index.html'))
          .catch(err => {
            console.error(err);
            //send error result - 500!
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(500);
            return res.end(err);
          });

        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        return res.end(indexFile);
      }).listen({port}, () => {
        if (cb) {
          if (typeof cb === 'function') {
            return cb();
          }
          throw new Error('Listen callback needs to be a function');
        }
      });
  }

  return {
    listen
  };
}

```

Next, we have the Request object provided by `http` but we need to add to it!  There are properties on the URL requested that we need.  Given a URL like `https://www.google.com/queries/?sort=newest?country=en_us`
- Protocol (http/https)
- Host (www.google.com)
- Path ("/queries")
- Query (?sort=newest?country=en_us)

- We can url.parse this and add all the parameters to our request obj - lets make request.ts
```js
import url from "url";  
  
export function request(req) {  
 const parsedUrl = url.parse(`${req.headers.host}${req.url}`, true);  
 const keys = Object.keys(parsedUrl);  
 keys.forEach((key) => (req[key] = parsedUrl[key]));  
}
```

Now our server can snatch these anytime it needs them!  Next we'll add to our Response in the same way.  Express provides a number of fns we'll need to impl, such as the json() we saw Tuesday

- Lets make Response.ts
```js
export function response(res) {
	function end(content) {
		res.setHeader("Content-Length", content.length);
		res.status();
		res.end(content);
		return res;
	}

	res.status = (code) => {
		res.statusCode = code || res.statusCode;
		return res;
	};

	res.send = (content) => {
		res.setHeader("Content-Type", "text/html");
		return end(content);
	};

	res.json = (content) => {
		content = JSON.stringify(content);
		res.setHeader("Content-Type", "application/json");
		return end(content);
	};

	res.redirect = (url) => {
		res.setHeader("Location", url);
		res.status(301);
		res.end();
		return res;
	};
}

```

- perfect, now we've wrapped our req/res with the required functionality, so we need to actually have them execute - just inside our createServer() call
```js
	 function listen(port = 8080, cb) {
        return http
          .createServer((req, res) => {
	request(req);
    response(res);
    ...
```

## MIDDLEWARES
- We're getting closer!  Next, we need to implement Middleware processing.  Express's definition of these is `Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next.`
- Basically, we take a request, then perform a bunch of transforms on the response.  It's like an assembly line.  Express denotes these with `use()` so we'll do the same!
```js
export function Nastify() {
  const _middlewares: any = [];

  function use(...args) {
    let path = '*';
    let handler = null;

    if (args.length === 2) [path, handler] = args;
    else handler = args[0];

    if (typeof path !== 'string') throw new Error('Path needs to be a string');
    else if (typeof handler !== 'function') throw new Error('Middleware needs to be a function');


    _middlewares.push({
      path,
      handler
    });
  }
  ...
  ...
   return {
    use,
    listen
  };
```
- Our use method takes 2 parameters, a path and a handler.  We then attach them onto a new middlewares array.  This means any time somebody calls `app.use()` we'll add a new middleware from it.
- Before we go much further, lets refactor a bit and move the validation into its own fn in a new helpers.ts file
```js
export function checkMiddlewareInputs(args) {
	let path = "*";
	let handler = null;

	if (args.length === 2) [path, handler] = args;
	else handler = args[0];

	if (typeof path !== "string")
		throw new Error("Path needs to be either a string");
	else if (typeof handler !== "function")
		throw new Error("Middleware needs to be a function");

	return {
		path,
		handler,
	};
}

```

Then we can refactor our use a bit to make use of it:
```js
function Nastify() {
  ...
  function use(...args) {
    const { path, handler } = checkMiddlewareInputs(args);
    _middlewares.push({
      path,
      handler
    });
  }
  ...
```
- Great, now we're building a cache of middlewares, but we've not actually invoked them yet.  We'll do that IMMEDIATELY after our earlier request/response wrapping

```js
function handleMiddleware(req, res) {
    /* Will do middleware handling here*/
  }
  
  function listen(port = 8080, cb) {
    return http
      .createServer((req, res) => {
        request(req);
        response(res);
        handleMiddleware(req, res);
      })
    ...
  }
```
This method is now in charge of executing every middleware in order for each request.  Now we need to make sure we're enabling things to work like Express, which means all middlewares get 3 parameters, a Request obj, a Response obj (just like our http methods!) and one more, a `next` function.  Next is simply the way of letting our middleware handler know that one middleware has completed and the next needs to be called.  We MUST ensure that every middleware calls it!

So we'll impl that now.  We'll work through our middlewares array sequentially.  We'll also add a way for our middleware handler to actually FIND the next...next

```js
export function Nastify() {
  let middlewares: any = [];

  function use(...args) {
    const { path, handler } = checkMiddlewareInputs(args);
    middlewares.push({
      path,
      handler
    });
  }
 function findNext(req, res) {
    let current = -1;
    const next = () => {
      current += 1;
      const middleware = middlewares[current];
      const { matched = false, params = {} } = middleware ? matchPath(middleware.path, req.pathname) : {};

      if (matched) {
        console.log("Middleware found");
        req.params = params;
        middleware.handler(req, res, next);
      } else if (current <= middlewares.length) {
        next();
      }
    };
    return next;
  }

function handleMiddleware(req, res) {
    const next = findNext(req, res);
    next();
  }
```

We now need to impl that matchPath fn, which we'll also put in helpers.  It's in charge of splitting the URL path and separating out parameters, which look like `/user/:userId`.  We'll add these to a `params` object

```js
// Given 2 path strings, tokenize them into arrays via path separator
// piecewise match them to see if equal
// while also grabbing :-prefixed tokens as params
//"/users/admin"
export function matchPath(setupPath, currentPath) {
	const setupPathArray = setupPath.split("/");
	const currentPathArray = currentPath.split("/");

	let match = true;
	const params = {};

	for (let i = 0; i < setupPathArray.length; i++) {
		const route = setupPathArray[i];
		const path = currentPathArray[i];
		if (route[0] === ":") {
			params[route.substr(1)] = path;
		} else if (route === "*") {
			break;
		} else if (route !== path) {
			match = false;
			break;
		}
	}

	const isMatch = match ? { matched: true, params } : { matched: false };

	return isMatch;
}
```


So, now what we have is a findNext method that returns a function called `next`. This function tracks which middleware is up next.  We're just using a very simple counter.  We then check matchPath() to determine if the next (of ALL middlewares) should be applied to this particular route.  If it matches, we execute the middleware, else skip it and move on

This should be pretty close!  Lets grab an express middleware and try it `npm i cors`

We'll add a new path to test it against, in index.ts:

```js
import {Nastify} from "./app";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

const app = Nastify();

app.use("/about", cors());
app.use("/about", (req, res, next) => {
  res.send("I am the about page");
  next();
});

app.use("/", async (req, res, next) => {

  const indexFile = await fs.readFile(path.resolve(__dirname, 'public', 'index.html'))
    .catch(err => {
      console.error(err);
      //send error result - 500!
      res.setHeader('Content-Type', 'text/html');
      res.status(500).send("Error occurred", err);
      return next();
    });

  res.status(200).send(indexFile);
  return next();

});

async function main() {
  const server = await app.listen(8080, () => {
    console.log("Server is running");
  });
}

void main();
```

Now if we head to localhost:8080/about, we should see the cors header in dev tools!