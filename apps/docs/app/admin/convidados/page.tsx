'use client';

import * as React from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
  IconSearch,
  IconDownload,
  IconTrash,
  IconUsers,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconWorld,
  IconEdit,
} from '@tabler/icons-react';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';
import { z } from 'zod';

import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Episode, Guest } from '@/lib/db';
import { CreateGuestModal } from '@/components/dashboard/CreateGuestModal';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';

/**
 * Interface estendida para exibição na tabela
 */
export const guestSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  social: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  episodeCount: z.number().default(0),
  episodes: z.array(z.string()).default([]),
});

type ExtendedGuest = z.infer<typeof guestSchema>;

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <IconGripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function DraggableRow({ row }: { row: Row<ExtendedGuest> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

const chartData = [
  { month: 'January', desktop: 18, mobile: 8 },
  { month: 'February', desktop: 30, mobile: 20 },
  { month: 'March', desktop: 23, mobile: 12 },
  { month: 'April', desktop: 7, mobile: 19 },
  { month: 'May', desktop: 20, mobile: 13 },
  { month: 'June', desktop: 21, mobile: 14 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--primary)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

function TableCellViewer({ 
  item, 
  onDelete,
  onEdit
}: { 
  item: ExtendedGuest, 
  onDelete: (id: string) => void,
  onEdit: (guest: ExtendedGuest) => void
}) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <div className="flex flex-col items-start cursor-pointer">
          <Button variant="link" className="w-fit h-auto p-0 text-left text-foreground hover:underline transition-all duration-300">
            {item.name}
          </Button>
          <span className="text-muted-foreground text-[10px] line-clamp-1">{item.bio}</span>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.name}</DrawerTitle>
          <DrawerDescription>
            Detalhes do convidado e histórico de participações.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex items-center gap-4 py-2">
            <div className="w-16 h-16 rounded-full bg-fd-primary/10 flex items-center justify-center overflow-hidden border border-fd-border">
              {item.avatar ? (
                <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <IconUsers className="size-8 text-fd-primary" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">{item.name}</span>
              <span className="text-muted-foreground">{item.company || 'Empresa não informada'}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid gap-2">
            <div className="font-medium text-xs uppercase text-muted-foreground">Biografia</div>
            <div className="text-sm leading-relaxed">
              {item.bio || 'Nenhuma biografia disponível.'}
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <div className="font-medium text-xs uppercase text-muted-foreground">Estatísticas de Episódios</div>
            <div className="flex gap-2 items-center leading-none font-medium">
              Participou de {item.episodeCount} episódios <IconTrendingUp className="size-4" />
            </div>
          </div>

          {!isMobile && (
            <ChartContainer config={chartConfig} className="h-[200px]">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{ left: 0, right: 10 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                  hide
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="mobile"
                  type="natural"
                  fill="var(--color-mobile)"
                  fillOpacity={0.6}
                  stroke="var(--color-mobile)"
                  stackId="a"
                />
                <Area
                  dataKey="desktop"
                  type="natural"
                  fill="var(--color-desktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Telefone</Label>
              <span className="text-sm font-medium">{item.phone || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">LinkedIn</Label>
              <span className="text-sm font-medium truncate">{item.linkedin || '-'}</span>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex-row gap-2 border-t mt-4">
          <Button className="flex-1" onClick={() => onEdit(item)}>
            <IconEdit className="size-4 mr-2" /> Editar
          </Button>
          <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onDelete(item.id)}>
            <IconTrash className="size-4 mr-2" /> Excluir
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function ConvidadosAdminPage() {
  const [episodes, setEpisodes] = React.useState<Episode[]>([]);
  const [guests, setGuests] = React.useState<Guest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<ExtendedGuest[]>([]);
  
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingGuest, setEditingGuest] = React.useState<Guest | null>(null);

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [epRes, guestRes] = await Promise.all([
        fetch('/api/episodes'),
        fetch('/api/guests'),
      ]);

      if (epRes.ok && guestRes.ok) {
        const epData = await epRes.json();
        const guestData = await guestRes.json();
        setEpisodes(epData);
        setGuests(guestData);
        
        // Correlacionar convidados com episódios
        const extended: ExtendedGuest[] = guestData.map((g: Guest) => {
          const relatedEpisodes = epData.filter((ep: Episode) =>
            ep.guests?.some((eg) => eg.id === g.id || eg.name === g.name),
          );

          return {
            ...g,
            episodeCount: relatedEpisodes.length,
            episodes: relatedEpisodes.map((ep: Episode) => ep.title),
          };
        });
        
        setData(extended);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este convidado?')) return;

    try {
      const res = await fetch(`/api/guests?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Convidado excluído com sucesso");
        loadData();
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast.error("Erro ao excluir convidado");
    }
  };

  const handleEdit = (guest: ExtendedGuest) => {
    setEditingGuest(guest);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    loadData();
    setIsModalOpen(false);
    setEditingGuest(null);
  };

  const columns: ColumnDef<ExtendedGuest>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Convidado",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-fd-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-fd-border">
              {item.avatar ? (
                <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <IconUsers className="size-4 text-fd-primary" />
              )}
            </div>
            <TableCellViewer item={item} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "company",
      header: "Empresa",
      cell: ({ row }) => (
        <div className="w-32 truncate text-muted-foreground text-xs font-medium">
          {row.original.company || "-"}
        </div>
      ),
    },
    {
      accessorKey: "episodeCount",
      header: "Episódios",
      cell: ({ row }) => (
        <Badge variant="success">
          {row.original.episodeCount}
        </Badge>
      ),
    },
    {
      id: "social",
      header: "Social",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            {item.social && (
              <a href={item.social} target="_blank" className="p-1 rounded-md hover:bg-fd-accent text-muted-foreground transition-colors">
                {item.social.includes('github') ? <IconBrandGithub size={16}/> : 
                 item.social.includes('instagram') ? <IconBrandInstagram size={16}/> :
                 <IconWorld size={16}/>}
              </a>
            )}
            {item.linkedin && (
              <a href={item.linkedin} target="_blank" className="p-1 rounded-md hover:bg-fd-accent text-muted-foreground transition-colors">
                <IconBrandLinkedin size={16}/>
              </a>
            )}
          </div>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex text-muted-foreground data-[state=open]:bg-muted size-4"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <IconEdit className="size-4 mr-2" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem>Fazer cópia</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row.original.id)}>
              <IconTrash className="size-4 mr-2" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = prev.findIndex(item => item.id === active.id);
        const newIndex = prev.findIndex(item => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
      toast.info("Ordem alterada localmente");
    }
  }

  const handleExport = (format: 'json' | 'csv') => {
    toast.message(`Exportando em ${format.toUpperCase()}...`);
  };

  return (
    <div className="rebrand-body flex min-h-screen flex-col bg-[#FFFFFF] dark:bg-fd-background px-8 py-8 text-fd-foreground">
      <main className="max-w-6xl mx-auto w-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              Administração / CRM
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-fd-foreground mt-1">
              Gestão de Convidados
            </h1>
          </div>
         <ThemeToggle />
        </div>

        <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
          <div className="flex items-center justify-between px-4 lg:px-0">
            <TabsList className="bg-transparent gap-2 p-0 h-auto">
              <TabsTrigger value="outline" className="rounded-full px-6 data-[state=active]:bg-fd-primary data-[state=active]:text-fd-primary-foreground border">
                Geral
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-full px-6 data-[state=active]:bg-fd-primary data-[state=active]:text-fd-primary-foreground border">
                Histórico <Badge variant="secondary" className="ml-2 bg-white/20 border-none text-current">3</Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Pesquisar..." 
                  className="pl-9 h-9 w-64 bg-fd-accent/30 border-none"
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <IconLayoutColumns className="mr-2 size-4"/> Colunas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(v) => column.toggleVisibility(!!v)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="outline" size="sm" className="h-9">
                    <IconDownload className="mr-2 size-4"/> Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('json')}>JSON</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" className="h-9" onClick={() => { setEditingGuest(null); setIsModalOpen(true); }}>
                <IconPlus className="mr-2 size-4" /> Novo Convidado
              </Button>
            </div>
          </div>

          <TabsContent value="outline" className="mt-6 flex flex-col gap-4">
            <div className="overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm">
              <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
                sensors={sensors}
                id={sortableId}
              >
                <Table>
                  <TableHeader className="bg-fd-muted/50 border-b">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="hover:bg-transparent">
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="h-10 text-[11px] font-bold">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody className="[&_td]:py-3">
                    {loading ? (
                       Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={columns.length} className="h-16 animate-pulse bg-fd-muted/20" />
                        </TableRow>
                      ))
                    ) : table.getRowModel().rows?.length ? (
                      <SortableContext
                        items={dataIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {table.getRowModel().rows.map((row) => (
                          <DraggableRow key={row.id} row={row} />
                        ))}
                      </SortableContext>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-32 text-center text-muted-foreground"
                        >
                          Nenhum convidado encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </DndContext>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
              <div className="text-xs text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} de {" "}
                {table.getFilteredRowModel().rows.length} linhas selecionadas
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Linhas por página</span>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(v) => table.setPageSize(Number(v))}
                  >
                    <SelectTrigger className="h-8 w-16 text-xs">
                      <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((size) => (
                        <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs font-medium">
                  Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    <IconChevronLeft size={16}/>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    <IconChevronRight size={16}/>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-xl bg-fd-muted/10">
              <IconLoader className="animate-spin mb-2 size-6 text-muted-foreground"/>
              <p className="text-sm text-muted-foreground">Carregando histórico de interações...</p>
            </div>
          </TabsContent>
        </Tabs>

        <CreateGuestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGuest(null);
          }}
          onSave={handleSave}
          initialData={editingGuest}
        />
      </main>
    </div>
  );
}
