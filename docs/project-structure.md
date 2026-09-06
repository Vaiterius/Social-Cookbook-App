# Project structure

Group application code by feature, with small layers inside each feature. Keep
shared infrastructure and TanStack route definitions in their existing folders.
This scaffold defines places for future code; it does not implement features or
enforce import boundaries automatically.

## Folder layout

```text
src/
├── components/             # Shared application components, including Header
│   └── ui/                 # Reusable UI primitives
├── features/
│   ├── recipes/
│   │   ├── components/
│   │   ├── functions/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── validation/
│   ├── cookbooks/
│   ├── users/
│   └── activity/
├── middleware/             # Shared request/server-function middleware
├── routes/                 # TanStack pages, layouts, and HTTP endpoints
├── db/                     # Database connection and Drizzle schema
├── integrations/           # Framework and library integrations
└── lib/                    # Configuration and general utilities
```

Recipes provide the initial layer folders. Add the same folders under the other
features as needed, rather than requiring every feature to have every layer.
The `.gitkeep` files let Git retain otherwise empty directories; remove a marker
when its folder contains a real file.

## Feature ownership

- `recipes`: recipes, ingredients, instructions, classification associations,
  forks, saved recipes, personal notes, and MadeThis.
- `cookbooks`: cookbooks, cookbook membership, and saved cookbooks.
- `users`: profiles, follows, and account-management operations.
- `activity`: activity creation and following-feed retrieval.

These are functional groupings, not one folder per database table. Keep a recipe
card in the recipes feature even when several pages use it. Promote only genuinely
general-purpose components to `src/components` or `src/components/ui`.

## Layer responsibilities

| Location                | Responsibility                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `routes/`               | URL/search parameters, loaders, redirects, metadata, and composing feature UI. Keep route handlers thin.                                         |
| Feature `components/`   | Feature-specific UI and interaction state; no direct service, repository, or database calls.                                                     |
| Feature `functions/`    | TanStack `createServerFn` entry points: validate input, obtain the authenticated actor when required, and call services.                         |
| Feature `services/`     | Application operations, business rules, authorization, and coordinating transactional work. Keep request/cookie handling in the transport layer. |
| Feature `repositories/` | Drizzle queries and persistence operations. Implement the filtering required by application policy without independently deciding that policy.   |
| Feature `validation/`   | Client-safe input validation shared by forms and server functions; separate from the database schema.                                            |
| `middleware/`           | Reusable request/server-function concerns such as session authentication; not recipe or cookbook business rules.                                 |

The usual application flow is:

```text
Route or component → Server function → Service → Repository → Database
```

HTTP endpoints in `routes/` can call services from their server handlers. A route
loader is different: it can run in the browser and must call a server function
instead of directly accessing a service or repository.

## File and import conventions

- Use `*.functions.ts` in feature `functions/` folders for callable server-function
  wrappers. Components and loaders can statically import these wrappers.
- Use `*.server.ts` for server-only service and repository implementations. Reach
  them through server-function handlers or server-route handlers, not browser
  code. Naming a folder `services` or `repositories` does not make it server-only.
- Keep validation modules client-safe: no database connection, server auth
  configuration, or server-only imports.
- Prefer direct imports. Avoid feature-wide barrel files that mix UI, server
  functions, and server-only implementations.
- Authentication must be enforced at protected server entry points, not only in
  route guards. Services must still check ownership and access to the requested
  resources; authentication alone is not authorization.

The server-function conventions follow the project's TanStack guidance; see
[TanStack's file organization documentation](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions#file-organization).

## Starting small

Keep the existing auth configuration in `src/lib`, schema in `src/db`, and
providers in `src/integrations`. This scaffold does not require moving them.

Add concrete operations as they are needed; do not add empty service classes,
generic repositories, or placeholder exports. Colocate tests with the code they
exercise when testing is introduced. Add `hooks`, `queries`, `types`, or `domain`
folders only once there is enough code to justify them.
