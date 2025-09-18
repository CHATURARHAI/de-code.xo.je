import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark opacity-50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        {/* App Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
          <div className="relative p-6 bg-card rounded-full border border-border shadow-glow-yellow">
            <QrCode className="h-16 w-16 text-primary animate-scale-in" />
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-4xl font-bold text-foreground mb-4 animate-fade-in">
          QR Scanner Pro
        </h1>
        
        <p className="text-muted-foreground mb-12 text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Scan, generate, and manage QR codes and barcodes with ease. Your all-in-one scanning solution.
        </p>

        {/* Start Button */}
        <Button 
          onClick={() => navigate('/scanner')}
          size="lg"
          className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground font-semibold text-lg px-8 py-4 rounded-full shadow-glow-yellow hover:shadow-glow-yellow transition-all duration-300 animate-scale-in hover:scale-105"
          style={{ animationDelay: '0.4s' }}
        >
          Let's Start
        </Button>

        {/* Feature highlights */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <QrCode className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Scanner</p>
          </div>
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <QrCode className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Generator</p>
          </div>
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <QrCode className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">History</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;