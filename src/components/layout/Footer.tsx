import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Phone, Mail, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a1614] text-white/90 pt-16 pb-8 no-print">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-0.5 shrink-0 overflow-hidden">
                <img src="/logo.svg" alt="BFA Logo" className="h-full w-full object-cover" />
              </div>
              <h3 className="text-lg font-bold leading-tight">বাংলাদেশ বুলবুল ললিতকলা একাডেমী বাফা</h3>
            </div>
            <p className="text-sm text-background/70">
              শিল্প ও সংস্কৃতির মাধ্যমে মানবিক মূল্যবোধ ও সৃজনশীলতার বিকাশে নিবেদিত একটি প্রতিষ্ঠান।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b border-background/20 pb-2">
              দ্রুত লিংক
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admission" className="hover:text-primary transition-colors">
                  ভর্তি আবেদন
                </Link>
              </li>
              <li>
                <Link to="/exam/results" className="hover:text-primary transition-colors">
                  পরীক্ষার ফলাফল
                </Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-primary transition-colors">
                  নোটিশ বোর্ড
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary transition-colors">
                  গ্যালারি
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b border-background/20 pb-2">
              যোগাযোগ
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>778 West Shewrapara, Beside Metro Station , Dhaka, Bangladesh, 1216</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+880 1912-888418</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>info@bdbafa.com</span>
              </li>
            </ul>
          </div>

          {/* Social & Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b border-background/20 pb-2">
              অফিস সময়
            </h4>
            <div className="text-sm space-y-2">
              <p>শনিবার - শুক্রবার</p>
              <p className="text-primary font-medium">সকাল ৯:০০ - বিকাল ৬:০০</p>
            </div>
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61579376563859"
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@bafatvbd"
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-background/60">
          <p>© ২০২৬ বুলবুল ললিতকলা একাডেমী। সর্বস্বত্ব সংরক্ষিত।</p>
          <p>
            ডেভেলপ করেছে{" "}
            <span className="text-primary font-medium"><a href="https://techvilo.com" target="_blank" rel="noopener noreferrer">Techvilo Ltd</a></span>
          </p>
        </div>
      </div>
    </footer>
  );
}
