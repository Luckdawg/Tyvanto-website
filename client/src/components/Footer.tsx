import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#0D1B3E] text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <img src="/tyvanto_logo.png" alt="Tyvanto" className="h-14 sm:h-16 mb-4 object-contain" />
            <p className="text-sm mb-4">
              AI-powered intelligence platform for cybersecurity and operational intelligence across multiple industries.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons could go here */}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/platform"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Overview</span></Link></li>
              <li><Link href="/platform/ai-capabilities"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">AI Capabilities</span></Link></li>
              <li><Link href="/platform/tru-insight"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Tru-InSight™</span></Link></li>
              <li><Link href="/platform/architecture"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Platform Architecture</span></Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/solutions/cybersecurity"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Cybersecurity</span></Link></li>
              <li><Link href="/solutions/smart-cities"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Smart Cities</span></Link></li>
              <li><Link href="/solutions/critical-infrastructure"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Critical Infrastructure</span></Link></li>
              <li><Link href="/solutions/healthcare"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Healthcare</span></Link></li>
              <li><Link href="/solutions/financial-services"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Financial Services</span></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/company/about"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">About Us</span></Link></li>
              <li><Link href="/company/careers"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Careers</span></Link></li>
              <li><Link href="/company/news"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">News</span></Link></li>
              <li><Link href="/company/contact"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Contact</span></Link></li>
              <li><Link href="/partners"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Partners</span></Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1B3A8C] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Tyvanto. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/legal/privacy"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Privacy Policy</span></Link>
            <Link href="/legal/terms"><span className="hover:text-[#00A3FF] cursor-pointer transition-colors">Terms of Service</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
