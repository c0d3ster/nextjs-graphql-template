<!-- #slot provides-auth -->
- **Authentication**: Supabase Auth with email/password and Google sign-in <!-- @module:auth -->
<!-- #endslot provides-auth -->

<!-- #slot provides-database -->
- **Database**: Supabase Postgres with Drizzle ORM for queries, Supabase CLI for migrations <!-- @module:database -->
- **Realtime**: Supabase Realtime (Postgres changes, broadcast) <!-- @module:realtime -->
<!-- #endslot provides-database -->

<!-- #slot architecture-stack -->
   - Drizzle ORM / Supabase Auth / Supabase Postgres # @module:database
<!-- #endslot architecture-stack -->

<!-- #slot key-features-data -->
- **Data Layer**: Supabase Postgres with Drizzle ORM <!-- @module:database -->
- **Authentication**: Supabase Auth with cookie sessions (`@supabase/ssr`) <!-- @module:auth -->
<!-- #endslot key-features-data -->

<!-- #slot env-provider -->
   # #region @module:auth
   # Local Supabase: run `npm run db:start` (step 3), then copy the keys from `npx supabase status`
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...
   # #endregion @module:auth

   # #region @module:database
   # Postgres from the local Docker stack
   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
   # #endregion @module:database
<!-- #endslot env-provider -->

<!-- #slot ci-secret -->
<!-- #endslot ci-secret -->

<!-- #slot database-setup -->
3. **Start the local database:**

   Develop against the local Supabase stack. It needs [Docker](https://docs.docker.com/get-docker/) running.

   ```bash
   npm run db:start
   ```

   This boots Postgres, auth and Studio (<http://127.0.0.1:54323>) and applies `supabase/migrations`. It prints the
   local URL and keys for step 2. Stop it with `npm run db:stop`, or rebuild the database from the migrations with
   `npm run db:reset`.

   Migrations are plain SQL in `supabase/migrations`. Create one with `npm run db:new <name>` and apply it with
   `npm run db:reset`. Drizzle is used for queries only. After changing the schema, run `npm run db:pull`
   (introspects the database into `.drizzle/`) and port the result into `src/models`.

   **Hosted project (production):** create a project at [supabase.com](https://supabase.com), then link it and push
   the migrations:

   ```bash
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npm run db:push
   ```

   Set `NEXT_PUBLIC_SUPABASE_URL` (`https://<project-ref>.supabase.co`) and the keys from Dashboard → Project
   Settings → API Keys. For `DATABASE_URL`, use Dashboard → Connect: the transaction pooler (port 6543) at runtime,
   and the direct or session connection (port 5432) for `db:pull`.

   <!-- #region @module:auth -->

   **Google sign-in (local):** create an OAuth client in Google Cloud Console (Web application) with the authorized
   redirect URI `http://127.0.0.1:54321/auth/v1/callback`, then create `supabase/.env` (git-ignored) and restart with
   `npm run db:stop && npm run db:start`. Email and password sign-in works locally with no extra setup.

   ```bash
   SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=<client id>
   SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=<client secret>
   ```

   **Google sign-in (hosted):** use `https://<project-ref>.supabase.co/auth/v1/callback` as the redirect URI, then
   enable Authentication → Providers → Google in Supabase and paste the client ID and secret. Each environment needs
   its own setup. Set Authentication → URL Configuration → Redirect URLs to include
   `http://localhost:3000/auth/callback` (and your production URL).
   <!-- #endregion @module:auth -->
<!-- #endslot database-setup -->

  <!-- #slot auth-demo-flow -->
  - Sign in/up on the `/login` page (email and password)
  <!-- #endslot auth-demo-flow -->

<!-- #slot auth-demo-redirect -->
Try accessing `/profile` without signing in - you'll be redirected to `/login`.
<!-- #endslot auth-demo-redirect -->

<!-- #slot scripts-database -->
- `npm run db:start` / `npm run db:stop` - Start or stop the local Supabase stack (needs Docker) <!-- @module:database -->
- `npm run db:new <name>` - Create a new SQL migration <!-- @module:database -->
- `npm run db:push` - Apply migrations to the linked Supabase project <!-- @module:database -->
- `npm run db:reset` - Reset the local Supabase database (needs Docker) <!-- @module:database -->
- `npm run db:pull` - Introspect the database into Drizzle schema files <!-- @module:database -->
<!-- #endslot scripts-database -->

<!-- #slot realtime-docs -->
<!-- #region @module:realtime -->

## ⚡ Realtime

Use `useRealtimeTable` from `@/hooks` to react to Postgres changes in the browser. A table only emits events when it is
in the realtime publication and has an RLS `select` policy for the signed-in user. Add both in a migration:

```sql
alter publication supabase_realtime add table public.messages;

create policy "Users can read their messages" on public.messages
  for select to authenticated using ((select auth.uid()) = author_auth_id);
```

Pair it with Apollo by refetching the matching query on each event:

```ts
useRealtimeTable({ table: 'messages', onChange: () => refetch() })
```

<!-- #endregion @module:realtime -->
<!-- #endslot realtime-docs -->
