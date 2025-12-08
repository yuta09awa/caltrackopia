import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Upload, X, RotateCcw, Loader2 } from "lucide-react";
import { useAnalyzeFood } from "../hooks/useAnalyzeFood";
import NutritionResultCard from "./NutritionResultCard";
import { toast } from "sonner";

interface SnapToTrackProps {
  onAddToLog?: (result: any) => void;
}

const SnapToTrack = ({ onAddToLog }: SnapToTrackProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { analyze, isAnalyzing, result, reset } = useAnalyzeFood();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      toast.error("Could not access camera. Please allow camera permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedImage(imageData);
      stopCamera();
    }
  }, [stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    // Extract base64 data without the data URL prefix
    const base64Data = capturedImage.split(",")[1];
    await analyze(base64Data);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    reset();
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    reset();
    setIsOpen(false);
  };

  const handleAddToLog = () => {
    if (result && onAddToLog) {
      onAddToLog(result);
      toast.success("Added to nutrition log");
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      else setIsOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Camera className="w-4 h-4" />
          Snap & Track
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Analyze Food</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* No image captured yet */}
          {!capturedImage && !isCameraActive && !result && (
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={startCamera}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Camera className="w-8 h-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Take Photo</span>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Upload className="w-8 h-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Upload Image</span>
                </CardContent>
              </Card>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {/* Camera active */}
          {isCameraActive && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg bg-black aspect-[4/3]"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <Button 
                  size="icon" 
                  variant="secondary"
                  onClick={stopCamera}
                >
                  <X className="w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={capturePhoto}
                >
                  <Camera className="w-6 h-6" />
                </Button>
              </div>
            </div>
          )}

          {/* Image preview */}
          {capturedImage && !result && (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured food"
                  className="w-full rounded-lg aspect-[4/3] object-cover"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={handleRetake}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleRetake}
                  disabled={isAnalyzing}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Retake
                </Button>
                <Button 
                  className="flex-1"
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <NutritionResultCard
              nutrition={result.nutrition}
              ingredients={result.ingredients}
              confidenceScore={result.confidence_score}
              dataSource={result.data_source}
              onAddToLog={handleAddToLog}
              onReportIssue={() => toast.info("Report feature coming soon")}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SnapToTrack;
