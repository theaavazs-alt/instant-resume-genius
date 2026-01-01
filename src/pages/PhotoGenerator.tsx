import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, Download, Sparkles, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const photoStyles = [
  { id: "professional", label: "Professional", description: "Clean corporate look" },
  { id: "modern", label: "Modern", description: "Contemporary style" },
  { id: "classic", label: "Classic", description: "Traditional headshot" },
];

const PhotoGenerator = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("professional");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setGeneratedImage(null);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
  });

  const generatePhoto = async () => {
    if (!file || !preview) return;

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-photo', {
        body: {
          imageBase64: preview,
          style: selectedStyle,
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedImage(data.image);
      
      if (data.message) {
        toast({
          title: "Photo Processed",
          description: data.message,
        });
      } else {
        toast({
          title: "Photo Generated!",
          description: "Your professional headshot is ready for download.",
        });
      }
    } catch (error: unknown) {
      console.error('Error generating photo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate photo';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "professional-headshot.png";
    link.click();

    toast({
      title: "Downloaded!",
      description: "Your professional photo has been saved.",
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
              <Camera className="w-4 h-4" />
              AI Photo Generator
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Create Professional Headshots
            </h1>
            <p className="text-lg text-muted-foreground">
              Transform any photo into a polished, professional headshot perfect for your resume.
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
                <h2 className="text-xl font-semibold mb-6">Upload Your Photo</h2>
                
                <div
                  {...getRootProps()}
                  className={`relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all aspect-square ${
                    isDragActive
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50 hover:bg-secondary/30"
                  }`}
                >
                  <input {...getInputProps()} />
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <Upload className={`w-12 h-12 mb-4 ${isDragActive ? "text-accent" : "text-muted-foreground"}`} />
                      <p className="text-lg font-medium mb-1">
                        {isDragActive ? "Drop your photo here" : "Drag & drop your photo"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse (PNG, JPG, WEBP)
                      </p>
                    </div>
                  )}
                </div>

                {/* Style Selection */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Select Style</h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {photoStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-2 sm:p-3 rounded-lg border-2 text-center transition-all min-w-0 ${
                          selectedStyle === style.id
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <p className="text-xs sm:text-sm font-medium truncate">{style.label}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generatePhoto}
                  disabled={!file || isGenerating}
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
                      Generate Headshot
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>

            {/* Result Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Generated Headshot</h2>
                  {generatedImage && (
                    <Button onClick={downloadImage} variant="accent" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>

                <div className="aspect-square rounded-xl overflow-hidden bg-secondary/30">
                  {generatedImage ? (
                    <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                      <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-lg font-medium mb-2">No Photo Yet</p>
                      <p className="text-sm">
                        Upload a photo and click "Generate" to create your professional headshot.
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground text-center mt-4">
                  Your photos are processed securely and never stored.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PhotoGenerator;
