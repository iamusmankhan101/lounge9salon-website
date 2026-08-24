# Lounge 8 — website

React + Vite, deployed on Vercel. The service menu is managed by the salon in
an admin panel at `/admin` and stored in Supabase, seeded by importing the
salon's existing catalogue from Salon Central. Bookings are handed to WhatsApp
rather than to any booking software.

## Routes

| Path        | What it is                                  |
| ----------- | ------------------------------------------- |
| `/`         | the full site                               |
| `/home`     | the full site, at its pre-launch path       |
| `/services` | the service menu                            |
| `/admin`    | staff — import, add, edit, hide, and delete services |

## Setting it up

### 1. Supabase

Create a project at [supabase.com](https://supabase.com), then open **SQL
Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql),
and run it. That creates the `services` table the site reads from.

Row level security is on with no policies, which is deliberate: only the
server touches this table, using the service-role key, and that key bypasses
RLS. Nothing is reachable from a browser.

### 2. Environment variables

In **Vercel → Settings → Environment Variables**, add:

| Variable                    | Where to find it                                          |
| --------------------------- | --------------------------------------------------------- |
| `SUPABASE_URL`              | Supabase → Project Settings → API → Project URL           |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` secret |
| `ADMIN_PASSWORD`            | whatever you want the `/admin` password to be             |

`SALON_CENTRAL_URL` and `SALON_ID` are optional — they default to Lounge 8's
own, which is all the import needs.

The service-role key can read and write everything in the database. It is only
ever used inside `api/`, which runs on the server — never give it a `VITE_`
prefix, or Vite will bundle it into the JavaScript every visitor downloads.

Changing `ADMIN_PASSWORD` signs out everyone who is currently signed in, which
is what you want if it is ever shared too widely.

### 3. The salon's phone number

[`src/data/contact.js`](src/data/contact.js) still holds a placeholder number.
Set `PHONE`, `PHONE_HREF`, and `WHATSAPP` to the real line — `WHATSAPP` is the
same number in international format with no `+` and no spaces, which is the
only shape `wa.me` accepts. Nothing else in the site hardcodes a number.

## Bringing in the existing menu

The salon's treatments already live in Salon Central, so they do not have to be
retyped. In `/admin`, under **Salon Central**, choose **Check for services**:
the panel lists what the software holds, what it would bring in, and what it is
leaving behind. **Bring in N services** does it.

Of the 115 services currently in the software, 84 import and 31 are held back:

- **23 client packages** — the `package` category is every deal arranged for a
  named customer ("Rabia pkg", "Khala Naheeda", "Irsa (mother in law)").
  Importing them would put customers' names and their bills on a public page,
  so they are never brought across. Add any you actually want by hand.
- **5 till-only entries** — "test", "pay back amount", and the like.
- **3 named like personal packages**, wherever they were filed.

On the way in, known typos are corrected ("Hyaluronic aciad facial" →
Hyaluronic Acid Facial), names are title-cased, and each treatment is filed
into one of the website's seven categories by name — the software files
manicures, massages, and waxing all under "skin". That tidying lives in
[`api/_curate.js`](api/_curate.js) and runs **once, at import**.

**Import only ever adds.** A service already brought across is left exactly as
it is, including any edit made to it here since — services are matched on the
Salon Central id they came from. So it is safe to run again whenever the
software gains something new; it will bring in only that.

Nothing is ever written back to Salon Central, and nothing but the service list
is read from it. That endpoint also returns the salon's staff records and
appointment book — customer names, numbers, and what they paid — and none of it
is read, stored, or shown.

## Adding services

Go to `/admin`, sign in, and use **Add a service**. Each one has a name, a
category, a price in whole rupees, and a duration. Beyond that:

- **Order within category** — lower numbers come first on the website.
- **Description** — optional. Left blank, the treatment inherits its category's
  blurb, which is what most should do.
- **Price varies** — shows the price as *from PKR x*, for work like colour
  where length changes the quote.
- **Live on the website** — uncheck to keep a service in the panel but off the
  public menu. **Hide** does the same from the list; **Delete** is permanent.

Changes reach the website within a minute — the public menu is cached at the
edge for 60 seconds.

The seven categories, their photography, and their introductory copy live in
[`src/data/services.js`](src/data/services.js). Adding an eighth means editing
that file and the matching `CATEGORIES` list in [`api/_store.js`](api/_store.js).

## Opening hours

In `OPENING_HOURS` in [`src/data/salon.js`](src/data/salon.js). They drive the
footer, the booking panel, and which time slots the booking form offers, and
they change rarely enough to be worth a deploy.

## Bookings

Nothing is stored and nothing is booked automatically. The form composes the
request as a WhatsApp message — service, date, time, name, phone — and opens
it in a chat with the salon, already written. Staff confirm the slot in that
thread. The customer is told exactly that, so no one leaves thinking they hold
a slot they do not.

## Working on it locally

```sh
npm install
npm run dev      # the site, without any /api routes
npm run lint
npm run build
```

`npm run dev` serves the front end only, so `/admin` and the service menu will
be empty. To run the API routes locally, use `npx vercel dev` with the three
environment variables above in a `.env` file.
