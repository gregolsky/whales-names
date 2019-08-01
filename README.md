# Whales' names 🐋

Simplistic solution of *why can't I reach my docker containers by name?* problem. Continuously update hosts file (`/etc/hosts`) with docker container names and aliases and watch for changes.

[![npm version](https://badge.fury.io/js/whales-names.svg)](https://badge.fury.io/js/whales-names) [![Known Vulnerabilities](https://snyk.io/test/github/gregolsky/whales-names/badge.svg)](https://snyk.io/test/github/gregolsky/whales-names)

## Installation 🔨

```
$ npm install -g whales-names
```

## Usage 📘

```
$ whales-names
Synchronizing docker container hostnames in hosts file.
```

Afterwards you are going to see a new section in the end of your `/etc/hosts` file:

```
...

# whales-names begin
172.21.88.220	dfbf5d96df3e node1 
172.21.94.104	79468a158d1e node2
172.21.89.244	0c9b251458f4 db
# whales-names end

```

You can end it with simple Ctrl+C. Errors, if any are going to be printed on the console.

### Elevated privileges ⚠️
Due to file permissions of `/etc/hosts` file you need to use elevated privileges (run as Administrator, if you will) for running it.

> **Rae**: You like whales?
>
> **Jesse**: I like him.
>
> **Rae**: Well, he doesn't like anybody, so stay away from him. You see, Willy's a case. A very special case.
>
> **Jesse**: So? Who isn't?
>
> Free Willy (1993) 🐳