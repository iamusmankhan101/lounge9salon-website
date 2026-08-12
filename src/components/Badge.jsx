import './Badge.css'

/**
 * Inline viewfinder badge that slides open inside a headline once the
 * surrounding section has revealed. Requires an ancestor with `.is-visible`.
 */
function Badge({ label, delay = 1.6 }) {
  return (
    <span
      className="badge"
      style={{ '--badge-delay': `${delay}s` }}
      aria-hidden="true"
    >
      <i className="badge__frame badge__frame--top" />
      <i className="badge__frame badge__frame--bottom" />
      {label}
    </span>
  )
}

export default Badge
