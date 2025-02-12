interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export function Select({
  label,
  options,
  error,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {/* label  */}
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
        >
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          appearance-none
          w-full
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          text-gray-700 dark:text-gray-200
          py-2 px-3
          pr-8
          rounded-md
          text-sm
          font-medium
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          cursor-pointer
          transition-colors
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${className}
        `}
      >
        {/* options  */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* error  */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
