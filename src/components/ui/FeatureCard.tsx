import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  gradient?: string;
  delay?: number;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href,
  gradient = "from-accent/10 to-accent/5",
  delay = 0,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Link to={href} className="block group">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 md:p-8 transition-all duration-300 hover:shadow-card hover:border-accent/30 hover:-translate-y-1">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Icon className="w-6 h-6 text-accent" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
            
            <div className="mt-4 flex items-center gap-2 text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Get Started</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
