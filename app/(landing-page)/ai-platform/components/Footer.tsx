import Link from "next/link";
import { Mail, Globe, Phone } from "lucide-react";
import { apps } from "@/config/apps";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-12 pb-4 relative z-[2]  backdrop-blur-sm">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:px-16">
          <div>
            <Link href="/ai-platform" className="text-2xl font-bold mb-4 block !text-black">
              en<span className="text-blue-600 font-ibm-plex-mono-regular">ai</span>blr
            </Link>
            <p className="text-muted-foreground">
              Platform AI All-in-One Tanpa Batas
              <br></br>
              <br></br>
              <b>PT. Bestari Media Teknologi</b>
              <br></br>
              <a href="mailto:mail@enaiblr.org" className="underline">
                mail@enaiblr.org
              </a> 
              <br></br>
              <a href="https://wa.me/+6281280077690">
              +62 812-8007-7690
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Tentang Produk</h3>
            <ul className="space-y-2">
              {/* <li>
                <Link href="#Hero" className="text-muted-foreground hover:text-foreground">
                  Tentang Kami
                </Link>
              </li> */}
              {/* <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li> */}
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground">
                  Fitur
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
                  Harga
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-muted-foreground hover:text-foreground">
                  Testimoni
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="text-muted-foreground hover:text-foreground">
                  Affiliate
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
          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <div className="flex space-x-4">
              <Link href="mailto:mail@enaiblr.org" className="text-muted-foreground hover:text-foreground">
                <Mail className="size-5" />
              </Link>
              <Link href="https://wa.me/+6281280077690" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
                <Phone className="size-5" />
              </Link>
              <Link href="#Hero" className="text-muted-foreground hover:text-foreground">
                <Globe className="size-5" />
              </Link>
              {/* <Link href="/ai-platform" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="size-5" />
              </Link> */}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-4 text-center text-muted-foreground">
          <p>&copy; {currentYear} <Link href="#Hero" className="text-blue-600 hover:text-blue-700">Enaiblr</Link>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
