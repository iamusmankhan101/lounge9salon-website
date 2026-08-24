import './NotFound.css'

/**
 * Every path reaches the client, because vercel.json rewrites everything that
 * is not /api to index.html — so an unknown URL cannot be answered with a real
 * 404 status here. This is the view for one; the status stays 200.
 */
function NotFound() {
  return (
    <main className="notfound">
      <a href="/" className="notfound__logo">
        <img
          src="/lounge-8-salon-logo.png"
          alt="Lounge 8 Salon"
          className="brand-logo"
        />
      </a>

      <p className="notfound__code">404</p>
      <h1 className="notfound__title">This page doesn&apos;t exist</h1>
      <p className="notfound__text">
        The link may be out of date, or the address mistyped. Everything else is
        where you left it.
      </p>

      <div className="notfound__actions">
        <a href="/" className="notfound__cta">
          Back to the salon
        </a>
        <a href="/services" className="notfound__link">
          See the service menu
        </a>
      </div>
    </main>
  )
}

export default NotFound
