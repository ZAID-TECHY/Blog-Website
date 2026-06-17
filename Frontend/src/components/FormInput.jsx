export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required,
  rows,
}) {
  const Tag = rows ? 'textarea' : 'input'

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      <Tag
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`input-field ${rows ? 'resize-y min-h-[120px]' : ''} ${
          error ? 'border-accent ring-1 ring-accent/20' : ''
        }`}
      />
      {error && <p className="text-accent text-xs mt-0.5">{error}</p>}
    </div>
  )
}