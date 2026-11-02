# Login backend (Apps Script)

The app's sign-in checks a **private** Google Sheet through this script, so passwords never
sit in a public sheet.

## One-time setup
1. Create a new Google Sheet (keep it private). In row 1 of the first tab: `email` and `password`.
2. Add users as rows (plain-text passwords are fine for now).
3. In that sheet: **Extensions > Apps Script**. Delete the sample code and paste all of `auth.gs`. Save.
4. Reload the sheet. A new **Auth** menu appears. Run **Auth > Hash all passwords** (approve the permissions
   the first time). Passwords become `h1$salt$hash`. Run it again whenever you add a new plain-text password.
5. **Deploy > New deployment > Web app**: Execute as **Me**, Who has access **Anyone**. Copy the web app URL (ends in `/exec`).
6. Put that URL in `AUTH_URL` in `src/App.tsx`, then rebuild/deploy the app.

## How it behaves
- Sign-in returns a signed token (30 days). The app stores the token, never the password.
- Reopening the app is instant; the token is re-checked in the background. Deleting a user's row signs them out within ~1 minute.
- 5 wrong passwords for one email lock that email for 15 minutes.
- Re-deploy (Deploy > Manage deployments > Edit > New version) after changing `auth.gs`.
