import { Separator } from '@/components/ui/separator';
import type { FooterProps } from '@/types/ui';
import { Github } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC<FooterProps> = ({ version = '1.0.0' }) => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-4 py-6 md:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="homeIconTitle"
              >
                <title id="homeIconTitle">{t('footer.homeIcon')}</title>
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
              </svg>
              <p className="text-sm font-semibold leading-none">DipRush</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('footer.copyright')}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              {t('footer.version')}: {version}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/diprush/diprush"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Github className="h-3 w-3" />
                {t('footer.github')}
              </a>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-4 md:gap-6 text-xs text-muted-foreground">
          <a href="/docs" className="hover:text-foreground">
            {t('footer.documentation')}
          </a>
          <a href="/about" className="hover:text-foreground">
            {t('footer.about')}
          </a>
          <a href="/privacy" className="hover:text-foreground">
            {t('footer.privacyPolicy')}
          </a>
          <a href="/terms" className="hover:text-foreground">
            {t('footer.termsOfService')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
