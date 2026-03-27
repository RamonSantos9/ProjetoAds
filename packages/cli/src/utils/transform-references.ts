import path from 'node:path';
import { type SourceFile } from 'ts-morph';
import { typescriptExtensions } from '@/constants';

/**
 * Transformar referências para outros arquivos (ex. import/export de)
 *
 * @param file - arquivo fonte
 * @param transform - uma função que transforma o especificador do módulo
 */
export function transformReferences(
  file: SourceFile,
  transform: (specifier: string) => string | undefined,
) {
  for (const specifier of file.getImportStringLiterals()) {
    const result = transform(specifier.getLiteralValue());
    if (!result) continue;

    specifier.setLiteralValue(result);
  }
}

/**
 * Retorna o modificador de importação para `sourceFile` para importar `referenceFile`
 *
 * @example
 * ```ts
 * toReferencePath('index.ts', 'dir/hello.ts')
 * // deve output './dir/hello'
 * ```
 */
export function toImportSpecifier(
  sourceFile: string,
  referenceFile: string,
): string {
  const extname = path.extname(referenceFile);
  const removeExt = typescriptExtensions.includes(extname);

  const importPath = path
    .relative(
      path.dirname(sourceFile),
      removeExt
        ? referenceFile.substring(0, referenceFile.length - extname.length)
        : referenceFile,
    )
    .replaceAll(path.sep, '/');

  return importPath.startsWith('../') ? importPath : `./${importPath}`;
}
