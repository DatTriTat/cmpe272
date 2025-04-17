export default function Footer() {
    return (
      <footer className="w-full bg-gray-100 text-center text-sm text-gray-500 p-4">
        © {new Date().getFullYear()} Resume Analyzer. All rights reserved.
      </footer>
    );
  }