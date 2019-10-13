# Reix

Reix is a set of low level & typesafe & efficient game-engine utils.
That means:

-   No rendering engine
-   No physics engine
-   No \[insert thing game engines usually have here\]

Curently this repo contains a few packages including:

-   A typesafe entity component system
-   A bitfield based event emitter
-   Rxjs integration for that event emitter
-   Generalised computation nodes

And guess what, we even have [docs](https://mateiadrielrafael.github.io/reix/) (well tehnically those are generated from comments but who cares).

## Why?

I started working on this because I want to have some nice tools to use during game jams.

## Can i help?

Of course, contibutions are welcome!

## I really want this engine to have the **_X_** thingy!

Just open an issue and you might get your **_X_** thingy!

#### Actually...

Do you know how to add the **_X_** thingy yourself? Keep reading and I'll show you how to add things to this project by yourself!

## How can i start working on this?

First, clone this repo and cd into the created directory:

```sh
git clone https://github.com/Mateiadrielrafael/reix
cd reix
```

Then, install the dependencies and bootsrap packages:

```sh
npm install
./node_modules/.bin/lerna bootstrap
```

If you are using [visual studio code](https://code.visualstudio.com/) you'll also need to install [the prettier extension](https://github.com/prettier/prettier-vscode).

### How can I run the tests?

There are 3 ways of running the tests:

1. Run the tests on the chanegd packages:

```sh
npm run test:changed
```

2. Run all tests:

```sh
npm run test
```

3. Run all tests in the same mocha call:

```sh
npm run test:root
```

#### What's the difference between 2 and 3?

The second method will run the mocha cli in each package (using lerna exec), while the second runs it once in the root directory.

### How can I build the packages?

There are 2 ways to run build the packages:

1. Build all of them:

```sh
npm run build:all
```

2. Build what changed

```sh
npm run build
```

### How can I generate the docs?

```sh
npm run docs
```

### How can I create a new package?

To create a pcakge called foo run:

```sh
./scripts/create.sh foo
```

### Ok, I understand everything, now can I make my first commit?

Well yes, but actually no. This package follows the [conventional commit specification](https://www.conventionalcommits.org/en/v1.0.0/).
If you use [visual studio code](https://code.visualstudio.com/) you can use the [vscode-commitizen extension](https://github.com/KnisterPeter/vscode-commitizen)
