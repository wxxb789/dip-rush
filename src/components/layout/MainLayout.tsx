import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LineChartIcon, SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

export function MainLayout() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="flex items-center">
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    location.pathname === '/screener' ||
                    location.pathname === '/'
                  }
                  tooltip={t('navigation.screener')}
                >
                  <Link to="/screener">
                    <SearchIcon />
                    <span>{t('navigation.screener')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname.startsWith('/stock-detail')}
                  tooltip={t('navigation.stockDetail')}
                >
                  <Link to="/stock-detail">
                    <LineChartIcon />
                    <span>{t('navigation.stockDetail')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
