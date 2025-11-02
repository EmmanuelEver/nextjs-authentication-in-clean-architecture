"use client";

import Link from "next/link";
import UserDropdown from "./user-dropdown";

// Constants
const APP_NAME = "Custom Auth";
const NAV_ITEMS = [
  { name: "Dashboard", href: "/" },
  { name: "Profile", href: "/profile" },
];

const Navigation = () => (
  <nav className="hidden md:flex items-center space-x-6">
    {NAV_ITEMS.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        {item.name}
      </Link>
    ))}
  </nav>
);

// Main Header Component
const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">{APP_NAME}</span>
          </Link>
          <Navigation />
        </div>

        <div className="flex items-center space-x-4">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
