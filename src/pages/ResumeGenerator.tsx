import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Sparkles, Plus, Trash2, Briefcase, GraduationCap, User, Wrench } from "lucide-react";
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
      <section className="py-12 md:py-20">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              AI Resume Generator
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Create Your Professional Resume
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill in your details and let AI craft an ATS-optimized resume for you.
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
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="personal" className="flex items-center gap-1 text-xs md:text-sm">
                      <User className="w-4 h-4 hidden sm:block" />
                      Personal
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex items-center gap-1 text-xs md:text-sm">
                      <Briefcase className="w-4 h-4 hidden sm:block" />
                      Experience
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex items-center gap-1 text-xs md:text-sm">
                      <GraduationCap className="w-4 h-4 hidden sm:block" />
                      Education
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex items-center gap-1 text-xs md:text-sm">
                      <Wrench className="w-4 h-4 hidden sm:block" />
                      Skills
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
                  <Label className="mb-3 block">Resume Style</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {["modern", "minimal", "professional"].map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                          selectedStyle === style
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        {style}
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
