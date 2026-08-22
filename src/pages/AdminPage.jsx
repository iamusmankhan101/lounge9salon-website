import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  SignedOutError,
  checkSession,
  fetchServices,
  previewImport,
  removeService,
  runImport,
  saveService,
  signIn,
  signOut,
} from '../data/admin.js'
import {
  CATEGORY_OPTIONS,
  categoryName,
  formatPrice,
} from '../data/services.js'
import { refreshSalon } from '../data/salon.js'
import './AdminPage.css'

/**
 * The salon's own view of its service menu, at /admin.
 *
 * Everything the public site lists comes from here — add a service and it is
 * on the website as soon as the edge cache turns over, take one off and it is
 * gone. Behind a shared password (ADMIN_PASSWORD), checked server-side.
 */

const BLANK = {
  name: '',
  category: 'hair',
  price: '',
  durationMin: 60,
  summary: '',
  variablePrice: false,
  isActive: true,
  sortOrder: 0,
}

/* ------------------------------------------------------------------ *
 * Sign in
 * ------------------------------------------------------------------ */

function SignIn({ onSignedIn }) {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | working
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    if (status === 'working') return

    setStatus('working')
    setError('')

    try {
      await signIn(password)
      onSignedIn()
    } catch (signInError) {
      setError(signInError.message)
      setPassword('')
      setStatus('idle')
    }
  }

  return (
    <div className="admin-gate">
      <form className="admin-gate__form" onSubmit={onSubmit}>
        <img
          src="/lounge-8-salon-logo.png"
          alt="Lounge 8 Salon"
          className="brand-logo admin-gate__logo"
        />
        <h1 className="admin-gate__title">Service menu</h1>
        <p className="admin-gate__text">
          Sign in to add, edit, and retire the treatments the website lists.
        </p>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="admin-button"
          disabled={status === 'working'}
        >
          {status === 'working' ? 'Checking…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Add / edit
 * ------------------------------------------------------------------ */

/** One form for both jobs — `service` is null when adding. */
function ServiceForm({ service, onSave, onCancel, busy }) {
  const [form, setForm] = useState(() =>
    service ? { ...BLANK, ...service } : BLANK,
  )
  const [error, setError] = useState('')

  const update = (field) => (event) => {
    const { type, checked, value } = event.target
    setForm((current) => ({
      ...current,
      [field]: type === 'checkbox' ? checked : value,
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await onSave({
        ...form,
        price: Number(form.price),
        durationMin: Number(form.durationMin),
        sortOrder: Number(form.sortOrder),
      })
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form__grid">
        <label className="admin-field admin-field--wide">
          <span>Service name</span>
          <input
            type="text"
            required
            autoFocus
            value={form.name}
            onChange={update('name')}
            placeholder="Hydrafacial"
          />
        </label>

        <label className="admin-field">
          <span>Category</span>
          <select required value={form.category} onChange={update('category')}>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Price (PKR)</span>
          <input
            type="number"
            required
            min="0"
            step="100"
            value={form.price}
            onChange={update('price')}
            placeholder="6000"
          />
        </label>

        <label className="admin-field">
          <span>Duration (minutes)</span>
          <input
            type="number"
            required
            min="5"
            max="600"
            step="5"
            value={form.durationMin}
            onChange={update('durationMin')}
          />
        </label>

        <label className="admin-field">
          <span>Order within category</span>
          <input
            type="number"
            step="1"
            value={form.sortOrder}
            onChange={update('sortOrder')}
          />
        </label>

        <label className="admin-field admin-field--wide">
          <span>
            Description <em>optional — the category blurb is used instead</em>
          </span>
          <textarea
            rows="2"
            value={form.summary}
            onChange={update('summary')}
            placeholder="What the treatment involves, in a sentence."
          />
        </label>
      </div>

      <div className="admin-form__toggles">
        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.variablePrice}
            onChange={update('variablePrice')}
          />
          <span>
            Price varies — show it as <strong>from</strong> this amount
          </span>
        </label>

        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={update('isActive')}
          />
          <span>Live on the website</span>
        </label>
      </div>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-form__actions">
        <button type="submit" className="admin-button" disabled={busy}>
          {busy ? 'Saving…' : service ? 'Save changes' : 'Add service'}
        </button>
        <button type="button" className="admin-button--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ *
 * Importing from Salon Central
 * ------------------------------------------------------------------ */

/**
 * Brings the salon's existing catalogue across from its booking software, so
 * a menu that already exists there does not have to be retyped here.
 *
 * Importing only ever adds. A service already brought across is left as it is,
 * edits included, so this is safe to run again whenever the software gains
 * something new.
 */
function Import({ onImported, onSignedOut }) {
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('idle') // idle | looking | ready | working
  const [error, setError] = useState('')
  const [showSkipped, setShowSkipped] = useState(false)

  const look = async () => {
    setStatus('looking')
    setError('')
    try {
      setPreview(await previewImport())
      setStatus('ready')
    } catch (lookError) {
      if (lookError instanceof SignedOutError) return onSignedOut()
      setError(lookError.message)
      setStatus('idle')
    }
  }

  const bringIn = async () => {
    setStatus('working')
    setError('')
    try {
      const result = await runImport()
      setPreview(null)
      setStatus('idle')
      onImported(result.added)
    } catch (importError) {
      if (importError instanceof SignedOutError) return onSignedOut()
      setError(importError.message)
      setStatus('ready')
    }
  }

  return (
    <section className="admin-import">
      <div className="admin-import__head">
        <div>
          <h2 className="admin-import__title">Salon Central</h2>
          <p className="admin-import__text">
            Bring the treatments already in your booking software across to the
            website. Nothing already here is changed or overwritten.
          </p>
        </div>

        {status !== 'ready' && (
          <button
            type="button"
            className="admin-button--ghost"
            disabled={status === 'looking'}
            onClick={look}
          >
            {status === 'looking' ? 'Checking…' : 'Check for services'}
          </button>
        )}
      </div>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {status === 'ready' && preview && (
        <div className="admin-import__result">
          <p className="admin-import__summary">
            <strong>{preview.found}</strong> in the software ·{' '}
            <strong>{preview.pending.length}</strong> ready to bring in ·{' '}
            {preview.alreadyIn} already here · {preview.skipped.length} left out
          </p>

          {preview.pending.length > 0 && (
            <ul className="admin-import__list">
              {preview.pending.map((service) => (
                <li key={service.sourceId}>
                  <span>{service.name}</span>
                  <span className="admin-import__meta">
                    {categoryName(service.category)} ·{' '}
                    {formatPrice({
                      price: service.price,
                      from: service.variablePrice,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {preview.skipped.length > 0 && (
            <div className="admin-import__skipped">
              <button
                type="button"
                className="admin-link"
                onClick={() => setShowSkipped((open) => !open)}
              >
                {showSkipped ? 'Hide' : 'Show'} the {preview.skipped.length} left
                out
              </button>

              {showSkipped && (
                <>
                  <p className="admin-import__note">
                    Client packages are held back on purpose — they carry a
                    customer&apos;s name and what they paid, which cannot go on a
                    public page. Add anything you do want by hand.
                  </p>
                  <ul className="admin-import__list admin-import__list--muted">
                    {preview.skipped.map((service, i) => (
                      <li key={`${service.name}-${i}`}>
                        <span>{service.name}</span>
                        <span className="admin-import__meta">
                          {service.reason}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          <div className="admin-form__actions">
            <button
              type="button"
              className="admin-button"
              disabled={!preview.pending.length || status === 'working'}
              onClick={bringIn}
            >
              {preview.pending.length
                ? `Bring in ${preview.pending.length} services`
                : 'Nothing new to bring in'}
            </button>
            <button
              type="button"
              className="admin-button--ghost"
              onClick={() => {
                setPreview(null)
                setStatus('idle')
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * The menu
 * ------------------------------------------------------------------ */

function ServiceRow({ service, onEdit, onToggle, onDelete, busy }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <tr className={service.isActive ? '' : 'is-hidden'}>
      <td className="admin-table__name">
        {service.name}
        {!service.isActive && <span className="admin-tag">Hidden</span>}
      </td>
      <td>{categoryName(service.category)}</td>
      <td className="admin-table__price">
        {formatPrice({ price: service.price, from: service.variablePrice })}
      </td>
      <td>{service.durationMin} min</td>
      <td className="admin-table__actions">
        {confirming ? (
          <>
            <span className="admin-table__confirm">Delete for good?</span>
            <button
              type="button"
              className="admin-link admin-link--danger"
              disabled={busy}
              onClick={() => onDelete(service)}
            >
              Yes, delete
            </button>
            <button
              type="button"
              className="admin-link"
              onClick={() => setConfirming(false)}
            >
              Keep
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="admin-link"
              onClick={() => onEdit(service)}
            >
              Edit
            </button>
            <button
              type="button"
              className="admin-link"
              disabled={busy}
              onClick={() => onToggle(service)}
            >
              {service.isActive ? 'Hide' : 'Show'}
            </button>
            <button
              type="button"
              className="admin-link admin-link--danger"
              onClick={() => setConfirming(true)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  )
}

function Menu({ onSignedOut }) {
  const [services, setServices] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | a service
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  /**
   * Sends the panel back to the login screen if the session has run out, and
   * says whether it did — the caller shows anything else to the user itself.
   */
  const signedOut = useCallback(
    (thrown) => {
      if (!(thrown instanceof SignedOutError)) return false
      onSignedOut()
      return true
    },
    [onSignedOut],
  )

  const reload = useCallback(async () => {
    try {
      setServices(await fetchServices())
      setStatus('ready')
    } catch (loadError) {
      if (signedOut(loadError)) return
      setError(loadError.message)
      setStatus('error')
    }
  }, [signedOut])

  useEffect(() => {
    reload()
  }, [reload])

  // the public site caches its menu for a page load, so drop that copy
  // whenever this one changes — a staff member checking their work sees it
  const publish = (message) => {
    refreshSalon()
    setNotice(message)
  }

  const onSave = async (fields) => {
    setBusy(true)
    setError('')
    try {
      await saveService(fields)
      await reload()
      setEditing(null)
      publish(fields.id ? `Saved “${fields.name}”.` : `Added “${fields.name}”.`)
    } catch (saveError) {
      if (signedOut(saveError)) return
      throw saveError // the form shows it next to its own fields
    } finally {
      setBusy(false)
    }
  }

  const onToggle = async (service) => {
    setBusy(true)
    setError('')
    try {
      await saveService({ id: service.id, isActive: !service.isActive })
      await reload()
      publish(
        service.isActive
          ? `“${service.name}” is hidden from the website.`
          : `“${service.name}” is live on the website.`,
      )
    } catch (toggleError) {
      if (!signedOut(toggleError)) setError(toggleError.message)
    } finally {
      setBusy(false)
    }
  }

  const onDelete = async (service) => {
    setBusy(true)
    setError('')
    try {
      await removeService(service.id)
      await reload()
      publish(`Deleted “${service.name}”.`)
    } catch (deleteError) {
      if (!signedOut(deleteError)) setError(deleteError.message)
    } finally {
      setBusy(false)
    }
  }

  // grouped the way the website groups them, so the panel reads like the menu
  const groups = useMemo(() => {
    return CATEGORY_OPTIONS.map((option) => ({
      ...option,
      services: services.filter((service) => service.category === option.id),
    })).filter((group) => group.services.length)
  }, [services])

  const live = services.filter((service) => service.isActive).length

  return (
    <div className="admin">
      <header className="admin__header">
        <div>
          <img
            src="/lounge-8-salon-logo.png"
            alt="Lounge 8 Salon"
            className="brand-logo admin__logo"
          />
          <h1 className="admin__title">Service menu</h1>
          <p className="admin__count">
            {services.length} {services.length === 1 ? 'service' : 'services'} ·{' '}
            {live} live on the website
          </p>
        </div>

        <div className="admin__header-actions">
          <a href="/services" className="admin-link">
            View the website menu
          </a>
          <button
            type="button"
            className="admin-link"
            onClick={async () => {
              await signOut()
              onSignedOut()
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}

      <Import
        onSignedOut={onSignedOut}
        onImported={async (added) => {
          await reload()
          publish(
            added
              ? `Brought in ${added} ${added === 1 ? 'service' : 'services'} from Salon Central.`
              : 'Everything in Salon Central is already here.',
          )
        }}
      />

      <div className="admin__add">
        {editing === 'new' ? (
          <ServiceForm
            service={null}
            busy={busy}
            onSave={onSave}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <button
            type="button"
            className="admin-button"
            onClick={() => {
              setNotice('')
              setEditing('new')
            }}
          >
            Add a service
          </button>
        )}
      </div>

      {status === 'loading' && <p className="admin-empty">Loading the menu…</p>}

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {status === 'ready' && !services.length && (
        <p className="admin-empty">
          Nothing on the menu yet. Bring your existing treatments across from
          Salon Central above, or add one by hand — either way it is on the
          website within the minute.
        </p>
      )}

      {groups.map((group) => (
        <section key={group.id} className="admin__group">
          <h2 className="admin__group-name">{group.name}</h2>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Duration</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {group.services.map((service) =>
                editing?.id === service.id ? (
                  <tr key={service.id}>
                    <td colSpan="5" className="admin-table__editing">
                      <ServiceForm
                        service={service}
                        busy={busy}
                        onSave={onSave}
                        onCancel={() => setEditing(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    busy={busy}
                    onEdit={(chosen) => {
                      setNotice('')
                      setEditing(chosen)
                    }}
                    onToggle={onToggle}
                    onDelete={onDelete}
                  />
                ),
              )}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  )
}

function AdminPage() {
  const [session, setSession] = useState('checking') // checking | out | in

  useEffect(() => {
    let cancelled = false
    checkSession().then((signedIn) => {
      if (!cancelled) setSession(signedIn ? 'in' : 'out')
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (session === 'checking') {
    return <p className="admin-empty admin-empty--page">One moment…</p>
  }

  return session === 'in' ? (
    <Menu onSignedOut={() => setSession('out')} />
  ) : (
    <SignIn onSignedIn={() => setSession('in')} />
  )
}

export default AdminPage
