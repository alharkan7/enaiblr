import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo-color.svg";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0" aria-label="Enaiblr">
      <Image src={logo} alt="Enaiblr Logo" width={32} height={32} />
    </Link>
  );
}
