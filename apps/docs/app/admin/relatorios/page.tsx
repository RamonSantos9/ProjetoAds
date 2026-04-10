'use client';

import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { Info } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AnalyticsData {
  totalUsers: number;
  completedOnboarding: number;
  onboardingRate: number;
  withIndividualWorkspace: number;
  workspaceRate: number;
  topSource: string;
  topRole: string;
  sourceData: { name: string; value: number }[];
  roleData: { name: string; value: number }[];
  workspaceData: { name: string; value: number }[];
  weeksData: { week: string; users: number; label: string }[];
}

// ─── Paletes ──────────────────────────────────────────────────────────────────

const PALETTE = [
  '#0f172a', '#334155', '#64748b', '#94a3b8',
  '#cbd5e1', '#475569', '#1e293b', '#e2e8f0',
];

const PIE_PALETTE = [
  '#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#475569',
];

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  tooltip,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tooltip?: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-5 border rounded-xl bg-background">
      <div className="flex items-center justify-between text-foreground/60 text-sm">
        <span>{label}</span>
        {tooltip && (
          <div className="group relative">
            <Info className="size-4 cursor-help" />
            <div className="pointer-events-none absolute right-0 top-6 z-10 w-56 rounded-lg border bg-background p-2 text-xs text-foreground/70 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
      {sub && <p className="text-xs text-foreground/50">{sub}</p>}
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 border rounded-xl bg-background">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-foreground/50 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Tooltip customizado ──────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="text-foreground/80">
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.07) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-foreground/10 ${className}`} />;
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function RelatoriosPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => {
        if (!r.ok) throw new Error('Falha ao carregar analytics');
        return r.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] dark:bg-fd-background px-4 md:px-8 py-8 text-fd-foreground">
      <main className="relative flex-[1_1_0] mx-auto w-full max-w-6xl pb-8 flex flex-col gap-8">

        {/* Cabeçalho */}
        <div className="flex justify-between items-end w-full">
          <div className="flex flex-col">
            <p className="truncate text-sm text-foreground/50">Painel Administrativo</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">Analytics & Relatórios</h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        {/* ── Cards de Métricas ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 border rounded-xl flex flex-col gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-4 text-center py-10 text-sm text-foreground/50">{error}</div>
          ) : (
            <>
              <StatCard
                label="Total de Usuários"
                value={data!.totalUsers}
                sub="Registrados na plataforma"
                tooltip="Número total de contas criadas na plataforma PodcastAds."
              />
              <StatCard
                label="Onboarding Concluído"
                value={`${data!.onboardingRate}%`}
                sub={`${data!.completedOnboarding} de ${data!.totalUsers} usuários`}
                tooltip="Porcentagem de usuários que completaram o fluxo de onboarding."
              />
              <StatCard
                label="Workspace Individual"
                value={`${data!.workspaceRate}%`}
                sub={`${data!.withIndividualWorkspace} usuários criaram um`}
                tooltip="Porcentagem de usuários que optaram por criar seu workspace individual."
              />
              <StatCard
                label="Principal Canal"
                value={data!.topSource || '—'}
                sub={`Vínculo mais comum: ${data!.topRole || '—'}`}
                tooltip="Canal de aquisição mais escolhido pelos usuários durante o onboarding."
              />
            </>
          )}
        </div>

        {/* ── Gráficos — Linha 1 ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Novos Usuários por Semana */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Novos Usuários"
              description="Cadastros nas últimas 8 semanas"
            >
              {loading ? (
                <Skeleton className="h-52 w-full mt-2" />
              ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart data={data?.weeksData ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="users"
                      name="Usuários"
                      stroke="#0f172a"
                      strokeWidth={2}
                      fill="url(#usersGrad)"
                      dot={{ r: 3, fill: '#0f172a' }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* Workspace: Global vs Individual */}
          <ChartCard
            title="Tipo de Workspace"
            description="Distribuição de preferência"
          >
            {loading ? (
              <Skeleton className="h-52 w-full mt-2" />
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={data?.workspaceData ?? []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={CustomPieLabel}
                  >
                    {(data?.workspaceData ?? []).map((_, index) => (
                      <Cell key={index} fill={PIE_PALETTE[index % PIE_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', opacity: 0.7 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Gráficos — Linha 2 ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Canal de Aquisição */}
          <ChartCard
            title="Canal de Aquisição"
            description="Como os usuários conheceram o PodcastAds"
          >
            {loading ? (
              <Skeleton className="h-64 w-full mt-2" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={data?.sourceData ?? []}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Usuários" radius={[0, 4, 4, 0]}>
                    {(data?.sourceData ?? []).map((_, index) => (
                      <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Vínculo Acadêmico */}
          <ChartCard
            title="Vínculo Acadêmico"
            description="Papel dos usuários na instituição"
          >
            {loading ? (
              <Skeleton className="h-64 w-full mt-2" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={data?.roleData ?? []}
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    dataKey="value"
                    labelLine={false}
                    label={CustomPieLabel}
                  >
                    {(data?.roleData ?? []).map((_, index) => (
                      <Cell key={index} fill={PIE_PALETTE[index % PIE_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', opacity: 0.7 }}
                    formatter={(value) =>
                      value.length > 20 ? value.substring(0, 20) + '…' : value
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

        </div>

        {/* ── Estado vazio ─────────────────────────────────────────────────── */}
        {!loading && !error && data?.totalUsers === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl">
            <p className="text-lg font-medium text-foreground">Nenhum dado ainda</p>
            <p className="text-sm text-foreground/50 mt-1 max-w-sm">
              Quando os usuários completarem o onboarding, os dados de analytics aparecerão aqui.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
