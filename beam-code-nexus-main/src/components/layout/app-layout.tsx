import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { QrCode, History, ScanLine } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { label: "Scanner", icon: ScanLine, to: "/scanner" },
  { label: "Generator", icon: QrCode, to: "/generator" },
  { label: "History", icon: History, to: "/history" },
];

export const AppLayout = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {!isMobile && <AppSidebar />}
        
        <div className="flex-1 flex flex-col">
          {!isMobile && (
            <header className="h-14 flex items-center border-b border-border px-4">
              <SidebarTrigger className="text-foreground" />
            </header>
          )}
          
          <main className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>
            <Outlet />
          </main>
        </div>
        
        {isMobile && <BottomNav items={navItems} />}
      </div>
    </SidebarProvider>
  );
};