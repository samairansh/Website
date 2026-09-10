# SAMAIRANSH website

GitHub Pages-ready static website for SAMAIRANSH IT Consultancy.

## Brand/contact details
- Brand: SAMAIRANSH
- Office: 71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ
- Email: samairansh@gmail.com
- Phone: 7880228669
- Domain: https://www.samairansh.com/

## GitHub Pages + IONOS
1. Push the contents of this folder to the repository root.
2. In GitHub: Settings → Pages → Deploy from branch → main → / (root) → Save.
3. The included `CNAME` file uses `www.samairansh.com`.
4. In IONOS DNS, point `www` to `samairansh.github.io` using a CNAME record (replace `samairansh` with your exact GitHub username if different).
5. For the apex `samairansh.com`, use GitHub Pages' current A-record values shown in GitHub Pages settings, then enable HTTPS after DNS resolves.
6. In GitHub Pages settings, enable **Enforce HTTPS**.

## Forms
The contact forms use `mailto:` so they can work on static hosting without PHP. If you want server-side submissions, connect the forms to a service such as Formspree or host the PHP form on IONOS instead.
