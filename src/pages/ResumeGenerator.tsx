import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Sparkles, Plus, Trash2, Briefcase, GraduationCap, User, Wrench, Palette, Minimize2, Award, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

const ResumeGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("modern");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: "",
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    { id: "1", title: "", company: "", duration: "", description: "" }
  ]);

  const [education, setEducation] = useState<Education[]>([
    { id: "1", degree: "", school: "", year: "" }
  ]);

  const addExperience = () => {
    setExperiences([...experiences, { 
      id: Date.now().toString(), 
      title: "", 
      company: "", 
      duration: "", 
      description: "" 
    }]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    setEducation([...education, { 
      id: Date.now().toString(), 
      degree: "", 
      school: "", 
      year: "" 
    }]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(edu => edu.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const generateResume = async () => {
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least your name and email.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('resume-ai', {
        body: {
          type: 'generate-resume',
          data: {
            ...formData,
            experiences,
            education,
            style: selectedStyle,
          }
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedResume(data.result);
      
      toast({
        title: "Resume Generated!",
        description: "Your ATS-optimized resume is ready for download.",
      });
    } catch (error: unknown) {
      console.error('Error generating resume:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate resume';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!generatedResume) return;
    
    const pdf = new jsPDF();
    const lines = generatedResume.split("\n");
    let y = 20;
    
    pdf.setFont("helvetica", "normal");
    
    lines.forEach((line) => {
      if (line.trim() === formData.fullName.toUpperCase() || line.includes(formData.fullName)) {
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
      } else if (line === line.toUpperCase() && line.trim().length > 0 && line.trim().length < 30) {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        y += 5;
      } else {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
      }
      
      const splitLine = pdf.splitTextToSize(line, 180);
      pdf.text(splitLine, 15, y);
      y += splitLine.length * 5;
      
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
    });
    
    pdf.save(`${formData.fullName || "resume"}_resume.pdf`);
    
    toast({
      title: "Downloaded!",
      description: "Your resume has been saved as a PDF.",
    });
  };

  return (
    <Layout>
      <section className="py-8 sm:py-12 md:py-20">
        <div className="container px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              AI Resume Generator
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Create Your Professional Resume
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-2">
              Fill in your details and let AI craft an ATS-optimized resume for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-4 sm:p-6 md:p-8">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6 h-auto p-1">
                    <TabsTrigger value="personal" className="flex items-center justify-center gap-1 text-[10px] sm:text-xs md:text-sm py-2 px-1 sm:px-2">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline sm:inline">Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex items-center justify-center gap-1 text-[10px] sm:text-xs md:text-sm py-2 px-1 sm:px-2">
                      <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline sm:inline">Exp</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex items-center justify-center gap-1 text-[10px] sm:text-xs md:text-sm py-2 px-1 sm:px-2">
                      <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline sm:inline">Edu</span>
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex items-center justify-center gap-1 text-[10px] sm:text-xs md:text-sm py-2 px-1 sm:px-2">
                      <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline sm:inline">Skills</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
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
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="New York, NY"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        placeholder="Brief overview of your professional background and goals..."
                        rows={4}
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-6">
                    {experiences.map((exp, index) => (
                      <div key={exp.id} className="p-4 border border-border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Experience {index + 1}</span>
                          {experiences.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input
                              placeholder="Software Engineer"
                              value={exp.title}
                              onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                              placeholder="Tech Company Inc."
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            placeholder="Jan 2020 - Present"
                            value={exp.duration}
                            onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Key achievements and responsibilities..."
                            rows={3}
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addExperience} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-6">
                    {education.map((edu, index) => (
                      <div key={edu.id} className="p-4 border border-border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Education {index + 1}</span>
                          {education.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            placeholder="Bachelor of Science in Computer Science"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>School</Label>
                            <Input
                              placeholder="University of California"
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Input
                              placeholder="2020"
                              value={edu.year}
                              onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addEducation} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Textarea
                        id="skills"
                        placeholder="JavaScript, React, Node.js, Python, AWS, Docker, Git..."
                        rows={6}
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      />
                      <p className="text-sm text-muted-foreground">
                        Separate skills with commas. Include both technical and soft skills.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Style Selection */}
                <div className="mt-8 pt-6 border-t border-border">
                  <Label className="mb-4 block text-base font-semibold">Choose Resume Style</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: "modern", icon: Palette, label: "Modern", desc: "Clean & creative" },
                      { id: "minimal", icon: Minimize2, label: "Minimal", desc: "Simple & elegant" },
                      { id: "professional", icon: Award, label: "Professional", desc: "Classic & formal" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          selectedStyle === style.id
                            ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                            : "border-border hover:border-accent/50 hover:bg-secondary/50"
                        }`}
                      >
                        {selectedStyle === style.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                            <Check className="w-3 h-3 text-accent-foreground" />
                          </div>
                        )}
                        <style.icon className={`w-6 h-6 mb-2 ${selectedStyle === style.id ? "text-accent" : "text-muted-foreground"}`} />
                        <p className={`font-semibold ${selectedStyle === style.id ? "text-accent" : "text-foreground"}`}>{style.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{style.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateResume}
                  disabled={isGenerating}
                  className="w-full mt-6"
                  variant="accent"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Resume
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
              <Card className="p-6 md:p-8 min-h-[600px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Preview</h2>
                  {generatedResume && (
                    <Button onClick={downloadPDF} variant="accent" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>

                {generatedResume ? (
                  <div className="bg-secondary/30 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[600px]">
                    {generatedResume}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px] text-center text-muted-foreground">
                    <FileText className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-2">No Resume Yet</p>
                    <p className="text-sm">
                      Fill in your details and click "Generate Resume" to see your professional resume here.
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

export default ResumeGenerator;
