# Deploying the CCA-F portal

## GitHub Pages

1. Put this folder at the root of a GitHub repository and push it.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then `main` and `/(root)`.
4. Open the URL GitHub shows after deployment.

The portal requires Supabase sign-in, so complete the account setup below before sharing it.

## Configure user accounts and cross-device progress

1. Create a Supabase project.
2. Run `supabase.sql` and `restrict-email-domain.sql` in its SQL editor.
3. In **Authentication → Hooks**, enable the **Before User Created** hook with `public.hook_restrict_signup_to_algorims`.
4. In **Authentication → Providers**, configure and enable Google using the callback URL shown by Supabase.
5. In **Authentication → URL Configuration**, set the Site URL to the GitHub Pages URL and add the same URL to Redirect URLs.
6. Copy the Project URL and **publishable** key into `cca-f-config.js`, then push again.

Never put a Supabase secret or service-role key in this repository. Row Level Security in `supabase.sql` ensures signed-in users can only read and write their own attempts.
