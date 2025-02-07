import Link from "next/link";
import { Mail, Globe} from "lucide-react";
import { apps } from "@/config/apps";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-12 pb-4 relative z-[2]  backdrop-blur-sm">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:px-16">
          <div>
            <Link href="/ai-platform" className="text-2xl font-bold mb-4 block !text-black">
              en<span className="text-yellow-500 font-ibm-plex-mono-regular">ai</span>blr
            </Link>
            <p className="text-muted-foreground">
              Unlimited AI Platform
              <br></br>
              <a href="mailto:mail@enaiblr.org" className="underline">
                mail@enaiblr.org
              </a>
            </p>
            <br></br>
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <div className="flex space-x-2">
                <Link href="mailto:mail@enaiblr.org" className="text-muted-foreground hover:text-foreground">
                  <Mail className="size-5" />
                </Link>
                <Link href="#Hero" className="text-muted-foreground hover:text-foreground">
                  <Globe className="size-5" />
                </Link>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/publications" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Enaiblr Pro</h3>
            <ul className="space-y-2">
              {apps.filter(app => app.type === 'pro').map((app) => (
                <li key={app.slug}>
                  <Link href={`/${app.slug}`} className="text-muted-foreground hover:text-foreground">
                    {app.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Free Apps</h3>
            <ul className="space-y-2">
              {apps.filter(app => app.type === 'free').map((app) => (
                <li key={app.slug}>
                  <Link href={`/${app.slug}`} className="text-muted-foreground hover:text-foreground">
                    {app.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
        <div className="mt-12 pt-4 text-center text-muted-foreground">
          <p>&copy; {currentYear} <Link href="#Hero" className="text-yellow-500 hover:text-blue-700">Enaiblr</Link>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
