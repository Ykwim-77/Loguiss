export function Inputs({
    type,
    placeholder,
    value,
    onChange,
    onKeyDown,
    onBlur,
    icon: Icon,
    rightElement,
    className = "",
    required,
    options = []
}) {
    return (
        <div
            className={`flex items-center gap-3 bg-gray rounded-sm p-3 border border-gray-200 mb-1 ${className}`}
        >
            {Icon && <Icon size={20} />}

            {type === "select" ? (
                <select
                    className="w-full outline-none bg-[#15102b] focus:border-[#4EDB4E] text-white"
                    value={value}
                    onChange={onChange}
                    required={required}
                >

                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full outline-none bg-transparent text-white"
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    value={value}
                    required={required}
                />
            )}

            {rightElement}
        </div>
    );
}