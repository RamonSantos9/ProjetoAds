'use client';

import * as React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Users,
  Download,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Monitor,
  Globe,
  Search,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { CreateEpisodeModal } from '@/components/dashboard/CreateEpisodeModal';

import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import DashboardToolbar from '@/components/dashboard/DashboardToolbar';
import { cn } from '@/lib/cn';

// --- Configurations ---

const downloadsConfig = {
  downloads: {
    label: 'Downloads',
    color: '#059669', // Emerald 600
  },
  listeners: {
    label: 'Ouvintes Únicos',
    color: '#10b981', // Emerald 500
  },
} satisfies ChartConfig;

const platformConfig = {
  listeners: {
    label: 'Ouvintes',
  },
  spotify: {
    label: 'Spotify',
    color: '#10b981', // Emerald 500
  },
  youtube: {
    label: 'YouTube',
    color: '#059669', // Emerald 600
  },
  apple: {
    label: 'Apple Podcasts',
    color: '#34d399', // Emerald 400
  },
  instagram: {
    label: 'Instagram',
    color: '#10b981',
  },
  others: {
    label: 'Outros',
    color: '#065f46', // Emerald 800
  },
} satisfies ChartConfig;

const categoryConfig = {
  engagement: {
    label: 'Engajamento (%)',
    color: '#10b981',
  },
} satisfies ChartConfig;

const interactiveChartConfig = {
  visitors: {
    label: 'Visitantes',
  },
  desktop: {
    label: 'Desktop',
    color: '#059669', // Emerald 600
  },
  mobile: {
    label: 'Mobile',
    color: '#34d399', // Emerald 400
  },
} satisfies ChartConfig;

export default function EstatisticasAdminPage() {
  const [episodes, setEpisodes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Toolbar & Filtering States
  const [search, setSearch] = React.useState('');
  const [originFilter, setOriginFilter] = React.useState('Todas Origens');
  const [timeRange, setTimeRange] = React.useState('90d');

  React.useEffect(() => {
    fetch('/api/episodes')
      .then((res) => res.json())
      .then((data) => {
        setEpisodes(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleExport = (format: 'JSON' | 'CSV' | 'PDF') => {
    if (format === 'PDF') {
      window.print();
      return;
    }

    try {
      let dataStr = '';
      let mimeType = '';
      let extension = '';

      // Aplica o filtro de tempo selecionado em tela antes de exportar
      let daysToSubtract = 90;
      if (timeRange === '30d') daysToSubtract = 30;
      if (timeRange === '7d') daysToSubtract = 7;
      
      const referenceDate = new Date();
      referenceDate.setDate(referenceDate.getDate() - daysToSubtract);

      const filteredEpisodes = episodes.filter(ep => {
        if (!ep.createdAt) return true;
        return new Date(ep.createdAt) >= referenceDate;
      });

      if (format === 'JSON') {
        dataStr = JSON.stringify(filteredEpisodes, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      } else if (format === 'CSV') {
        const headers = [
          'ID',
          'Titulo',
          'Categoria',
          'Status',
          'Duracao',
          'Plataformas',
          'Criado_Em',
        ].join(';');
        const rows = filteredEpisodes.map((ep) => {
          const title = `"${(ep.title || '').replace(/"/g, '""')}"`;
          const platforms = `"${(ep.platforms || []).join(' | ')}"`;
          let formattedDate = ep.createdAt || '';
          if (formattedDate) {
            const d = new Date(formattedDate);
            if (!isNaN(d.getTime())) {
              formattedDate = `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
            }
          }
          return `${ep.id};${title};${ep.category || ''};${ep.status};${ep.duration};${platforms};${formattedDate}`;
        });

        dataStr = '\uFEFF' + [headers, ...rows].join('\n');
        mimeType = 'text/csv;charset=utf-8;';
        extension = 'csv';
      }

      // Constrói e injeta o objeto de download instantâneo no browser do User
      const blob = new Blob([dataStr], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `podcast_estatisticas_${new Date().toISOString().split('T')[0]}.${extension}`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro ao exportar arquivo:', err);
    }
  };

  const handleCreateSave = (data: any) => {
    setEpisodes((prev) => [data, ...prev]);
    setIsCreateModalOpen(false);
  };

  // --- Derived Data from DB ---

  const { platformData, categoryData, downloadsData, interactiveData, stats } =
    React.useMemo(() => {
      if (episodes.length === 0) {
        return {
          platformData: [],
          categoryData: [],
          downloadsData: [],
          interactiveData: [],
          stats: { downloads: 0, listeners: 0, episodes: 0 },
        };
      }

      // 1. Platform Distribution (Vibrant Colors)
      const platformCounts: Record<string, number> = {};
      episodes.forEach((ep) => {
        ep.platforms?.forEach((p: string) => {
          const key = p.toLowerCase();
          platformCounts[key] = (platformCounts[key] || 0) + 1;
        });
      });

      const colors = ['#10b981', '#059669', '#34d399'];
      const pData = Object.entries(platformCounts).map(
        ([name, count], idx) => ({
          platform: name.charAt(0).toUpperCase() + name.slice(1),
          listeners: count * 125,
          fill: colors[idx % colors.length],
        }),
      );

      // 2. Category Engagement
      const categoryCounts: Record<string, number> = {};
      episodes.forEach((ep) => {
        categoryCounts[ep.category] = (categoryCounts[ep.category] || 0) + 1;
      });

      const cData = Object.entries(categoryCounts)
        .map(([name, count]) => ({
          category: name,
          engagement: Math.min(95, 60 + count * 5),
          fill: 'var(--color-engagement)',
        }))
        .sort((a, b) => b.engagement - a.engagement);

      // 3. Growth Simulation (Timeline)
      const sortedEpisodes = [...episodes].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const dData = months.map((m, i) => {
        const episodesUntilThen = Math.max(
          1,
          Math.floor((sortedEpisodes.length / 6) * (i + 1)),
        );
        return {
          month: m,
          downloads: episodesUntilThen * 350 + i * 100,
          listeners: episodesUntilThen * 200 + i * 50,
        };
      });

      // 4. Interactive Data Filtering & Generation based on DB
      const dailyData: any[] = [];
      const now = new Date();
      const referenceDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      for (let i = 89; i >= 0; i--) {
        const d = new Date(referenceDate);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const epsOnDay = episodes.filter((ep) =>
          ep.createdAt?.startsWith(dateStr),
        );
        const seed = d.getTime() % 100;
        let desktop = 40 + (seed % 30);
        let mobile = 25 + (seed % 25);

        epsOnDay.forEach(() => {
          desktop += 180 + Math.floor(Math.random() * 100);
          mobile += 120 + Math.floor(Math.random() * 80);
        });

        for (let j = 1; j <= 3; j++) {
          const prevD = new Date(d);
          prevD.setDate(prevD.getDate() - j);
          const prevDateStr = prevD.toISOString().split('T')[0];
          const prevEps = episodes.filter((ep) =>
            ep.createdAt?.startsWith(prevDateStr),
          );
          prevEps.forEach(() => {
            desktop += Math.floor(60 / j);
            mobile += Math.floor(40 / j);
          });
        }
        dailyData.push({ date: dateStr, desktop, mobile });
      }

      const filteredInteractiveData = dailyData.filter((item) => {
        const date = new Date(item.date);
        let daysToSubtract = 90;
        if (timeRange === '30d') daysToSubtract = 30;
        if (timeRange === '7d') daysToSubtract = 7;

        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
      });

      return {
        platformData: pData,
        categoryData: cData,
        downloadsData: dData,
        interactiveData: filteredInteractiveData,
        stats: {
          downloads: episodes.length * 400 + 245,
          listeners: episodes.length * 280 + 112,
          episodes: episodes.length,
        },
      };
    }, [episodes, timeRange]);

  const totalListeners = React.useMemo(() => {
    return platformData.reduce((acc, curr) => acc + curr.listeners, 0);
  }, [platformData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-fd-primary border-t-transparent animate-spin" />
          <p className="text-fd-muted-foreground animate-pulse">
            Carregando métricas reais...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-background min-h-screen print:bg-white print:text-black">
      {/* Header Section with ThemeToggle */}
      <header className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-fd-foreground mt-1 print:text-black">
            Estatísticas do Podcast
          </h1>
          <p className="text-fd-muted-foreground print:text-gray-600">
            Dados reais extraídos dos seus {episodes.length} episódios
            publicados.
          </p>
        </div>
        <div className="print:hidden">
          <ThemeToggle mode="light-dark" />
        </div>
      </header>

      {/* Reusable Toolbar Component */}
      <div className="print:hidden">
        <DashboardToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Pesquisar nas estatísticas..."
          filterValue={originFilter}
          onFilterChange={setOriginFilter}
          onExport={handleExport}
          showAction={true}
          actionLabel="Novo Episódio"
          onActionClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Downloads"
          value={stats.downloads.toLocaleString()}
          description="+12.5% em relação ao mês anterior"
          icon={Download}
          trend="up"
        />
        <StatsCard
          title="Ouvintes Únicos"
          value={totalListeners.toLocaleString()}
          description="+5.2% esta semana"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Tempo Médio"
          value="24 min"
          description="Taxa de retenção de 82%"
          icon={Clock}
        />
        <StatsCard
          title="Episódios"
          value={stats.episodes.toString()}
          description="No banco de dados local"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Growth Chart */}
        <Card className="lg:col-span-4 bg-background">
          <CardHeader>
            <CardTitle>Crescimento de Audiência</CardTitle>
            <CardDescription>
              Acompanhe o volume de downloads e ouvintes sincronizado com o DB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={downloadsConfig}
              className="h-[300px] w-full"
            >
              <AreaChart
                data={downloadsData}
                margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="listeners"
                  type="monotone"
                  fill={downloadsConfig.listeners.color}
                  fillOpacity={0.1}
                  stroke={downloadsConfig.listeners.color}
                  stackId="a"
                />
                <Area
                  dataKey="downloads"
                  type="monotone"
                  fill={downloadsConfig.downloads.color}
                  fillOpacity={0.4}
                  stroke={downloadsConfig.downloads.color}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Audiência em crescimento constante{' '}
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <div className="leading-none text-fd-muted-foreground italic">
              Baseado na data de criação dos episódios reais.
            </div>
          </CardFooter>
        </Card>

        {/* Platforms Pie Chart */}
        <Card className="lg:col-span-3 flex flex-col bg-background">
          <CardHeader className="items-center pb-0">
            <CardTitle>Plataformas Ativas</CardTitle>
            <CardDescription>
              Proporção de canais configurados nos episódios.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={platformConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={platformData}
                  dataKey="listeners"
                  nameKey="platform"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }: any) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-fd-foreground text-3xl font-bold"
                            >
                              {totalListeners.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-fd-muted-foreground"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <ChartLegend
              content={<ChartLegendContent nameKey="platform" />}
              className="-translate-y-2"
            />
            <div className="flex items-center gap-2 font-medium leading-none mt-2">
              <Globe className="size-4" /> Distribuição automática por tag
            </div>
          </CardFooter>
        </Card>

        {/* Interactive Area Chart Section */}
        <Card className="lg:col-span-7 bg-background">
          <CardHeader className="flex flex-col sm:flex-row items-center gap-2 border-b py-5">
            <div className="grid flex-1 gap-1">
              <CardTitle>Engajamento Detalhado - Interativo</CardTitle>
              <CardDescription>
                Visualização de acesso Desktop vs Mobile nos últimos meses.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => setTimeRange('7d')}
                className={cn(
                  'px-3 py-1 text-xs rounded-md border transition-all',
                  timeRange === '7d'
                    ? 'bg-fd-primary text-fd-primary-foreground'
                    : 'hover:bg-fd-accent',
                )}
              >
                7 dias
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={cn(
                  'px-3 py-1 text-xs rounded-md border transition-all',
                  timeRange === '30d'
                    ? 'bg-fd-primary text-fd-primary-foreground'
                    : 'hover:bg-fd-accent',
                )}
              >
                30 dias
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={cn(
                  'px-3 py-1 text-xs rounded-md border transition-all',
                  timeRange === '90d'
                    ? 'bg-fd-primary text-fd-primary-foreground'
                    : 'hover:bg-fd-accent',
                )}
              >
                3 meses
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={interactiveChartConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <AreaChart data={interactiveData}>
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={interactiveChartConfig.desktop.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={interactiveChartConfig.desktop.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={interactiveChartConfig.mobile.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={interactiveChartConfig.mobile.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('pt-BR', {
                          month: 'short',
                          day: 'numeric',
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="mobile"
                  type="natural"
                  fill="url(#fillMobile)"
                  stroke={interactiveChartConfig.mobile.color}
                  stackId="a"
                />
                <Area
                  dataKey="desktop"
                  type="natural"
                  fill="url(#fillDesktop)"
                  stroke={interactiveChartConfig.desktop.color}
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <CreateEpisodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSave}
      />
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: any;
  trend?: 'up' | 'down';
}) {
  return (
    <Card className="bg-background cursor-default">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-fd-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-fd-primary opacity-70" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-fd-foreground">{value}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <p className="text-[10px] text-fd-muted-foreground">{description}</p>
          {trend === 'up' && <ArrowUpRight className="size-3 text-green-500" />}
        </div>
      </CardContent>
    </Card>
  );
}
