import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight, Copy, Trash2, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

interface HistoryItem {
  id: string;
  text: string;
  timestamp: string;
  type: 'scanned' | 'generated';
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadHistory();
    
    // If navigated from generator with preset text, add it to history
    if (location.state?.presetText) {
      const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
      const existingEntry = history.find((item: HistoryItem) => item.text === location.state.presetText);
      if (!existingEntry) {
        const newEntry = {
          id: Date.now().toString(),
          text: location.state.presetText,
          timestamp: new Date().toISOString(),
          type: 'generated'
        };
        history.unshift(newEntry);
        localStorage.setItem('qr-history', JSON.stringify(history.slice(0, 100)));
        setHistory(history);
      }
    }
  }, [location.state]);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('qr-history') || '[]');
    setHistory(savedHistory);
  };

  const clearHistory = () => {
    localStorage.removeItem('qr-history');
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "All history has been removed",
    });
  };

  const deleteItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('qr-history', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    toast({
      title: "Item Deleted",
      description: "Item removed from history",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const openDetails = (item: HistoryItem) => {
    // Navigate to generator with the text pre-filled for re-generation
    navigate('/generator', { state: { presetText: item.text } });
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <p className="text-muted-foreground">Your scanned and generated codes</p>
        </div>
        {history.length > 0 && (
          <Button 
            onClick={clearHistory} 
            variant="outline" 
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <Card className="p-8 bg-card border-border text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No History Yet</h3>
              <p className="text-muted-foreground mb-4">
                Your scanned and generated QR codes will appear here
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => navigate('/scanner')}
                  variant="default"
                  size="sm"
                  className="bg-gradient-primary hover:bg-gradient-primary/90"
                >
                  Start Scanning
                </Button>
                <Button 
                  onClick={() => navigate('/generator')}
                  variant="outline"
                  size="sm"
                >
                  Generate Code
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <Card 
              key={item.id} 
              className="p-4 bg-card border-border hover:bg-card/80 transition-colors cursor-pointer"
              onClick={() => openDetails(item)}
            >
              <div className="flex items-center space-x-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${
                  item.type === 'scanned' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-secondary/20 text-secondary-foreground'
                }`}>
                  <QrCode className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.type === 'scanned'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary/20 text-secondary-foreground'
                    }`}>
                      {item.type === 'scanned' ? 'Scanned' : 'Generated'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-foreground font-medium truncate">
                    {item.text.length > 50 ? `${item.text.substring(0, 50)}...` : item.text}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(item.text);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {history.length > 0 && (
        <Card className="p-4 bg-card border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {history.filter(item => item.type === 'scanned').length}
              </p>
              <p className="text-sm text-muted-foreground">Scanned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-foreground">
                {history.filter(item => item.type === 'generated').length}
              </p>
              <p className="text-sm text-muted-foreground">Generated</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default History;