import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { customCodeBlockTheme } from './src/theme/CodeBlock/customTheme';
import { MAIN_MENU_ITEM_CLASSNAME } from './constants';

require('dotenv').config();

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Auth0',
  tagline: 'Auth for Generative AI Applications',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: process.env.BASE_URL,

  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/ai/docs/',

  customFields: {
    heapProjectId: process.env.NEXT_PUBLIC_HEAP_PROJECT_ID,
    oneTrustDataDomainId: process.env.NEXT_PUBLIC_DOMAIN_ID_ONE_TRUST,
    loginUrl: process.env.NEXT_PUBLIC_LOGIN_URL,
    logoutUrl: process.env.NEXT_PUBLIC_LOGOUT_URL,
    signupUrl: process.env.NEXT_PUBLIC_SIGN_UP_URL,
    dashboardUrl: process.env.DASHBOARD_URL,
  },

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'auth0', // Usually your GitHub org/user name.
  projectName: 'auth0', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    // [
    //     require.resolve("@easyops-cn/docusaurus-search-local"),
    //     /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
    //     ({
    //         hashed: true,
    //         docsDir: 'docs/',
    //         docsRouteBasePath: '/',
    //         // If you're using `noIndex: true`, set `forceIgnoreNoIndex` to enable local index:
    //         // forceIgnoreNoIndex: true,
    //     }),
    // ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: '//cdn.auth0.com/website/auth0ai/twittercard.png',
    navbar: {
      title: '',
      logo: {
        alt: 'Auth0 Logo',
        src: 'https://cdn.auth0.com/website/auth0ai/auth0logo.svg',
      },
      items: [
        {
          type: 'custom-tenantSwitcher',
          position: 'left',
        },
        {
          to: '/get-started',
          label: 'Docs',
          position: 'right',
          className: MAIN_MENU_ITEM_CLASSNAME,
        },
        {
          to: '/how-tos',
          label: 'How-Tos',
          position: 'right',
          className: MAIN_MENU_ITEM_CLASSNAME,
        },
        {
          to: '/auth-for-mcp',
          label: 'Auth for MCP',
          position: 'right',
          className: MAIN_MENU_ITEM_CLASSNAME,
        },
        {
          to: '/sdks',
          label: 'SDKs',
          position: 'right',
          className: MAIN_MENU_ITEM_CLASSNAME,
        },
        {
          type: 'custom-loginButton',
          position: 'right',
        },
        {
          type: 'custom-signupButton',
          position: 'right',
        },
        {
          type: 'custom-navBarProfile',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          // title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: '/docs/intro',
            },
          ],
        },
        {
          // title: 'Community',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/auth0',
            },
            {
              label: 'X',
              href: 'https://x.com/auth0',
            },
            // {
            //     label: 'Discord',
            //     href: 'https://discordapp.com/invite/docusaurus',
            // },
          ],
        },
        {
          // title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'https://auth0.com/blog/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Auth0.com • All Rights Reserved.`,
    },
    prism: {
      theme: customCodeBlockTheme,
      darkTheme: customCodeBlockTheme,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: false,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
