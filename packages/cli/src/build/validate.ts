import type { Output, OutputComponent } from '@/registry/schema';

export function validateOutput(registry: Output) {
  function validateComponent(
    comp: OutputComponent,
    ctx: {
      stack?: Map<string, Set<string>>;
    } = {},
  ) {
    const { stack = new Map<string, Set<string>>() } = ctx;

    for (const file of comp.files) {
      const parents = stack.get(file.path);

      if (parents) {
        parents.add(comp.name);
      } else {
        stack.set(file.path, new Set([comp.name]));
      }
    }

    for (const name of comp.subComponents) {
      const subComp = registry.components.find((item) => item.name === name);
      if (!subComp) {
        console.warn(`skipped component ${name}: not found`);
        continue;
      }

      validateComponent(subComp, {
        stack,
      });
    }

    for (const file of comp.files) {
      const parents = stack.get(file.path);
      if (!parents) continue;
      if (parents.size <= 1) continue;

      throw new Error(
        `Duplicado arquivo no mesmo componente ${Array.from(parents).join(', ')}: ${file.path}`,
      );
    }
  }

  const compSet = new Set<string>();
  for (const comp of registry.components) {
    if (compSet.has(comp.name))
      throw new Error(`duplicado nome de componente ${comp.name}`);
    compSet.add(comp.name);

    validateComponent(comp);
  }
}
