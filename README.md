# Eestec Duel 2023

This is a small [Socket.IO](https://socket.io/) web app quiz project for Eestec Duel 2023.

## Installation

Use [npm](https://www.npmjs.com/) to install needed packages.
Run `npm install` in:
- `./server/`
- `./client/preview/`
- `./client/controller/`

## Usage

If the Preview page, Admin page, and server are not running on the same machine, change the addresses in `./client/preview/script.js` and/or `./client/controller/script.js`.

- Run `node ./server/server.js` to run [Socket.IO](https://socket.io/) server.
- Open `./client/controller/index.html` in browser for Admin page.
- Open `./client/preview/index.html` in browser for Preview page.
