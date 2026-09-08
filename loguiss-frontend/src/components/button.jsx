export function Button({
    children,
    className = '',
    ...props
}) {
    return (
        <button
            className={`
                cursor-pointer
                border-none
                rounded-sm
                text-white
                font-bold
                transition-colors
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}