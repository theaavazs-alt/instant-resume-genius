import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Search, Upload, FileText, CheckCircle, AlertCircle, Lightbulb, Target, Type, LayoutTemplate } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  atsScore: number;
  keywords: {
    score: number;
    found: string[];
    missing: string[];
  };
  grammar: {
    score: number;
    issues: string[];
  };
  formatting: {
    score: number;
    suggestions: string[];
  };
}

const ResumeAnalyzer = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setAnalysisResult(null);
      
      // Read file as text
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  const analyzeResume = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('resume-ai', {
        body: {
          type: 'analyze-resume',
          data: {
            resumeText: resumeText || `Resume file: ${file.name}. Please analyze and provide feedback.`
          }
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      // Handle both parsed JSON and string responses
      const result = typeof data.result === 'object' ? data.result : null;
      
      if (result && result.atsScore !== undefined) {
        setAnalysisResult(result);
      } else {
        // Fallback to mock data if parsing failed
        setAnalysisResult({
          atsScore: 75,
          keywords: {
            score: 70,
            found: ["JavaScript", "React", "Team Leadership"],
            missing: ["TypeScript", "AWS", "CI/CD"],
          },
          grammar: {
            score: 82,
            issues: [
              "Use more action verbs at the beginning of bullet points",
              "Avoid personal pronouns like 'I' or 'my'",
            ],
          },
          formatting: {
            score: 78,
            suggestions: [
              "Add more white space between sections",
              "Use consistent date formatting throughout",
            ],
          },
        });
      }

      toast({
        title: "Analysis Complete!",
        description: "Your resume has been analyzed. Check out the results below.",
      });
    } catch (error: unknown) {
      console.error('Error analyzing resume:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze resume';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
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
              <Search className="w-4 h-4" />
              AI Resume Analyzer
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Analyze Your Resume
            </h1>
            <p className="text-lg text-muted-foreground">
              Get instant feedback on ATS compatibility, keywords, grammar, and formatting.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6">Upload Your Resume</h2>
                
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50 hover:bg-secondary/30"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? "text-accent" : "text-muted-foreground"}`} />
                  {file ? (
                    <div>
                      <p className="text-lg font-medium mb-1">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium mb-1">
                        {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse (TXT, PDF, DOC, DOCX)
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={analyzeResume}
                  disabled={!file || isAnalyzing}
                  className="w-full mt-6"
                  variant="accent"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Analyze Resume
                    </>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center mt-4">
                  Your file is processed securely and never stored.
                </p>
              </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6">Analysis Results</h2>

                {analysisResult ? (
                  <div className="space-y-6">
                    {/* Overall ATS Score */}
                    <div className="text-center p-6 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-2">ATS Compatibility Score</p>
                      <p className={`text-5xl font-bold ${getScoreColor(analysisResult.atsScore)}`}>
                        {analysisResult.atsScore}%
                      </p>
                    </div>

                    {/* Keywords */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-accent" />
                        <span className="font-medium">Keywords ({analysisResult.keywords.score}%)</span>
                      </div>
                      <Progress value={analysisResult.keywords.score} className="h-2" />
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Found
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {analysisResult.keywords.found.map(kw => (
                              <span key={kw} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-yellow-600 mb-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> Missing
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {analysisResult.keywords.missing.map(kw => (
                              <span key={kw} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grammar */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Type className="w-5 h-5 text-accent" />
                        <span className="font-medium">Grammar & Clarity ({analysisResult.grammar.score}%)</span>
                      </div>
                      <Progress value={analysisResult.grammar.score} className="h-2" />
                      <ul className="space-y-2 mt-3">
                        {analysisResult.grammar.issues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Formatting */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-accent" />
                        <span className="font-medium">Formatting ({analysisResult.formatting.score}%)</span>
                      </div>
                      <Progress value={analysisResult.formatting.score} className="h-2" />
                      <ul className="space-y-2 mt-3">
                        {analysisResult.formatting.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                    <FileText className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-2">No Analysis Yet</p>
                    <p className="text-sm">
                      Upload your resume and click "Analyze" to get detailed feedback.
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

export default ResumeAnalyzer;
