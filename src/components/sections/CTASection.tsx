import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl gradient-bg p-6 sm:p-8 md:p-12 lg:p-16"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 mesh-bg opacity-30" />
          <div className="absolute -top-20 -right-20 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground/90 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              Your privacy is our priority
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6">
              Ready to Build Your Perfect Resume?
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/70 mb-6 sm:mb-8 md:mb-10 max-w-xl mx-auto">
              Join thousands of job seekers who've landed interviews with AI-powered resumes. 
              Start for free — no signup, no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/generator">
                <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                  Start Building Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
