import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flashlight, FlashlightOff, Camera, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QrScanner from "qr-scanner";

const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    // Check if camera is available
    QrScanner.hasCamera().then((hasCamera) => {
      setHasCamera(hasCamera);
      if (!hasCamera) {
        setError("No camera found on this device");
      }
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!videoRef.current || !hasCamera) return;

    try {
      setError(null);
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          setLastResult(result.data);
          // Save to history (localStorage for now)
          const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
          const newEntry = {
            id: Date.now().toString(),
            text: result.data,
            timestamp: new Date().toISOString(),
            type: 'scanned'
          };
          history.unshift(newEntry);
          localStorage.setItem('qr-history', JSON.stringify(history.slice(0, 100))); // Keep last 100
          
          toast({
            title: "QR Code Scanned!",
            description: result.data.length > 50 ? `${result.data.substring(0, 50)}...` : result.data,
          });
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
        }
      );

      scannerRef.current = scanner;
      await scanner.start();
      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setError("Failed to access camera. Please check permissions.");
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const toggleFlashlight = async () => {
    if (scannerRef.current) {
      try {
        if (flashlightOn) {
          await scannerRef.current.turnFlashOff();
          setFlashlightOn(false);
        } else {
          await scannerRef.current.turnFlashOn();
          setFlashlightOn(true);
        }
      } catch (err) {
        toast({
          title: "Flashlight Error",
          description: "This device doesn't support flashlight control.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">QR & Barcode Scanner</h1>
        <p className="text-muted-foreground">Point your camera at a QR code or barcode</p>
      </div>

      {/* Scanner Area */}
      <Card className="flex-1 p-4 bg-card border-border relative overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Camera Not Available</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            {/* Scan overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 border-2 border-primary rounded-lg animate-pulse-glow" />
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              {isScanning ? (
                <Button onClick={stopScanning} variant="destructive" size="lg" className="rounded-full">
                  Stop Scanning
                </Button>
              ) : (
                <Button onClick={startScanning} variant="default" size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 rounded-full">
                  <Camera className="h-5 w-5 mr-2" />
                  Start Scanning
                </Button>
              )}
              
              {isScanning && (
                <Button
                  onClick={toggleFlashlight}
                  variant="secondary"
                  size="lg"
                  className="rounded-full"
                >
                  {flashlightOn ? (
                    <FlashlightOff className="h-5 w-5" />
                  ) : (
                    <Flashlight className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Last Result */}
      {lastResult && (
        <Card className="mt-4 p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-2">Last Scanned:</h3>
          <p className="text-muted-foreground break-all">{lastResult}</p>
          <Button
            onClick={() => navigator.clipboard.writeText(lastResult)}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Copy to Clipboard
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Scanner;