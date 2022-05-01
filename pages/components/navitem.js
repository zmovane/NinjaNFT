import Link from "next/link";

export function NavItem({ href, title }) {
  return (
    <li className="font-semibold">
      <Link href={href}>{title}</Link>
    </li>
  );
}
