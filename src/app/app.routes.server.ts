import { RenderMode, ServerRoute } from '@angular/ssr';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'projects',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'projects/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Read projects dynamically from index.json
      const indexPath = join(process.cwd(), 'src', '.root', 'index.json');
      const indexContent = await readFile(indexPath, 'utf-8');
      const config = JSON.parse(indexContent);

      // Extract project IDs from project links
      return config.projects.map((project: any) => {
        const id = project.link.split('/').pop(); // /projects/teknokrat -> teknokrat
        return { id };
      });
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
