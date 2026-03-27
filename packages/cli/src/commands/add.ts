import {
  intro,
  isCancel,
  log,
  multiselect,
  outro,
  spinner,
} from '@clack/prompts';
import picocolors from 'picocolors';
import {
  type ComponentInstaller,
  createComponentInstaller,
  type Resolver,
} from '@/utils/add/install-component';
import { installDeps } from '@/utils/add/install-deps';
import type { LoadedConfig } from '@/config';
import { validateRegistryIndex } from '@/registry/client';

export async function add(
  input: string[],
  resolver: Resolver,
  config: LoadedConfig,
) {
  const installer = createComponentInstaller({
    resolver,
    config,
  });
  let target = input;

  if (input.length === 0) {
    const spin = spinner();
    spin.start('buscando registro');
    const indexes = validateRegistryIndex(
      await resolver('_registry.json').catch((e) => {
        log.error(String(e));
        process.exit(1);
      }),
    );

    spin.stop(picocolors.bold(picocolors.greenBright('registro buscado')));

    const value = await multiselect({
      message: 'Selecione os componentes para instalar',
      options: indexes.map((item) => ({
        label: item.title,
        value: item.name,
        hint: item.description,
      })),
    });

    if (isCancel(value)) {
      outro('Ended');
      return;
    }

    target = value;
  }

  await install(target, installer);
}

export async function install(target: string[], installer: ComponentInstaller) {
  const dependencies: Record<string, string | null> = {};
  const devDependencies: Record<string, string | null> = {};

  for (const name of target) {
    intro(
      picocolors.bold(
        picocolors.inverse(
          picocolors.cyanBright(`Adicionar Componente: ${name}`),
        ),
      ),
    );

    try {
      const output = await installer.install(name);

      Object.assign(dependencies, output.dependencies);
      Object.assign(devDependencies, output.devDependencies);

      outro(picocolors.bold(picocolors.greenBright(`${name} instalado`)));
    } catch (e) {
      log.error(String(e));
      throw e;
    }
  }

  intro(picocolors.bold('Novas Dependências'));

  await installDeps(dependencies, devDependencies);

  outro(picocolors.bold(picocolors.greenBright('Sucesso')));
}
