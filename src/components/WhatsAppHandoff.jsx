import { useEffect, useState } from 'react'
import { PHONE, PHONE_HREF } from '../data/contact.js'
import './WhatsAppHandoff.css'

/**
 * The safety net under the booking handoff.
 *
 * Submitting a booking asks the browser to open WhatsApp, and that can quietly
 * fail — a popup blocker, an in-app browser, a desktop without WhatsApp
 * installed. The customer is left believing they have booked when nothing was
 * sent. So every confirmation screen also carries the same request as a plain
 * link they can press themselves, the message as text they can copy into any
 * chat, and the salon's phone number.
 *
 * The link is a real anchor rather than a scripted window.open, which is what
 * makes it survive the blockers that stop the automatic attempt.
 */
function WhatsAppHandoff({ link, message, onDone, doneLabel = 'Done' }) {
  const [copied, setCopied] = useState(false)

  // let the confirmation fade after a moment so the button reads as reusable
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2500)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
    } catch {
      // clipboard access is refused outside a secure context, and on some
      // in-app browsers — selecting the text by hand still works
      setCopied(false)
    }
  }

  return (
    <div className="handoff">
      <a className="handoff__open" href={link} target="_blank" rel="noreferrer">
        Open WhatsApp
      </a>

      <details className="handoff__details">
        <summary>WhatsApp didn&apos;t open?</summary>
        <p className="handoff__text">
          Copy your request and paste it into a message to us, or call the salon
          and we will book you in on the spot.
        </p>

        <div className="handoff__actions">
          <button type="button" className="handoff__copy" onClick={copy}>
            {copied ? 'Copied' : 'Copy the message'}
          </button>
          <a className="handoff__call" href={PHONE_HREF}>
            Call {PHONE}
          </a>
        </div>

        <pre className="handoff__message">{message}</pre>
      </details>

      {onDone && (
        <button type="button" className="handoff__done" onClick={onDone}>
          {doneLabel}
        </button>
      )}
    </div>
  )
}

export default WhatsAppHandoff
