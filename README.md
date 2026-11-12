# SAMAIRANSH website

Static site (plain HTML/CSS/JS, no build step) for SAMAIRANSH IT Consultancy.
Works on GitHub Pages and on Cloudflare Pages.

## Edit
- Pages: `index.html`, `service.html`, `feature.html`, `blog.html`, `detail.html`, `contact.html`, `quote.html`, `privacy.html`
- Styles: `css/style.css` (colours and fonts are variables at the top, with automatic dark mode)
- Behaviour: `js/main.js` (menu, scroll reveal, contact forms)
- Domain used in canonical links, sitemap and social cards: `https://www.samairansh.com` (search the repo and replace if it changes)

## Cloudflare Pages (free)
1. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git > this repo, branch `main`.
2. Build command: none. Output directory: `/` (root).
3. Add the custom domain in the Pages project. Cloudflare then manages DNS (move nameservers from IONOS).
4. `_headers` (security + caching) and `_redirects` are picked up automatically.

## Contact form (free)
`functions/api/contact.js` receives the forms on Cloudflare Pages. Set these in Pages > Settings > Variables and Secrets:
- `RESEND_API_KEY` (secret), `CONTACT_TO`, `CONTACT_FROM` (a sender on a domain verified in Resend)
- `TURNSTILE_SECRET` (secret) and put the public site key in `TURNSTILE_SITE_KEY` at the top of `js/main.js`

Until those are set (or while hosted on GitHub Pages), the forms open the visitor's email app addressed to the site email.
