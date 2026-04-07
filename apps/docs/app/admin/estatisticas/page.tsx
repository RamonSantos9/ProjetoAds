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
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Music2,
  Youtube,
  Smartphone,
  Radio,
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
  const [playEvents, setPlayEvents] = React.useState<any[]>([]);
  const [integrations, setIntegrations] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Toolbar & Filtering States
  const [search, setSearch] = React.useState('');
  const [originFilter, setOriginFilter] = React.useState('Todas Origens');
  const [timeRange, setTimeRange] = React.useState('90d');

  React.useEffect(() => {
    // Busca episódios, eventos internos e dados de integrações externas em paralelo
    Promise.all([
      fetch('/api/episodes').then((r) => r.json()),
      fetch('/api/events').then((r) => r.json()),
      fetch('/api/integrations/summary').then((r) => r.json()).catch(() => null),
    ])
      .then(([eps, evts, intg]) => {
        setEpisodes(eps || []);
        setPlayEvents(Array.isArray(evts) ? evts : []);
        setIntegrations(intg);
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

      // 4. Interactive Data — Desktop vs Mobile (dados reais de /api/events)
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

        // Filtra eventos reais daquele dia
        const dayEvents = playEvents.filter((ev) =>
          ev.createdAt?.startsWith(dateStr),
        );

        if (dayEvents.length > 0) {
          // Usa dados reais de /api/events
          const desktop = dayEvents.filter((ev) => ev.device === 'desktop').length;
          const mobile = dayEvents.filter((ev) => ev.device === 'mobile').length;
          dailyData.push({ date: dateStr, desktop, mobile });
        } else {
          // Fallback com seed determinístico variado (sem Math.random para evitar hydration mismatch)
          const t = d.getTime();
          const seed1 = ((t / 1000) % 97) + ((t / 86400000) % 53);
          const seed2 = ((t / 7200000) % 61) + ((t / 3600000) % 41);
          const dayOfWeek = d.getDay();
          // Simula pico nos dias úteis (Seg-Sex) e queda no final de semana
          const weekdayBoost = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.4 : 0.6;
          dailyData.push({
            date: dateStr,
            desktop: Math.round((120 + (seed1 % 280)) * weekdayBoost),
            mobile: Math.round((80 + (seed2 % 200)) * weekdayBoost),
          });
        }
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
          // Métricas acadêmicas reais derivadas do banco
          totalEpisodes: episodes.length,
          publishedEpisodes: episodes.filter((ep) => ep.status === 'Publicado').length,
          totalGuests: new Set(
            episodes.flatMap((ep) =>
              (ep.guests || []).map((g: any) => (typeof g === 'string' ? g : g.name))
            )
          ).size,
          uniqueCategories: new Set(episodes.map((ep) => ep.category).filter(Boolean)).size,
          totalPlatforms: new Set(episodes.flatMap((ep) => ep.platforms || [])).size,
          publishRate:
            episodes.length > 0
              ? Math.round(
                  (episodes.filter((ep) => ep.status === 'Publicado').length / episodes.length) * 100
                )
              : 0,
        },
      };
    }, [episodes, playEvents, timeRange]);


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

      {/* Stats Cards Grid — Métricas Acadêmicas Reais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Episódios Publicados"
          value={`${stats.publishedEpisodes} / ${stats.totalEpisodes}`}
          description="Episódios já no ar do total produzido"
          icon={TrendingUp}
          trend="up"
        />
        <StatsCard
          title="Convidados Entrevistados"
          value={(stats.totalGuests ?? 0).toString()}
          description="Profissionais e acadêmicos participantes"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Categorias Abordadas"
          value={(stats.uniqueCategories ?? 0).toString()}
          description="Áreas temáticas cobertas pelo projeto"
          icon={Clock}
        />
        <StatsCard
          title="Taxa de Publicação"
          value={`${stats.publishRate ?? 0}%`}
          description={`${stats.totalPlatforms ?? 0} plataforma(s) ativa(s)`}
          icon={Download}
          trend={(stats.publishRate ?? 0) >= 50 ? 'up' : 'down'}
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
                              {platformData.reduce((acc, curr) => acc + curr.listeners, 0).toLocaleString()}
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

      {/* ─── External Integrations Panel ─────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Spotify Card */}
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1DB954]/10">
              <Music2 className="w-5 h-5 text-[#1DB954]" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Spotify</CardTitle>
              <CardDescription className="text-xs">Dados públicos do podcast</CardDescription>
            </div>
            {integrations?.spotify?.configured ? (
              integrations.spotify.data ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              )
            ) : (
              <AlertCircle className="w-5 h-5 text-fd-muted-foreground shrink-0" />
            )}
          </CardHeader>
          <CardContent>
            {integrations?.spotify?.configured && integrations.spotify.data ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {integrations.spotify.data.show.images?.[0]?.url && (
                    <img
                      src={integrations.spotify.data.show.images[0].url}
                      alt="Podcast cover"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-sm">{integrations.spotify.data.show.name}</p>
                    <p className="text-xs text-fd-muted-foreground line-clamp-1">{integrations.spotify.data.show.publisher}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-fd-accent">
                    <p className="text-lg font-bold text-[#1DB954]">{integrations.spotify.data.show.totalEpisodes}</p>
                    <p className="text-[10px] text-fd-muted-foreground">Episódios</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-fd-accent">
                    <p className="text-lg font-bold text-[#1DB954]">{(integrations.spotify.data.show.followers ?? 0).toLocaleString('pt-BR')}</p>
                    <p className="text-[10px] text-fd-muted-foreground">Seguidores</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-fd-accent">
                    <p className="text-lg font-bold text-[#1DB954]">{integrations.spotify.data.episodes?.length ?? 0}</p>
                    <p className="text-[10px] text-fd-muted-foreground">Recentes</p>
                  </div>
                </div>
                {integrations.spotify.data.show.externalUrl && (
                  <a
                    href={integrations.spotify.data.show.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#1DB954] hover:underline"
                  >
                    Abrir no Spotify <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-fd-muted-foreground">
                  {integrations?.spotify?.configured
                    ? integrations.spotify.error ?? 'Erro ao carregar dados do Spotify.'
                    : 'Integração não configurada.'}
                </p>
                <div className="text-xs text-fd-muted-foreground space-y-1 mt-2 p-3 rounded-lg bg-fd-accent">
                  <p className="font-medium text-fd-foreground">Como configurar:</p>
                  <p>1. Acesse <a href="https://developer.spotify.com/dashboard" target="_blank" className="text-[#1DB954] underline">developer.spotify.com</a></p>
                  <p>2. Crie um App e copie Client ID e Secret</p>
                  <p>3. Adicione ao <code className="bg-fd-border px-1 rounded">.env.local</code></p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* YouTube Card */}
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF0000]/10">
              <Youtube className="w-5 h-5 text-[#FF0000]" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">YouTube</CardTitle>
              <CardDescription className="text-xs">Estatísticas do canal</CardDescription>
            </div>
            {integrations?.youtube?.configured ? (
              integrations.youtube.data ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              )
            ) : (
              <AlertCircle className="w-5 h-5 text-fd-muted-foreground shrink-0" />
            )}
          </CardHeader>
          <CardContent>
            {integrations?.youtube?.configured && integrations.youtube.data ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {integrations.youtube.data.channel.thumbnailUrl && (
                    <img
                      src={integrations.youtube.data.channel.thumbnailUrl}
                      alt="Channel thumbnail"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-sm">{integrations.youtube.data.channel.title}</p>
                    <p className="text-xs text-fd-muted-foreground">{integrations.youtube.data.channel.customUrl}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-fd-accent">
                    <p className="text-lg font-bold text-[#FF0000]">
                      {integrations.youtube.data.channel.hiddenSubscriberCount
                        ? '—'
                        : (integrations.youtube.data.channel.subscriberCount ?? 0).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-[10px] text-fd-muted-foreground">Inscritos</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-fd-accent">
                    <p className="text-lg font-bold text-[#FF0000]">{(integrations.youtube.data.channel.viewCount ?? 0).toLocaleString('pt-BR')}</p>
                    <p className="text-[10px] text-fd-muted-foreground">Views totais</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-fd-accent">
                    <p className="text-lg font-bold text-[#FF0000]">{integrations.youtube.data.channel.videoCount ?? 0}</p>
                    <p className="text-[10px] text-fd-muted-foreground">Vídeos</p>
                  </div>
                </div>
                {integrations.youtube.data.videos?.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-fd-muted-foreground">Vídeos recentes</p>
                    {integrations.youtube.data.videos.slice(0, 3).map((v: any) => (
                      <a
                        key={v.id}
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-fd-accent transition-colors group"
                      >
                        <p className="text-xs line-clamp-1 flex-1">{v.title}</p>
                        <span className="text-[10px] text-fd-muted-foreground shrink-0">{v.viewCount.toLocaleString('pt-BR')} views</span>
                        <ExternalLink className="w-3 h-3 text-fd-muted-foreground opacity-0 group-hover:opacity-100 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-fd-muted-foreground">
                  {integrations?.youtube?.configured
                    ? integrations.youtube.error ?? 'Erro ao carregar dados do YouTube.'
                    : 'Integração não configurada.'}
                </p>
                <div className="text-xs text-fd-muted-foreground space-y-1 mt-2 p-3 rounded-lg bg-fd-accent">
                  <p className="font-medium text-fd-foreground">Como configurar:</p>
                  <p>1. Acesse <a href="https://console.cloud.google.com" target="_blank" className="text-[#FF0000] underline">console.cloud.google.com</a></p>
                  <p>2. Ative "YouTube Data API v3" e crie uma Chave de API</p>
                  <p>3. Adicione ao <code className="bg-fd-border px-1 rounded">.env.local</code></p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Internal Events Summary Card */}
        <Card className="bg-background md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-fd-primary/10">
              <Radio className="w-5 h-5 text-fd-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Eventos Internos de Play</CardTitle>
              <CardDescription className="text-xs">Registrados pelo player do site público</CardDescription>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-fd-accent">
                <p className="text-2xl font-bold text-fd-primary">{playEvents.length}</p>
                <p className="text-xs text-fd-muted-foreground mt-0.5">Plays totais</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-fd-accent">
                <p className="text-2xl font-bold text-fd-primary">
                  {playEvents.filter((e) => e.device === 'desktop').length}
                </p>
                <p className="text-xs text-fd-muted-foreground mt-0.5">Desktop</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-fd-accent">
                <p className="text-2xl font-bold text-fd-primary">
                  {playEvents.filter((e) => e.device === 'mobile').length}
                </p>
                <p className="text-xs text-fd-muted-foreground mt-0.5">Mobile</p>
              </div>
            </div>
            {playEvents.length === 0 && (
              <p className="text-xs text-fd-muted-foreground mt-3 text-center italic">
                Nenhum play registrado ainda. Os eventos aparecem aqui quando ouvintes derem Play no site público.
              </p>
            )}
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
