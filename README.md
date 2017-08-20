# Mean Demo

<h3>Run the Server:</h3>

Open cmd or bash & run these commands,

```
git clone https://github.com/imdadul/mean-demo-BE.git
cd mean-demo-BE
npm install
npm start
```
The Backend server will start in localhost:3001

<h3>Run unit tests:</h3>

```
npm test
```

<h3>Database Configuration</h3>

Currently this server is using a remote mongodb database from mongolab.

If you want to change the database, open <code>const/config.json</code> and change <code>connectionString</code>

<h3>Folder structure</h3>

```
├──bin
│   └── www 
├──const              // All constants such as keys, connstrings, remote api endpoints(if) should be here.
│   └── config.json 
│   └── keys.json
├──database
│   └── movie.js 
│   └── user.js
├──public
│   └── stylesheets 
│       └── style.css
├──push-notification  // Push notification handler
│   └── push-notification.js 
│   └── sockets.js 
├──routes             //Route endpoints
│   └── index.js 
│   └── movies.js 
│   └── users.js 
├──spec               // Test cases
│   └── userSpec.js
├──util
│   └── const.js      // This file holds all the references of config json objects.
│   └── EVENTS.js     // All push notification event names.
│   └── jwt.js        //JWT token handler
├──views
│   └── error.hbs 
│   └── index.hbs
│   └── layout.hbs 
├──app.js
├──package.json
├──README.md

```
