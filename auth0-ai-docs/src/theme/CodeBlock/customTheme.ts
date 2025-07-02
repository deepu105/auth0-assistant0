import { themes as prismThemes, type PrismTheme } from 'prism-react-renderer';

export const customCodeBlockTheme: PrismTheme = {
  plain: {
    ...prismThemes.dracula.plain,
    backgroundColor: '#111111',
    color: '#FBFBFB',
  },
  styles: [
    ...prismThemes.dracula.styles,
    {
      types: ['prolog', 'constant', 'builtin', 'keyword', 'variable'],
      style: { color: '#b49bfc', fontStyle: 'normal' },
    },
    {
      types: ['inserted', 'function'],
      style: { color: '#8fc88a' },
    },
    {
      types: ['punctuation', 'symbol', 'attr-value', 'tag'],
      style: { color: '#fbfbfb' },
    },
    {
      types: ['attr-name'],
      style: { color: '#f4d594' },
    },
    {
      types: ['string'],
      style: { color: '#f2ac84' },
    },
    { types: ['comment'], style: { color: '#b6caff' } },
  ],
};
