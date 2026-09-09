# Database development

## Local setup

Install Docker with the Compose plugin and start the Docker engine (or Docker
Desktop). Install the app dependencies with `npm ci` if needed.

This workspace already has local database credentials in `.env.local`. For a new
checkout, copy `.env.example` to `.env.local`, fill in `POSTGRES_USER`,
`POSTGRES_PASSWORD`, and `POSTGRES_DB`, then set `DATABASE_URL` to the matching
`postgresql://USER:PASSWORD@127.0.0.1:5433/DATABASE` URL. URL-encode special
characters in usernames/passwords. Use a full literal URL: dotenv does not expand
`${POSTGRES_USER}` references. Supply the auth values before using auth features.

From the repository root, initialize the database:

```sh
npm run db:up
npm run db:migrate
npm run dev
```

`db:up` downloads the PostgreSQL 18 image on first use, starts it in the background,
and waits for its health check. The app runs on the host and connects to
`127.0.0.1:5433`. Only the database runs in Docker. If port 5433 is occupied, change
`POSTGRES_PORT` and the port in `DATABASE_URL` together.

## Each time you open the workspace

Make sure Docker is running, then run:

```sh
npm run db:up
npm run dev
```

Running `db:up` again is safe when the container is already running. Opening the
editor does not itself start Docker. The `unless-stopped` policy restarts the
container when Docker restarts, unless you explicitly stopped it.

Run `npm run db:migrate` whenever new migrations have been added. Migrations are
tracked, so previously applied migrations are skipped.

| Command             | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `npm run db:status` | Check the container and health status                   |
| `npm run db:logs`   | Follow PostgreSQL logs; Ctrl+C exits the log viewer     |
| `npm run db:stop`   | Stop PostgreSQL, retaining the container and data       |
| `npm run db:down`   | Remove the container/network, retaining the data volume |
| `npm run db:studio` | Browse the configured database with Drizzle Studio      |

Data lives in the named Docker volume `sapori-local_postgres_data`, including
across container recreation. Do not add `--volumes`/`-v` to `down` unless you intend
to delete that data. PostgreSQL initialization credentials only take effect on an
empty volume; editing `.env.local` does not change an existing database password.
Do not change the PostgreSQL major image version on an existing volume without
planning a database upgrade.

## Schema changes

After editing `src/db/schema.ts`:

```sh
npm run db:generate
# Review the generated SQL in drizzle/.
npm run db:migrate
```

Keep the generated SQL and `drizzle/meta` together in version control. Use these
same migrations in local, remote test, and production databases. `db:push` is
available for disposable experiments, but it bypasses the reviewed migration
workflow and should not be used for shared test or production databases.

## Remote test and production

The app and Drizzle already use `DATABASE_URL`; Compose remains local-only.
Provision separate remote test and production databases. Store each connection
URL in that environment's secret settings, using the provider's required TLS
configuration. Do not prefix database secrets with `VITE_`.

For an explicit remote migration from this workspace, create a private
`.env.staging.local` containing the provider's `DATABASE_URL`, then run:

```sh
DB_ENV_FILE=.env.staging.local npm run db:migrate
```

`DB_ENV_FILE` selects only that file for Drizzle commands and fails if it cannot
be loaded. It does not select the app's runtime environment. By default Drizzle
reads `.env.local`, then `.env`; exported environment variables always take
precedence. Check for an already-exported `DATABASE_URL` before selecting a target.
In deployment/CI, inject `DATABASE_URL` as a secret and run `npm run db:migrate`
as a controlled release step, then start the app with its own runtime URL. Do not
ship local environment files with the deployment.

Before configuring a remote environment, provide:

- The database provider, PostgreSQL version, region, and app hosting platform.
- The connection details through local environment files or platform secrets;
  tell the assistant the variable names/file location without pasting passwords.
- Whether the provider uses a pooled application URL and a separate direct URL
  for migrations, plus its TLS/CA and network access requirements.
- Whether to start with an empty database or transfer existing development data.
- For production, the intended migration approval process and backup/restore plan.

Run and validate migrations in remote test before production. No remote resources
are provisioned by this scaffold.

References: [Docker Compose startup](https://docs.docker.com/reference/cli/docker/compose/up/),
[Compose service configuration](https://docs.docker.com/reference/compose-file/services/),
and the [official PostgreSQL image](https://hub.docker.com/_/postgres).
