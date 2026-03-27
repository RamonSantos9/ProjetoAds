import {
  cancel,
  confirm,
  group,
  intro,
  log,
  outro,
  select,
} from '@clack/prompts';
import picocolors from 'picocolors';
import {
  createComponentInstaller,
  type Resolver,
} from '@/utils/add/install-component';
import type { LoadedConfig } from '@/config';
import { install } from '@/commands/add';

export async function customise(resolver: Resolver, config: LoadedConfig) {
  intro(picocolors.bgBlack(picocolors.whiteBright('Customise XispeDocs UI')));
  const installer = createComponentInstaller({
    resolver,
    config,
  });

  const result = await group(
    {
      target: () =>
        select({
          message: 'O que você deseja personalizar?',
          options: [
            {
              label: 'Docs Layout',
              value: 'docs',
              hint: 'interface principal da sua documentação',
            },
            {
              label: 'Home Layout',
              value: 'home',
              hint: 'a navbar para suas outras páginas',
            },
          ],
        }),
      mode: (v) => {
        if (v.results.target !== 'docs') return;

        return select({
          message: 'Qual variante você deseja começar?',
          options: [
            {
              label: 'Começar a partir de estilos mínimos',
              value: 'minimal',
              hint: 'para aqueles que querem construir sua própria variante do zero.',
            },
            {
              label: 'Começar a partir do layout padrão',
              value: 'full-default',
              hint: 'útil para ajustar pequenos detalhes.',
            },
            {
              label: 'Começar a partir do layout Notebook',
              value: 'full-notebook',
              hint: 'útil para ajustar pequenos detalhes.',
            },
          ],
        });
      },
      page: async (v) => {
        if (v.results.target !== 'docs' || v.results.mode === 'minimal')
          return false;

        return confirm({
          message: 'Você deseja personalizar o componente da página também?',
        });
      },
    },
    {
      onCancel: () => {
        cancel('Instalação interrompida.');
        process.exit(0);
      },
    },
  );

  if (result.target === 'docs') {
    const targets = [];
    let pageAdded = false;
    if (result.mode === 'minimal') {
      targets.push('layouts/docs-min');
      pageAdded = true;
    } else {
      if (result.page) {
        targets.push('layouts/page');
        pageAdded = true;
      }

      targets.push(
        result.mode === 'full-default' ? 'layouts/docs' : 'layouts/notebook',
      );
    }

    await install(targets, installer);
    const maps: [string, string][] = [
      ['@xispedocs/ui/layouts/docs', '@/components/layout/docs'],
    ];

    if (pageAdded) {
      maps.push(['@xispedocs/ui/page', '@/components/layout/page']);
    }

    printNext(...maps);
  }

  if (result.target === 'home') {
    await install(['layouts/home'], installer);
    printNext(['@xispedocs/ui/layouts/home', `@/components/layout/home`]);
  }

  outro(picocolors.bold('Divirta-se!'));
}

function printNext(...maps: [from: string, to: string][]) {
  intro(picocolors.bold('What is Next?'));

  log.info(
    [
      'Você pode verificar os componentes instalados em `components`.',
      picocolors.dim('---'),
      'Abra seus arquivos `layout.tsx`, substitua as importações dos componentes:',
      ...maps.map(([from, to]) =>
        picocolors.greenBright(`"${from}" -> "${to}"`),
      ),
    ].join('\n'),
  );
}
