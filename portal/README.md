# Portal

`/portal/` is the Mentis Veritas sign-in page (AL-60, design and threat model MV-023 in Jarvis Document Control).

- Sign-in: email and password, then a six-digit authenticator code every time.
- Access is decided by the database (Supabase row level security), never by this page. Roles: pending, client, staff, admin, owner.
- `config.js` holds the project address and the publishable key (public by design). Empty values show "Opening soon."
- `vendor/` is the Supabase client (MIT), served from this site so no third-party script host is needed.
