---
id: components
title: Components
description: components
slug: /components
sidebar_position: 5
hide_table_of_contents: true
---

# Components

import LanguageSelector from "@site/src/components/LanguageSelector";
import Language from "@site/src/components/LanguageSelector/Language";
import EarlyAccessBanner from "@site/src/components/EarlyAccessBanner";
import Card from "@site/src/components/Card";
import ImageCard from "@site/src/components/ImageCard";
import Form from "@site/src/components/Form";
import Spinner from "@site/src/components/Spinner";
import ArrowLink from "@site/src/components/ArrowLink";
import ColumnLayout from "@site/src/components/ColumnLayout";
import Section from "@site/src/components/ColumnLayout/Section";
import { ContentLeft, ContentRight } from "@site/src/components/ColumnLayout/Content";

## Language Selector

<LanguageSelector>
  <Language id="js" name="JavaScript" icon="js.svg">
  ### Implement feature in JavaScript

  This is how you can implement this GenAI feature in JavaScript

  ```JavaScript
  const foo = (bar) => return bar;
  const baz = foo('ai');
  console.log(baz);
  ```
  </Language>
  <Language id="python" name="Python" icon="python.svg">
  ### Implement feature in Python

  This is how you can implement this GenAI feature in Python

  ```Python
  def foo(bar):
  baz = foo('ai')
  print(baz)  
  ```
  </Language>
</LanguageSelector>

## Language Selector with Python disabled

<LanguageSelector>
  <Language id="js" name="JavaScript" icon="js.svg">
  ### Implement feature in JavaScript

  This is how you can implement this GenAI feature in JavaScript

  ```JavaScript
  const foo = (bar) => return bar;
  const baz = foo('ai');
  console.log(baz);
  ```
  </Language>
  <Language id="python" name="Python" icon="python.svg" disabled={true}>
  ### Implement feature in Python

  This is how you can implement this GenAI feature in Python

  ```Python
  def foo(bar):
  baz = foo('ai')
  print(baz)  
  ```
  </Language>
</LanguageSelector>

## Developer Preview Banner

<EarlyAccessBanner href="https://dev.auth0.com/signup?onboard_app=genai"/>

## Card


<Card headerText="I am a Heading">

  Auth for GenAI is currently available in early access. Join today to start building secure GenAI applications and provide feedback to shape the platform's future. <ArrowLink href="" text="Link to same tab" newTab={false}/> <ArrowLink href="" text="Link to new tab"/>

  <Card headerText="I am a Card with a Checked Checkbox" checkbox={{isChecked: true}}>

  Auth for GenAI is currently available in Developer Preview. Join today to start building secure GenAI applications and provide feedback to shape the platform's future.
  
  </Card>

  <Card headerText="I am a Card with an Unchecked Checkbox" checkbox={{isChecked: false}}>

  Auth for GenAI is currently available in Developer Preview. Join today to start building secure GenAI applications and provide feedback to shape the platform's future.
  
  </Card>

  <Card headerText="I am a Card with an icon" icon="js.svg">

  Auth for GenAI is currently available in Developer Preview. Join today to start building secure GenAI applications and provide feedback to shape the platform's future.
  
  </Card>

  <Card headerText="I am a Card with an icon with no border" icon="js.svg" iconBorder={false}>

  Auth for GenAI is currently available in Developer Preview. Join today to start building secure GenAI applications and provide feedback to shape the platform's future.
  
  </Card>

  <Card headerText="I am a Card with a CTA" icon="python.svg" cta={{text: "Create App", href: "bar" }}>

  Auth for GenAI is currently available in Developer Preview. Join today to start building secure GenAI applications and provide feedback to shape the platform's future.
  
  </Card>

  <Card headerText="I am a Card with a disabled CTA" icon="python.svg" cta={{text: "Create App", href: "bar", disabled: true }}>

  Auth for GenAI is currently available in Developer Preview. Join today to start building secure GenAI applications and provide feedback to shape the platform's future.
  
  </Card>

  <Card headerText="I am a Card with a loading CTA state" icon="python.svg" cta={{text: "Create App", href: "bar", disabled: true, loading: true }}>

  Auth for GenAI is currently available in Developer Preview. Join today to start building secure GenAI applications and provide feedback to shape the platform's future.
  
  </Card>

  <Card headerText="I am a Card with tags" icon="js.svg" tags={['next.js', 'fastapi']}>

  Auth for GenAI is currently available in Developer Preview. Join today to start building secure GenAI applications and provide feedback to shape the platform's future.

  </Card>

</Card>

## Image Card

<ImageCard alt="alt" image="docusaurus-social-card.jpg"/>

## Form

<Form onSave={(formData) => console.log('formdata', formData)} onCancel={() => {}}/>

### Form with save in loading state

<Form onSave={(formData) => console.log('formdata', formData)} onCancel={() => {}} loading={true}/>

## Spinner

### Default spinner (small)

<Spinner />

### Extra small spinner

<Spinner size='xs' />


## Two Column Layout

<ColumnLayout>
  <Section>
    <ContentLeft>
    ### 1. I am a heading
    I am a bunch of content knkjangk;jadng;ksj dbs;kj bdsjk dgajk bjsa dad gakgdnja k gdjngajknagjkb adkjg akg da
    </ContentLeft>
    <ContentRight>
    ```bash
    http://mockurl.com/auth/login
    ```
    </ContentRight>
  </Section>
  <Section>
    <ContentLeft>
    I am some more content without a heading
    </ContentLeft>
    <ContentRight>
      <ImageCard image="docusaurus-social-card.jpg"/>
    </ContentRight>
  </Section>
  <Section>
    <ContentLeft>
    ### 3. I am another heading
    Content here sgjkdankjandkv;ank;akj 
    akgjdnakjv akjvs alvkalsa;sgankdgnkdasngshghja
    agkajngakjdnjkansfjknafjkn
    </ContentLeft>
    <ContentRight>
  
    ```Typescript
    // example code to show how a code block looks

    "use client";

    import { useUser } from "@auth0/nextjs-auth0";

    export default function Page() {
      // Extract the user object and loading state from Auth0.
      const { user, isLoading } = useUser();

      if (isLoading) return <div>Loading...</div>;

      // If user exists, show a welcome message and logout button.
      return (
        <main>
          <h1>Welcome, {user.name}!</h1>
          <p>
            <a href="/auth/logout">
              <button>Log out</button>
            </a>
          </p>
        </main>
      );
    }
    ```
    </ContentRight>
  </Section>
</ColumnLayout>
