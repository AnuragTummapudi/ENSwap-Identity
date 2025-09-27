import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: "primary" | "secondary" | "accent";
}

const FeatureCard = ({ icon: Icon, title, description, gradient = "primary" }: FeatureCardProps) => {
  const gradientClasses = {
    primary: "from-primary/10 to-primary-glow/10 border-primary/20",
    secondary: "from-secondary/10 to-accent/10 border-secondary/20", 
    accent: "from-accent/10 to-success/10 border-accent/20"
  };

  return (
    <div className={`glass-card p-6 rounded-2xl hover-lift transition-smooth bg-gradient-to-br ${gradientClasses[gradient]} group`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 group-hover:animate-float">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-smooth">
        {title}
      </h3>
      
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;