interface ToggleProps<T extends string> {
  label: string
  options: Record<T, string>
  value: T
  onChange: (value: T) => void
}

/*clic = onChange(key)*/
function Toggle<T extends string>({ label, options, value, onChange }: ToggleProps<T>) {
  return (
    <div className="toggle" role="group" aria-label={label}>
      {(Object.keys(options) as T[]).map((key) => (
        <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)}>
          {options[key]}
        </button>
      ))}
    </div>
  )
}

export default Toggle