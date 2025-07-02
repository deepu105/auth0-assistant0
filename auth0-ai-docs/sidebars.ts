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
        'intro/user-authentication',
        'intro/call-your-apis-on-users-behalf',
        'intro/token-valut',
        'intro/connections',
        'intro/account-linking',
        'intro/call-others-apis-on-users-behalf',
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
      label: 'SDKs',
      link: {
        type: 'doc',
        id: 'sdks/sdks',
      },
      collapsed: false,
      collapsible: false,
      items: ['sdks/javascript-sdk', 'sdks/python-sdk'],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'doc',
        id: 'concepts/guides',
      },
      collapsed: false,
      collapsible: false,
      items: [
        'concepts/google-sign-in-and-auth',
        'concepts/client-initiated-account-linking',
      ],
    },
    {
      type: 'doc',
      id: 'concepts/concepts',
      label: 'Concepts',
      className: 'menu__list-item-collapsible',
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
  ],
};

export default sidebars;
