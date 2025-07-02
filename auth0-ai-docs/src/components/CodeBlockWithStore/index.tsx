import React, { ReactNode } from 'react';

import CodeBlock from '../../theme/CodeBlock';

import type { Props } from '@theme/CodeBlock';

export type Variables = {
  searchString: string;
  replaceValue: string;
};

interface CodeBlockWithStoreProps extends Props {
  isLoggedIn: boolean;
  variables: Variables[];
  onCopyClick?: (value: string) => void;
  children: React.ReactNode;
}

export default function CodeBlockWithStore({
  isLoggedIn,
  language,
  title,
  showLineNumbers,
  variables,
  onCopyClick,
  children,
}: CodeBlockWithStoreProps): ReactNode {
  const childrenArray = React.Children.toArray(children);
  const modifiedChildren = isLoggedIn
    ? childrenArray.map((child) => {
        if (typeof child === 'string') {
          return variables.reduce((acc, variable) => {
            return acc.replace(variable.searchString, variable.replaceValue);
          }, child);
        }
        return child;
      })
    : childrenArray;
  return (
    <CodeBlock
      language={language}
      title={title}
      showLineNumbers={showLineNumbers}
      onCopyClick={onCopyClick}
    >
      {modifiedChildren}
    </CodeBlock>
  );
}
