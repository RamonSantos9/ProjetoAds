#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import picocolors from 'picocolors';
import {
  localResolver,
  remoteResolver,
  type Resolver,
} from '@/utils/add/install-component';
import { createOrLoadConfig, initConfig } from '@/config';
import {
  type JsonTreeNode,
  treeToJavaScript,
  treeToMdx,
} from '@/commands/file-tree';
import { runTree } from '@/utils/file-tree/run-tree';
import packageJson from '../package.json';
import { customise } from '@/commands/customise';
import { add } from '@/commands/add';

const program = new Command().option('--config <string>');

program
  .name('XispeDocs')
  .description('CLI para configurar XispeDocs, inicializar uma configuração')
  .version(packageJson.version)
  .action(async () => {
    if (await initConfig()) {
      console.log(
        picocolors.green(
          'Inicializado um arquivo de configuração `./cli.json`.',
        ),
      );
    } else {
      console.log(picocolors.redBright('O arquivo de configuração já existe.'));
    }
  });

program
  .command('customise')
  .alias('customize')
  .description('forma simples para personalizar layouts com XispeDocs UI')
  .option('--dir <string>', 'a url raiz ou diretório para resolver o registro')
  .action(async (options: { config?: string; dir?: string }) => {
    const resolver = getResolverFromDir(options.dir);
    await customise(resolver, await createOrLoadConfig(options.config));
  });

const dirShortcuts: Record<string, string> = {
  ':dev': 'https://preview.ramonsantosportfolio.vercel.app/registry',
  ':localhost': 'http://localhost:3000/registry',
};

program
  .command('add')
  .description('add um novo componente to your docs')
  .argument('[components...]', 'componentes para baixar')
  .option('--dir <string>', 'a url raiz ou diretório para resolver o registro')
  .action(
    async (input: string[], options: { config?: string; dir?: string }) => {
      const resolver = getResolverFromDir(options.dir);
      await add(input, resolver, await createOrLoadConfig(options.config));
    },
  );

program
  .command('tree')
  .argument(
    '[json_or_args]',
    'JSON de saída do comando `tree` ou argumentos para o comando `tree`',
  )
  .argument('[output]', 'caminho de saída do arquivo')
  .option('--js', 'output como arquivo JavaScript (apenas)')
  .option('--no-root', 'remove o nó raiz')
  .option(
    '--import-name <name>',
    'onde importar componentes (apenas para JavaScript)',
  )
  .action(
    async (
      str: string | undefined, // JSON de saída do comando `tree` ou argumentos para o comando `tree`
      output: string | undefined, // caminho de saída do arquivo
      {
        js,
        root,
        importName,
      }: { js: boolean; root: boolean; importName?: string },
    ) => {
      const jsExtensions = ['.js', '.tsx', '.jsx'];
      const noRoot = !root;
      let nodes: JsonTreeNode[];

      try {
        nodes = JSON.parse(str ?? '') as JsonTreeNode[];
      } catch {
        nodes = await runTree(str ?? './');
      }

      const out =
        js || (output && jsExtensions.includes(path.extname(output)))
          ? treeToJavaScript(nodes, noRoot, importName)
          : treeToMdx(nodes, noRoot);

      if (output) {
        await fs.mkdir(path.dirname(output), { recursive: true });
        await fs.writeFile(output, out);
      } else {
        console.log(out);
      }
    },
  );

function getResolverFromDir(
  dir: string = 'https://ramonsantosportfolio.vercel.app/registry',
): Resolver {
  if (dir in dirShortcuts) dir = dirShortcuts[dir];

  return dir.startsWith('http://') || dir.startsWith('https://')
    ? remoteResolver(dir)
    : localResolver(dir);
}

program.parse();
