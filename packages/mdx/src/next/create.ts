import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import { findConfigFile } from '../loaders/config';
import { start } from './map';
import { type Options as MDXLoaderOptions } from '../loader-mdx';
import { readFileSync } from 'node:fs';
import type { TurbopackOptions } from 'next/dist/server/config-shared';

export interface CreateMDXOptions {
  /**
   * Path to source configuration file
   */
  configPath?: string;

  /**
   * Directory for output files
   *
   * @defaultValue '.source'
   */
  outDir?: string;
}

const defaultPageExtensions = ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'];

let isTurboExperimental: boolean;

// not a good solution, but works
try {
  const content = readFileSync('./node_modules/next/package.json').toString();
  const version = JSON.parse(content).version as string;

  isTurboExperimental =
    version.startsWith('15.0.') ||
    version.startsWith('15.1.') ||
    version.startsWith('15.2.');
  // Next.js 16+ always uses top-level turbopack
  if (version.startsWith('16.') || parseInt(version.split('.')[0], 10) > 16)
    isTurboExperimental = false;
} catch {
  isTurboExperimental = false;
}

export { start };

export function createMDX({
  configPath = findConfigFile(),
  outDir = '.source',
}: CreateMDXOptions = {}) {
  if (process.env._RAMONXP_MDX !== '1') {
    process.env._RAMONXP_MDX = '1';

    void start(process.env.NODE_ENV === 'development', configPath, outDir);
  }

  return (nextConfig: NextConfig = {}): NextConfig => {
    const mdxLoaderOptions: MDXLoaderOptions = {
      configPath,
      outDir,
    };
    const turbo: TurbopackOptions = {
      ...nextConfig.turbopack,
      rules: {
        ...nextConfig.turbopack?.rules,
        '*.{md,mdx}': {
          loaders: [
            {
              loader: '@xispedocs/mdx/loader-mdx',
              options: mdxLoaderOptions as any,
            },
          ],
          as: '*.js',
        },
      },
    };

    const updated: NextConfig = {
      ...nextConfig,
      pageExtensions: nextConfig.pageExtensions ?? defaultPageExtensions,
      webpack: (config: Configuration, options) => {
        config.resolve ||= {};

        config.module ||= {};
        config.module.rules ||= [];

        config.module.rules.push({
          test: /\.mdx?$/,
          use: [
            options.defaultLoaders.babel,
            {
              loader: '@xispedocs/mdx/loader-mdx',
              options: mdxLoaderOptions,
            },
          ],
        });

        config.plugins ||= [];

        return nextConfig.webpack?.(config, options) ?? config;
      },
    };

    if (isTurboExperimental) {
      updated.experimental = { ...updated.experimental, turbo } as any;
    } else {
      updated.turbopack = turbo;
    }

    return updated;
  };
}
