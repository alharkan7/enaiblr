import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Globe, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 pt-12 pb-4 relative z-[2]">
      <div className="container px-4 mx-auto backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:px-16">
          <div>
            <Link href="/about" className="text-2xl font-bold mb-4 block">
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
              <a href="https://wa.me/+628128007690">
              +62 812-8007-7690
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#Hero" className="text-muted-foreground hover:text-foreground">
                  Tentang Kami
                </Link>
              </li>
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
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Produk</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Search Engine
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-muted-foreground hover:text-foreground">
                  AI Chat
                </Link>
              </li>
              <li>
                <Link href="/imagen" className="text-muted-foreground hover:text-foreground">
                  Image Creator
                </Link>
              </li>
              <li>
                <Link href="/transcribe" className="text-muted-foreground hover:text-foreground">
                  Audio Transcriber
                </Link>
              </li>
              <li>
                <Link href="/voice" className="text-muted-foreground hover:text-foreground">
                  Text to Voice
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <div className="flex space-x-4">
              <Link href="mailto:enaiblr@gmail.com" className="text-muted-foreground hover:text-foreground">
                <Mail className="w-5 h-5" />
              </Link>
              <Link href="https://wa.me/+6281280077690" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
                <Phone className="w-5 h-5" />
              </Link>
              <Link href="#Hero" className="text-muted-foreground hover:text-foreground">
                <Globe className="w-5 h-5" />
              </Link>
              {/* <Link href="/about" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="w-5 h-5" />
              </Link> */}
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-4 text-center text-muted-foreground">
          <p>&copy; {currentYear} <Link href="#Hero" className="text-blue-600 hover:text-blue-700">Enaiblr</Link>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
