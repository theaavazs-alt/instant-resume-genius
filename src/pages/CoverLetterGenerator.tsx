import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Download, Sparkles, FileText, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CoverLetterGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    jobTitle: "",
    companyName: "",
    skills: "",
    experience: "",
    whyInterested: "",
  });

  const generateCoverLetter = async () => {
    if (!formData.fullName || !formData.jobTitle || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, job title, and company name.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation (will be replaced with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const letterContent = `Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.companyName}. With my background in ${formData.skills || "relevant skills"} and experience in ${formData.experience || "the industry"}, I am confident I would be a valuable addition to your team.

${formData.whyInterested || `I am particularly drawn to ${formData.companyName} because of its reputation for excellence and innovation in the industry.`}

Throughout my career, I have demonstrated a commitment to delivering high-quality work and achieving results. I am skilled in problem-solving, communication, and collaboration—all qualities that would serve me well in this role.

I would welcome the opportunity to discuss how my experience and skills align with your needs. Thank you for considering my application.

Sincerely,
${formData.fullName}
${formData.email}`;
    
    setGeneratedLetter(letterContent);
    setIsGenerating(false);
    
    toast({
      title: "Cover Letter Generated!",
      description: "Your personalized cover letter is ready.",
    });
  };

  const copyToClipboard = async () => {
    if (!generatedLetter) return;
    
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard.",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const downloadLetter = () => {
    if (!generatedLetter) return;
    
    const blob = new Blob([generatedLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cover-letter-${formData.companyName || "company"}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Your cover letter has been saved.",
    });
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Mail className="w-4 h-4" />
              AI Cover Letter Generator
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Create Compelling Cover Letters
            </h1>
            <p className="text-lg text-muted-foreground">
              Generate personalized, professional cover letters tailored to any job.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6">Your Details</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        placeholder="Software Engineer"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="Tech Company Inc."
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Key Skills</Label>
                    <Input
                      id="skills"
                      placeholder="JavaScript, React, Team Leadership..."
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Relevant Experience</Label>
                    <Textarea
                      id="experience"
                      placeholder="Brief description of your relevant experience..."
                      rows={3}
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whyInterested">Why This Role?</Label>
                    <Textarea
                      id="whyInterested"
                      placeholder="What draws you to this company/role..."
                      rows={3}
                      value={formData.whyInterested}
                      onChange={(e) => setFormData({ ...formData, whyInterested: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  onClick={generateCoverLetter}
                  disabled={isGenerating}
                  className="w-full mt-6"
                  variant="accent"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <Card className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Preview</h2>
                  {generatedLetter && (
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button onClick={downloadLetter} variant="accent" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>

                {generatedLetter ? (
                  <div className="bg-secondary/30 rounded-lg p-6 whitespace-pre-wrap text-sm leading-relaxed max-h-[600px] overflow-auto">
                    {generatedLetter}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                    <FileText className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-2">No Letter Yet</p>
                    <p className="text-sm">
                      Fill in the details and click "Generate" to create your cover letter.
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CoverLetterGenerator;
