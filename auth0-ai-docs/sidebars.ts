import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'html',
      value: '<hr/>',
      className: 'menu__divider__mobile',
    },
    {
      type: 'category',
      label: 'Auth for GenAI',
      link: {
        type: 'doc',
        id: 'intro/intro',
      },
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: 'category',
          label: 'User Authentication',
          link: {
            type: 'doc',
            id: 'intro/user-authentication',
          },
          collapsed: false,
          collapsible: false,
          items: ['intro/call-your-apis-on-users-behalf'],
        },
        {
          type: 'category',
          label: "Call Other's APIs with Token Vault",
          link: {
            type: 'doc',
            id: 'intro/token-vault',
          },
          collapsed: false,
          collapsible: false,
          items: [
            'intro/connections',
            'intro/account-linking',
            'intro/call-others-apis-on-users-behalf',
          ],
        },
        'intro/asynchronous-authorization',
        'intro/authorization-for-rag',
      ],
    },
    {
      type: 'category',
      label: 'Get Started',
      link: {
        type: 'doc',
        id: 'get_started/get-started',
      },
      collapsed: false,
      collapsible: false,
      items: [
        'get_started/user-authentication',
        'get_started/call-your-apis-on-users-behalf',
        'get_started/call-others-apis-on-users-behalf',
        'get_started/asynchronous-authorization',
        'get_started/authorization-for-rag',
      ],
    },
    {
      type: 'category',
      label: 'How-Tos',
      link: {
        type: 'doc',
        id: 'examples/how-tos',
      },
      collapsed: false,
      collapsible: false,
      items: [
        'examples/check-google-calendar-availability',
        'examples/list-github-repositories',
        'examples/list-slack-channels',
        'examples/get-salesforce-opportunities',
      ],
    },
    {
      type: 'category',
      label: 'Auth for MCP',
      link: {
        type: 'doc',
        id: 'mcp/auth-for-mcp',
      },
      collapsed: false,
      collapsible: false,
      items: ['mcp/cloudflare-mcp'],
    },
    {
      type: 'doc',
      label: 'Sample Apps',
      id: 'sample-apps',
      className: 'menu__list-item-collapsible',
    },
    {
      type: 'category',
      label: 'Frameworks & SDKs',
      link: {
        type: 'doc',
        id: 'sdks/sdks',
      },
      collapsed: false,
      collapsible: false,
      items: [
        'sdks/javascript-sdk',
        'sdks/python-sdk',
        'sdks/langchain-sdk',
        'sdks/llamaindex-sdk',
        'sdks/vercel-ai-sdk',
        'sdks/cloudflare-sdk',
        'sdks/genkit-sdk',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'doc',
        id: 'guides/guides',
      },
      collapsed: false,
      collapsible: false,
      items: [
        'guides/google-sign-in-and-auth',
        'guides/client-initiated-account-linking',
      ],
    },
    {
      type: 'html',
      value: '<hr/>',
      className: 'menu__divider',
    },
    {
      type: 'doc',
      id: 'support/support',
      label: 'Support & Community',
      className: 'menu__list-item-collapsible',
    },
    {
      type: 'doc',
      id: 'glossary',
      label: 'Glossary',
      className: 'menu__list-item-collapsible',
    },
  ],
};

export default sidebars;
