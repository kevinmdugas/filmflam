
- kitty terminal / fish shell - won't matter to most and will enable all of my tricks and shortcuts in class to work for you too
	- sudo dnf install kitty fish
- firefox has react tools installed for later
- jetbrains needs login info
	- https://www.jetbrains.com/toolbox-app
- vscode installed and setup for node
	- sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
```
cat <<EOF | sudo tee /etc/yum.repos.d/vscode.repo
[code]
name=Visual Studio Code
baseurl=https://packages.microsoft.com/yumrepos/vscode
enabled=1
gpgcheck=1
gpgkey=https://packages.microsoft.com/keys/microsoft.asc
EOF
```
	-  sudo dnf check-update
	- sudo dnf install code

- postman installed
	- flatpak install flathub com.getpostman.Postman
- obsidian installed
	- flatpak install flathub md.obsidian.Obsidian
- Install node via FNM:
	- We're going to use FNM, a version manager, to track our nodejs install.  It's rust, but pure coincidence that my fav language is also this thing!  We'll be using more rust utils later, because they're plain amazing
	- https://nodejs.org/en/download/package-manager#centos-fedora-and-red-hat-enterprise-linux
	- https://github.com/Schniz/fnm
	- https://github.com/Schniz/fnm#using-a-script-macoslinux
	- `curl -fsSL https://fnm.vercel.app/install | bash`
	- `fnm install --lts`
- Install PNPM
	- `npm i -g pnpm`
- Install docker - https://developer.fedoraproject.org/tools/docker/docker-installation.html / https://docs.docker.com/desktop/install/mac-install/
	- sudo dnf install dnf-plugins-core
	- sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
	- sudo dnf install docker-ce docker-ce-cli containerd.io
	- sudo systemctl start docker
	- sudo groupadd docker
	- sudo gpasswd -a d docker
	- sudo systemctl restart docker
	- sudo systemctl enable docker
	- sudo reboot now
- Test rootless:
```
docker run hello-world
```

# PROJECT SETUP
- `ssh-keygen `
- `cat ~/.ssh/id_rsa.pub` > Upload to Github Account
- FORK THIS REPO https://github.com/CaseyBaileyPDX/doggr_sp23
-  `git clone <your fork>`
- `docker compose up`
- `cd backend`
- `pnpm schema:update` > This will update our database to match our code, just run it for now
- `pnpm dev` > This starts our server, again just run it for now
- Check localhost:8080 in browser/Postman
- You're all set up!

## Project Walkthrough
- `mkdir doggr`
- `cd doggr && mkdir backend`
- `cd backend && pnpm init`
- package.json
	- pnpm i [-d] (pkg name)

```json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "Doggr's main backend",
  "type": "module",
  "main": "index.js",
  "scripts": {
   
  },
  "scriptsComments": {
  
  },
  "dependencies": {
 
  },
  "devDependencies": {
  }  
}
```

- [ ] First we need to add our basic packages -- typescript to compile our code, ts-node to run it without needing a compile loop, nodemon to re-run ts-node when our files change, SWC rust compiler to speed things up, and our Typings for node.
`pnpm install -D typescript ts-node nodemon @swc/core @types/node`

- [ ] We also need Fastify, our server, and dotenv which will let us keep our private info private

`pnpm install fastify dotenv`

- [ ] Add .env and .env.example files:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=doggr
DB_USER=doggr
DB_PASS=doggr

```

- [ ] Next we need to add ESLint for formatting and detecting errors
```bash
pnpm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```
- [ ] Create the following  files in /backend `.eslintignore .eslintrc.json .gitignore`
eslintignore:
```
.env*
node_modules/
build/
temp/
**/*.tsbuildinfo

```
.gitignore:
```
node_modules/
build/
**/*.tsbuildinfo
/.env

```
eslintrc:
```
{
  "env": {
    "browser": false,
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    // This is so that we can use promisify on Node's http methods
    "default-param-last": "off",
    // Easier grading rules
    "newline-per-chained-call": "error",
    "max-len": [
      "error",
      {
        "code": 120
      }
    ],
    "indent": [
      "error",
      "tab",
      {
        "ignoredNodes": [
          "PropertyDefinition"
        ],
        "SwitchCase": 1
      }
    ],
    "no-mixed-spaces-and-tabs": "off",
    "semi": "error",

    // These flip based on dev convenience vs prod safety
    // Comment out everything below before building prod
    "no-console": "off",
    "consistent-return": "off",
    //"no-unused-vars": "off",
    "quotes": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/unused-import": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-default-export": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-implicit-any": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-return-await": "error"
  }
}

```

- [ ] Now we need to configure typescript - this gets into the guts of JS/TS/ESModules so we're mostly using defaults with minor changes to make all of our tech work together.
```json - tsconfig.json
{
  "ts-node": {
    "transpileOnly": true,
    "transpiler": "ts-node/transpilers/swc-experimental"
  },
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */
    "incremental": false,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */
    
    /* Language and Environment */
    "target": "ES2022",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "lib": ["ES2022"],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    "experimentalDecorators": true,                   /* REQUIRED FOR MIKRO-ORM - Enable experimental support for legacy experimental decorators. */
    "emitDecoratorMetadata": true,                    /* REQUIRED FOR MIKRO-ORM - Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
    // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
    // "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */

    /* Modules */
    "module": "ES2022",                                /* Specify what module code is generated. */
    "rootDir": "./src",                                  /* Specify the root folder within your source files. */
    "moduleResolution": "Node",                     /* MUST BE NODE per Fastify - https://github.com/fastify/fastify/issues/4241 */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
    // "allowImportingTsExtensions": true,               /* Allow imports to include TypeScript file extensions. Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set. */
    // "resolvePackageJsonExports": true,                /* Use the package.json 'exports' field when resolving package imports. */
    // "resolvePackageJsonImports": true,                /* Use the package.json 'imports' field when resolving imports. */
    // "customConditions": [],                           /* Conditions to set in addition to the resolver-specific defaults when resolving imports. */
    "resolveJsonModule": true,                        /* Enable importing .json files. */
    //"allowArbitraryExtensions": true,                 /* Enable importing files with any extension, provided a declaration file is present. */
    // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */
    
    /* Emit */
    "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    "emitDeclarationOnly": false,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    "outDir": "./build",                                   /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types. */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "verbatimModuleSyntax": true,                     /* Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. */
    "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */

    /* Type Checking */
    "strict": false,                                      /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}

```

- [ ] Create file nodemon.json
```json
{
    "restartable": "rs",
    "ignore": [
      ".git",
      "node_modules/**/node_modules",
      "build/**/*",
      "lib/**/*"
    ],
    "execMap": {
      "ts": "node --loader ts-node/esm"
    },
    "ext": "ts,js,json"
  }
```

- [ ] create src/index.ts
```ts
import dotenv from "dotenv";
import Fastify, {FastifyReply, FastifyRequest} from "fastify";
dotenv.config();

const app = Fastify();

app.get('/hi', async (request: FastifyRequest, reply: FastifyReply) => {
	return 'Hilo';
});

app.listen({ port: 8080 },
	(err: Error, address: string) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`Started server at ${address}`);
	}
);

```

- [ ] Add package.json scripts
```json package.json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "Doggr's main backend",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon --no-warnings=ExperimentalWarning src/index.ts",
    "lint": "eslint . --ext .ts",
    "build": "tsc -p tsconfig.json",
    "start": "node build/index.js"
  },
  "scriptsComments": {},
  "dependencies": {
    "dotenv": "^16.0.3",
    "fastify": "^4.15.0"
  },
  "devDependencies": {
    "@swc/core": "^1.3.44",
    "@types/node": "^18.15.11",
    "@typescript-eslint/eslint-plugin": "^5.57.0",
    "@typescript-eslint/parser": "^5.57.0",
    "eslint": "^8.37.0",
    "nodemon": "^2.0.22",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.3"
  }
}

```

- [ ] Run it! `pnpm dev`

READING:
- https://tinder.com - if you don't know how it works, this is what we're stealing for Doggr
- https://ubuntu.com/tutorials/command-line-for-beginners - basic linux/osx CLI tutorial
- https://www.cbtnuggets.com/blog/technology/networking/what-is-a-tcp-port-and-why-they-are-important - reading on TCP/ports/sockets/etc
-  http://www.steves-internet-guide.com/http-basics/ - Nice intro to HTTP basics
-  https://code.tutsplus.com/tutorials/a-beginners-guide-to-http-and-rest--net-16340 - Ignore the example project here, but do read the concepts for REST
- https://www.sqltutorial.org/ - You may work through the examples if you need, but it isn't required.  We will use very little raw SQL in this course, but you DO need to understand the concepts in the following sections: 1-4, 6, 11-13
