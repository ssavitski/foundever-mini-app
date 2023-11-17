import * as path from "path";
import { defineConfig, loadEnv } from "vitepress";
import { globbySync } from "globby";
import { fileURLToPath } from 'url'
import vueLiveMd from './vue-live-md-it.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// get all the components generated by vue-docgen-cli
const sidebarComponents = globbySync('components/**/*.md', { cwd: path.resolve(__dirname, '../src/')});
const sidebarLayouts = globbySync('layouts/**/*.md', { cwd: path.resolve(__dirname, '../src/')});
const sidebarPages = globbySync('pages/**/*.md', { cwd: path.resolve(__dirname, '../src/')});
const sidebarViews = globbySync('views/**/*.md', { cwd: path.resolve(__dirname, '../src/')});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    outDir: path.resolve(__dirname, 'dist'),
    base: '/docgen-vite/',
    themeConfig: {
      sidebar: [
        {
          text: 'Components',
          items: sidebarComponents.map(comp => {
            return {
              text: comp.replace(/^components\//, '').replace(/\.md$/, ''),
              link: 'src/' + comp.replace(/\.md$/, '')
            }
          })
        },
        {
          text: 'Layouts',
          items: sidebarLayouts.map(comp => {
            return {
              text: comp.replace(/^layouts\//, '').replace(/\.md$/, ''),
              link: 'src/' + comp.replace(/\.md$/, '')
            }
          })
        },
        {
          text: 'Pages',
          items: sidebarPages.map(comp => {
            return {
              text: comp.replace(/^pages\//, '').replace(/\.md$/, ''),
              link: 'src/' + comp.replace(/\.md$/, '')
            }
          })
        },
        {
          text: 'Views',
          items: sidebarViews.map(comp => {
            return {
              text: comp.replace(/^views\//, '').replace(/\.md$/, ''),
              link: 'src/' + comp.replace(/\.md$/, '')
            }
          })
        }
      ]
    },
    vite: {
      resolve: {
        alias: {
          '@/': `${path.resolve(__dirname, '../../src')}/`,
          vue: path.resolve(`./node_modules/vue`),
        }
      },
      define: {
        'process.env': env,
      },
    },
    markdown: {
      config(md){
        md.use(vueLiveMd)
      }
    }
  };
});