import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import type { HeaderProps } from '@/types/ui';
import { Globe, Menu, Moon, Sun } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

const Header: React.FC<HeaderProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  // Theme icon based on current theme
  const ThemeIcon = () => {
    if (theme === 'dark') {
      return <Moon className="h-5 w-5" />;
    }
    if (theme === 'light') {
      return <Sun className="h-5 w-5" />;
    }
    return <Sun className="h-5 w-5" />;
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="logoIconTitle"
            >
              <title id="logoIconTitle">{t('navigation.logoIcon')}</title>
              <path
                d="M3 9L12 3L21 9V20.5C21 20.8978 20.842 21.2794 20.5607 21.5607C20.2794 21.842 19.8978 22 19.5 22H4.5C4.10218 22 3.72064 21.842 3.43934 21.5607C3.15804 21.2794 3 20.8978 3 20.5V9Z"
                className="stroke-primary"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12H15V22"
                className="stroke-primary"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 8L19 12M10 8L5 12"
                className="stroke-foreground"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-bold text-lg">DipRush</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={t('navigation.theme')}
            className="rounded-full"
          >
            <ThemeIcon />
            <span className="sr-only">{t('navigation.theme')}</span>
          </Button>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title={
              language.startsWith('en')
                ? t('navigation.chinese')
                : t('navigation.english')
            }
            className="rounded-full"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">{t('navigation.language')}</span>
          </Button>

          {/* User Menu - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden md:flex">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('navigation.settings')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/about" className="flex w-full">
                  {t('navigation.about')}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('navigation.menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>DipRush</SheetTitle>
                <SheetDescription>{t('app.description')}</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="border-t pt-4 mt-2">
                  <a
                    href="/about"
                    className="flex items-center gap-2 px-2 py-1 text-lg hover:underline"
                  >
                    {t('navigation.about')}
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
