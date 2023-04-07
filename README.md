# OpenID Connect Demo

> Code examples of how to authenticate users from different identity providers.

## Available Examples
- [x] Facebook
- [x] GitHub
- [x] Google
- [x] OKTA
- [ ] Ping Identity

## Prerequisite
You need to have [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed on your machine. You also need to configure HTTPS in your development environment. Details can be found in [here](https://github.com/FiloSottile/mkcert).

## Environment Variables

> Create a .env file and adjust the following environment variables. DONOT include the file in the source control.

```bash
PORT=<value>

FACEBOOK_CLIENT_ID=<value>
FACEBOOK_SIGNIN_REDIRECT_URI=<value>

GOOGLE_CLIENT_ID=<value>
GOOGLE_CLIENT_SECRET=<value>
GOOGLE_SIGNIN_REDIRECT_URI=<value>

GITHUB_CLIENT_ID=<value>
GITHUB_CLIENT_SECRET=<value>
GITHUB_SIGNIN_REDIRECT_URI=<value>

OKTA_APP_DOMAIN=<value>
OKTA_CLIENT_ID=<value>
OKTA_SIGNIN_REDIRECT_URI=<value>
OKTA_SIGNOUT_REDIRECT_URI=<value>
```

## Application Bootstrap

```bash
$ yarn install     # install dependencies
$ yarn start       # development build
```

## License
<a href="https://opensource.org/licenses/MIT">The MIT License.</a> Copyright &copy; 2023 [Shibbir Ahmed.](https://shibbir.io/)
