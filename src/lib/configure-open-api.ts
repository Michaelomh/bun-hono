import { Scalar } from '@scalar/hono-api-reference';

import type { AppOpenAPI } from '@/types';

import PackageJson from '../../package.json';

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: PackageJson.version,
      title: 'API name',
    },
  });

  app.get(
    '/docs',
    Scalar({
      url: '/doc',
      theme: 'kepler',
    }),
  );
}
