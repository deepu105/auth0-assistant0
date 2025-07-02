import React, { ReactNode } from 'react';
import Card from '../../Card';
import ArrowLink from '../../ArrowLink';

export function OpenAICard(): ReactNode {
  return (
    <Card headerText="OpenAI Platform" icon="openai.svg">
      <p>
        Set up an{' '}
        <ArrowLink
          href="https://platform.openai.com/docs/libraries#create-and-export-an-api-key"
          text="OpenAI account and API key"
        />
      </p>
    </Card>
  );
}
