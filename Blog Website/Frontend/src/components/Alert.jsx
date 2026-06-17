export default function Alert({ type = 'error', message }) {
  if (!message) return null

  const styles = {
    error:   'bg-red-50 border-accent text-accent',
    success: 'bg-green-50 border-green-600 text-green-700',
    info:    'bg-blue-50 border-blue-500 text-blue-700',
  }

  return (
    <div className={`border-l-4 px-4 py-3 rounded text-sm ${styles[type]}`}>
      {message}
    </div>
  )
}