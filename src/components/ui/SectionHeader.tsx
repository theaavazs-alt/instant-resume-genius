import { motion } from "framer-motion";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export const SectionHeader = ({
  badge,
  title,
  description,
  centered = true,
}: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`max-w-3xl ${centered ? "mx-auto text-center" : ""} mb-8 sm:mb-12 md:mb-16 px-2`}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          {badge}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};
