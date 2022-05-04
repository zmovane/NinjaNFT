import Link from "next/link";

export function NavItem({ href, title }) {
  return (
    <>
    <li className="font-sans font-semibold text-lg">
      <Link href={href}>{title}</Link>
    </li>
    </>
  );
}
