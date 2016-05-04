var path = require('path'),
    config, mysql;

var env = process.env.NODE_ENV || 'development';
var production = env == 'production';

var appEnv = {};
var sqlCredentials = {};
var mailCredentials = {};
var appUrl = null;
if (production) {
  var cfEnv = require("cfenv");
  var pkg   = require("./package.json");
  var appEnv = cfEnv.getAppEnv();
  appUrl = appEnv.url;
  // because expressjs thinks that the X-Forward-Proto header is "http" instead of "https"
  appUrl = appUrl.replace("https://", "http://")
  console.log("App URL: " + appUrl);
  console.log(appEnv);
  console.log(appEnv.getServices());
  var sqlCredentials = appEnv.getService(/ghost-pg/).credentials;
  var mailCredentials = appEnv.getService(/email/).credentials;
}
console.log(sqlCredentials);
console.log(mailCredentials);

config = {
    development: {
      url: 'http://localhost:2368',
      database: {
        client: 'sqlite3',
        connection: {
            filename: path.join(__dirname, '/content/data/ghost-dev.db')
        },
        debug: true
      },
      server: {
        host: '127.0.0.1',
        port: '2368'
      },
      paths: {
        contentPath: path.join(__dirname, '/content/')
      }
    },
    // Cloud Foundry
    production: {
      url: appUrl,
      mail: {
        transport: 'SMTP',
        options: {
          service: 'Sendgrid',
          auth: {
            user: mailCredentials.username,
            pass: mailCredentials.password,
          }
        }
      },
      database: {
        client: 'pg',
        connection: sqlCredentials.uri,
        pool: {
          min: 2,
          max: 4
        },
        debug: false
      },
      server: {
        host: appEnv.bind,
        port: appEnv.port
      },
      logging: false
    },

};
module.exports = config;
