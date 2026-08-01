import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { useAdminLogout } from "@/features/admin/auth/hooks/useAdminLogout"

const MainLayout: React.FC = () => {
  const logout = useAdminLogout()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const handleLogout = () => logout.mutate()

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isMobile={false} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        isMobile={true} 
        onClose={handleCloseMobileMenu}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <Header 
          onLogout={handleLogout} 
          onMenuToggle={handleMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Page Content */}
        <main className="flex-1 bg-background p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
