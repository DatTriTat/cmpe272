export default function Button({ children, className = "", ...props }) {
    return (
      <button
        {...props}
        className={`w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-xl transition-all ${className}`}
      >
        {children}
      </button>
    );
  }
  