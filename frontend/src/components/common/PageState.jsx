export function PageState({ message, tone = 'info' }) {
  return <div className={`page-message page-message--${tone}`}>{message}</div>
}
