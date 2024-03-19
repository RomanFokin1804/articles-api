## Description

- Framework: Nest.js
- Database: Postgres
- ORM: TypeORM
- Docker
- Auth: basic + JWT tokens

After the configuration steps are completed and the application is launched, Docker containers with the database and the application are started, followed by the initiation of the migration check and execution process. After this, the application is available at http://localhost:3000. Swagger documentation can be accessed at http://localhost:3000/api.

The application consists of four modules:
- articles: a module for working with articles
- auth: a module for authentication, adding, and changing user roles
- roles: a module for adding/changing/viewing existing roles
- users: a module for adding/changing/viewing/deleting existing users

Default admin user data:
- email: admin@test.com
- password: password

Database access:
- host: authdb
- port: 5432
- user: pguser
- password: pgpwd4auth
- name: authdb

## Configuration

Copy ".env-example" file in root folder and rename to ".env"

## Running the app

```bash
# though Docker-compose
$ npm run start
```