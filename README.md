Simplistic solution of `why can't I reach my docker containers by name?' problem. Continuously update hosts file (`/etc/hosts`) with docker container names and aliases and watch for changes.

# Installation

```
npm install -g whales-names
```

# Usage

```
whales-names
```

You can end it with simple Ctrl+C. Errors, if any are going to be printed on the console.

## Running on Windows
Due to file permissions of `/etc/hosts` file you need to use elevated privileges (run as Administrator) for running it.

> Rae: You like whales?
> Jesse: I like him.
> Rae: Well, he doesn't like anybody, so stay away from him. You see, Willy's a case. A very special case.
> Jesse: So? Who isn't?
>
> Free Willy (1993)