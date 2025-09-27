import { Github, Twitter, MessageCircle, BookOpen } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    { name: "Docs", icon: BookOpen, href: "#" },
    { name: "GitHub", icon: Github, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Discord", icon: MessageCircle, href: "#" },
  ];

  return (
    <footer className="glass-card border-t border-white/20 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and tagline */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-lg font-bold gradient-text">ENSwap Identity</span>
            <span className="text-sm text-muted-foreground">• Seamless Web3 Identity</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-smooth group"
              >
                <link.icon className="w-4 h-4 group-hover:animate-float" />
                <span className="text-sm">{link.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 ENSwap Identity. Built for the decentralized future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;