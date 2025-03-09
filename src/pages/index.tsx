import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRightCircle,
  ChartLine,
  Languages,
  LineChart,
  Moon,
  Target,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const IndexPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      id: 'technical-analysis',
      title: t('features.technicalAnalysis'),
      description: t('features.technicalAnalysisDesc'),
      icon: <ChartLine className="h-6 w-6" />,
    },
    {
      id: 'realtime-analysis',
      title: t('features.realtime'),
      description: t('features.realtimeDesc'),
      icon: <LineChart className="h-6 w-6" />,
    },
    {
      id: 'smart-screening',
      title: t('features.screening'),
      description: t('features.screeningDesc'),
      icon: <Target className="h-6 w-6" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('welcome.title')}</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t('welcome.subtitle')}
        </p>
        <Button asChild size="lg">
          <Link to="/screener">
            {t('welcome.getStarted')}{' '}
            <ArrowRightCircle className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => (
          <Card key={feature.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 text-primary">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Languages className="h-6 w-6 mb-4 text-primary" />
            <CardTitle>{t('features.i18n')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{t('features.i18nDesc')}</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Moon className="h-6 w-6 mb-4 text-primary" />
            <CardTitle>{t('features.theme')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{t('features.themeDesc')}</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;
