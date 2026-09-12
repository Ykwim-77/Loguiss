export function Button({
    children,
    type = "button",
    className = '',
    ...props
}) {
    return (
        <button
            type={type}
            className={`cursor-pointer text-white border-none rounded-lg font-bold transition-colors ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}