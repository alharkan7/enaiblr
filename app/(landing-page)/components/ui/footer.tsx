import Logo from "./logo";
import Image from "next/image";
import Link from "next/link";
import FooterIllustration from "@/public/images/footer-illustration.svg";
import { Github, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  company: {
    title: "Company",
    links: [
      { label: "About us", href: "#hero" },
      { label: "Careers", href: "mailto:mail@enaiblr.org" },
    ],
  },
  product: {
    title: "AI Products",
    links: [
      { label: "Software Solutions", href: "#workflows" },
      { label: "Apps Platform", href: "/apps" },
      { label: "Skills Training", href: "#workflows" },
    ],
  },
  publications: {
    title: "Publications",
    links: [
      { label: "Blog", href: "/publications" },
      { label: "Research", href: "/publications" },
      { label: "Data", href: "/publications" },
    ],
  },
};

export default function Footer() {
  return (
    <footer>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Footer illustration */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 w-[90%] md:w-auto"
          aria-hidden="true"
        >
          <Image
            className="max-w-none w-full md:w-auto h-auto object-contain"
            src={FooterIllustration}
            width={1076}
            height={378}
            alt="Footer illustration"
          />
        </div>
        <div className="grid grid-cols-2 justify-between gap-12 py-8 sm:grid-rows-[auto_auto] md:grid-cols-3 md:grid-rows-[auto_auto] md:py-12 lg:grid-cols-[repeat(3,minmax(0,180px))_1fr] lg:grid-rows-1 xl:gap-20">
          {/* Footer link blocks */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-200">{section.title}</h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('mailto:') || link.href.startsWith('http') ? (
                      <a
                        className="text-indigo-200/65 transition hover:text-indigo-500"
                        href={link.href}
                        target={link.href.startsWith('http') ? "_blank" : undefined}
                        rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        className="text-indigo-200/65 transition hover:text-indigo-500"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* 5th block */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:text-right">
            <div className="mb-3">
              <Logo />
            </div>
            <div className="text-sm">
              <p className="mb-3 text-indigo-200/65">
                &copy; enaiblr.org
                {/* <span className="text-gray-700"> · </span>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#0"
                >
                  Terms
                </a> */}
              </p>
              <ul className="inline-flex gap-2">
                <li>
                  <a
                    className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                    href="https://github.com/enaiblr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Github"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                    href="https://linkedin.com/company/enaiblr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                    href="mailto:mail@enaiblr.org"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
