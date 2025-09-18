import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Download, Share, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";

const Generator = () => {
  const [inputText, setInputText] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const location = useLocation();

  // Pre-fill text if navigated from history
  useEffect(() => {
    if (location.state?.presetText) {
      setInputText(location.state.presetText);
      setGeneratedCode(location.state.presetText);
    }
  }, [location.state]);

  const generateCode = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text or URL to generate QR code",
        variant: "destructive",
      });
      return;
    }

    setGeneratedCode(inputText.trim());
    
    // Save to history
    const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    const newEntry = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      type: 'generated'
    };
    history.unshift(newEntry);
    localStorage.setItem('qr-history', JSON.stringify(history.slice(0, 100)));

    toast({
      title: "QR Code Generated!",
      description: "Your QR code is ready",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = canvas.toDataURL();
        link.click();
        
        toast({
          title: "Downloaded!",
          description: "QR code saved to your device",
        });
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code',
          text: generatedCode,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">QR Code Generator</h1>
        <p className="text-muted-foreground">Enter text or URL to generate a QR code</p>
      </div>

      {/* Input Section */}
      <Card className="p-4 bg-card border-border">
        <div className="space-y-4">
          <div>
            <Label htmlFor="input-text" className="text-foreground font-medium">
              Text or URL
            </Label>
            <Textarea
              id="input-text"
              placeholder="Enter text, URL, or any content you want to encode..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="mt-2 min-h-[100px] bg-input border-border text-foreground"
            />
          </div>
          
          <Button 
            onClick={generateCode} 
            disabled={!inputText.trim()}
            className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground font-semibold"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR Code
          </Button>
        </div>
      </Card>

      {/* Generated QR Code */}
      {generatedCode && (
        <Card className="p-6 bg-card border-border">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Generated QR Code</h3>
            
            {/* QR Code Display */}
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCode
                id="qr-code"
                value={generatedCode}
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox="0 0 256 256"
              />
            </div>

            {/* Generated Text */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground break-all">
                {generatedCode}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </Button>
              
              <Button onClick={downloadQR} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              <Button onClick={shareCode} variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Templates */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Quick Templates</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputText("https://example.com")}
            className="text-left justify-start"
          >
            Website URL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputText("mailto:example@email.com")}
            className="text-left justify-start"
          >
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputText("tel:+1234567890")}
            className="text-left justify-start"
          >
            Phone Number
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputText("WiFi:T:WPA;S:NetworkName;P:Password;;")}
            className="text-left justify-start"
          >
            WiFi Network
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Generator;