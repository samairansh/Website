// Cloudflare Pages Function: POST /api/contact
// Needs (Pages > Settings > Variables and Secrets):
//   RESEND_API_KEY  (secret)  free tier at resend.com; sends the email
//   CONTACT_TO      (var)     where enquiries go, e.g. samairansh@gmail.com
//   CONTACT_FROM    (var)     a sender on a domain verified in Resend, e.g. "SAMAIRANSH <hello@samairansh.com>"
//   TURNSTILE_SECRET (secret) optional but recommended: Cloudflare Turnstile secret key
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const clean = (v, max) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: 'Invalid request.' }, 400); }

  if (d.website) return json({ ok: true });                       // honeypot: pretend success
  const name = clean(d.name, 120), email = clean(d.email, 200), subject = clean(d.subject, 150);
  const company = clean(d.company, 150), area = clean(d.area, 80);
  const message = String(d.message ?? '').trim().slice(0, 5000);
  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return json({ ok: false, error: 'Please enter your name, a valid email and a message.' }, 400);

  if (env.TURNSTILE_SECRET) {
    const token = d['cf-turnstile-response'];
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token || '', remoteip: request.headers.get('CF-Connecting-IP') || '' }),
    });
    const v = await r.json();
    if (!v.success) return json({ ok: false, error: 'Spam check failed. Please try again.' }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM)
    return json({ ok: false, error: 'Email is not configured yet. Please email us directly.' }, 503);

  const text = [`Name: ${name}`, `Email: ${email}`, company && `Company: ${company}`, area && `Area: ${area}`, '', message].filter(Boolean).join('\n');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: email, subject: `Website enquiry: ${subject || area || name}`, text }),
  });
  if (!res.ok) return json({ ok: false, error: 'Could not send your message. Please email us directly.' }, 502);
  return json({ ok: true });
}

export const onRequest = () => json({ ok: false, error: 'Method not allowed.' }, 405);
