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

## Categories and tags

`scripts/seed-taxonomy.ts` seeds the shared courses, cuisines, dietary preferences,
and discovery tags. Run it after migrations in local, remote test, or production:

```sh
npm run db:seed:taxonomy
```

It inserts missing names in one transaction, skips existing names, and never
updates or deletes existing rows. It creates no sample users or recipes; the
sample-only custom tag stays in the fixture script. Run it again whenever the
taxonomy list grows. Seed names are normalized to lowercase before insertion, so
changing capitalization does not create another entry. Database checks require
lowercase names (including custom tags), and unique constraints prevent duplicates.
Other writers must lowercase names before insertion and normalize name lookups too.
The normalization migration lowercases existing categories while retaining IDs and
recipe links. If case-only duplicates already exist, it rolls back rather than
silently merging or deleting data; resolve those duplicates before retrying.

Like Drizzle, it reads `.env.local`, then `.env`, or only the file selected by
`DB_ENV_FILE`. A missing selected file fails rather than falling back locally.
Exported environment variables take precedence. For example, after migrating
the remote test database:

```sh
DB_ENV_FILE=.env.staging.local npm run db:seed:taxonomy
```

Use the corresponding private environment file for production, or inject
`DATABASE_URL` through deployment/CI secrets and run `npm run db:seed:taxonomy`.
The runtime executing these TypeScript scripts needs the installed `tsx` and
`dotenv` development dependencies. No remote database is seeded automatically.

## Visual testing fixtures

With the local database running and migrations applied:

```sh
npm run db:seed:taxonomy # Seed required categories and tags first
npm run db:seed        # Create or replace the sample data; prints recipe URLs
npm run db:seed:clear  # Delete the sample users, recipes, and their detail data
npm run db:seed        # Recreate them with the same user and recipe IDs
```

`scripts/seed.ts` creates Maya Santos, Leo Rivera, and Sam Chen, plus five recipes:
Spicy Chicken Adobo (full details), Mushroom Adobo (a fork), Simple Toast (empty
collections), Private Family Soup, and Unfinished Pancakes (an incomplete draft).
All four published recipes have complete recipe-row content. Nutrition values,
source URLs, and image keys are sample data for display testing.
Each published recipe also gets a `recipe_published` activity. `/following`
shows the three public recipes; the private publication is filtered out and
the draft has no activity. Sample cleanup deletes these activities before recipes.
The last two should show “Recipe not found” to anonymous visitors. Image keys
are placeholders for plain-text display; no image files are created.

Leo has saved and made the chicken adobo and has a personal note. These users
are database fixtures, not login accounts: until auth is connected, the browser
will show “Not signed in” for viewer state.

The script reads `.env.local`, then `.env`, with exported variables taking
precedence. It only accepts a local `sapori_dev` database and refuses production
mode. Replacement runs in a transaction and includes a small relational smoke
check. Cleanup targets reserved fixture IDs rather than truncating tables;
unexpected foreign-key references abort and roll back the operation. It looks
up the required taxonomy names (dinner, filipino, vegetarian, comfort food) and
fails with an instruction to run the taxonomy seed if any are missing. Shared
taxonomy is retained after cleanup; the sample custom tag is deleted.

## Recipe publication completeness

`recipe_published_fields_required` rejects inserts or updates that leave a
published recipe with null content fields. Drafts may omit content. Published
recipes require title, caption, cover image key, preparation/cooking times,
servings, difficulty, author's note, all five nutrition values, source name,
and source URL. This applies to private and public recipes alike. `deletedAt`
remains nullable because it describes lifecycle state, not recipe completeness.

The check enforces non-null recipe-row fields; it does not validate empty strings,
URL/image availability, numeric ranges, or related ingredient/instruction rows.
When the publishing endpoint is implemented, validate publication input on the
server as well as in the editor and return useful field errors. Frontend checks
alone cannot protect writes made by direct requests or scripts.

The migration validates existing rows and fails if any published recipes are
incomplete; it does not invent content or change their publication status.
For the old local fixtures, run `npm run db:seed:clear` before `npm run db:migrate`,
then `npm run db:seed` to recreate complete fixtures. Other environments must
correct their existing incomplete published rows before migrating.

Running `npm run db:seed` also checks that the database accepts the complete
published fixtures and incomplete draft, rejects an incomplete published insert,
rejects publishing the incomplete draft, and rejects nulling each required field
on an already-published recipe. Expected failures use transaction savepoints.

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

`DB_ENV_FILE` selects only that file for Drizzle commands and the taxonomy seed, and fails if it cannot
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
