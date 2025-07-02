---
id: authorization-for-rag
title: Authorization for RAG
description: Learn how Auth for GenAI provides fine-grained access control for AI agents.
slug: /authorization-for-rag
sidebar_position: 10
hide_table_of_contents: true
---

# Authorization for RAG

import LanguageSelector from "@site/src/components/LanguageSelector";
import Language from "@site/src/components/LanguageSelector/Language";
import Card from "@site/src/components/Card";
import ArrowLink from "@site/src/components/ArrowLink";

Auth for GenAI leverages [Auth0 FGA](https://auth0.com/fine-grained-authorization) to provide fine-grained authorization control for AI agents. As a result, when AI agents use Retrieval Augmented Generation (RAG) to provide sophisticated, relevant responses to user queries, they only have access to authorized data.

By the end of this quickstart, you should have an application that can:

1. Retrieve authorized data as context for a RAG pipeline using [LangChain](https://www.langchain.com/).
2. Use Auth0 FGA to determine if the user has authorization for the data.

:::note

We value your feedback! To ask questions, report issues, or request new frameworks and providers, connect with us on [GitHub](https://github.com/auth0/auth-for-genai).

:::

<LanguageSelector>
  <Language id="js" name="Node.js" icon="js-clean.svg">

<Card headerText="Prerequisites">

Before getting started, make sure you:

<Card headerText="Create an Auth0 FGA account" icon="fga.svg">
  You need an <ArrowLink href="https://dashboard.fga.dev/" text="Auth0 FGA account"/> to complete this quickstart.
</Card>

<Card headerText="OpenAI Platform" icon="openai.svg">

  Set up an <ArrowLink href="https://platform.openai.com/docs/libraries#create-and-export-an-api-key" text="OpenAI account and API key"/>.

</Card>
<Card headerText="Create Node.js application" icon="js-clean.svg">

  If you're using a Javascript framework, <ArrowLink href="https://docs.npmjs.com/cli/v11/commands/npm-init#examples" text="create a Node.js application"/> with Typescript support.

</Card>

</Card>

## Install dependencies

As a first step, let’s get all dependencies installed:

```bash showLineNumbers title="Create a new Node.js project"
npm init -y
npm install langchain@0.3 @langchain/langgraph@0.2 @auth0/ai-langchain@3 dotenv@16
```

## Set up an FGA Store

In the [Auth0 FGA dashboard](https://dashboard.fga.dev/):

1. Navigate to **Settings**. In the **Authorized Clients** section, click **+ Create Client**.
2. Give your client a name and mark all the client permissions that are required for your use case. For the quickstart you’ll only need **Read and query**.
3. Click **Create**.

![Set up FGA Store](/img/auth_for_rag_set_up_fga_store.png)

Once your client is created, you’ll see a modal containing Store ID, Client ID, and Client Secret. Add an `.env.local` file with the following content to the root directory of the project. Click **Continue** to see the `FGA_API_URL` and `FGA_API_AUDIENCE.`

The confirmation dialog will provide you with all the information that you need for your environment file.

```bash showLineNumbers title=".env.local"
# You can use any provider of your choice supported by Vercel AI
OPENAI_API_KEY=<your-openai-api-key>

# Auth0 FGA
FGA_STORE_ID=<your-fga-store-id>
FGA_CLIENT_ID=<your-fga-store-client-id>
FGA_CLIENT_SECRET=<your-fga-store-client-secret>
FGA_API_URL=https://api.xxx.fga.dev
FGA_API_AUDIENCE=https://api.xxx.fga.dev/
```

Next, navigate to **Model Explorer**. You’ll need to update the model information with this:

```bash showLineNumbers
model
  schema 1.1

type user

type doc
  relations
    define owner: [user]
    define viewer: [user, user:*]
```

Remember to click **Save**.

Now, to access public information, you’ll need to add a tuple on FGA. Navigate to the **Tuple Management** section and click **+ Add Tuple**. Fill in the following information:

- **User**: `user:*`
- **Object**: select doc and add `public-doc` in the ID field
- **Relation**: `viewer`

A tuple signifies a user’s relation to a given object. For example, the above tuple implies that all users can view the `public-doc` object.

## Secure the RAG Tool

After all this configuration, let’s get back to our node.js project. There you’ll secure the RAG tool using [Auth0 FGA](https://auth0.com/fine-grained-authorization) and [Auth0 AI SDK](https://github.com/auth0-lab/auth0-ai-python).

## Get the Assets

Create an `assets` folder and download the below files into the folder:

- [`public-doc.md`](https://raw.githubusercontent.com/auth0-samples/auth0-ai-samples/refs/heads/main/authorization-for-rag/langgraph-agentic-js/assets/docs/public-doc.md)
- [`private-doc.md`](https://raw.githubusercontent.com/auth0-samples/auth0-ai-samples/refs/heads/main/authorization-for-rag/langgraph-agentic-js/assets/docs/private-doc.md)

## Create helper functions

Create a LangGraph agent and other helper functions that are needed to load documents.

The first helper will create an in-memory vector store using `faiss` and `OpenAIEmbeddings`. You can replace this module with your own store, as long as it follows the LangChain retriever specification.

```ts showLineNumbers title="./helpers.ts"
import fs from "node:fs/promises";
import { StructuredToolInterface } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

export class RetrievalAgent {
  private agent;

  private constructor(agent) {
    this.agent = agent;
  }

  // Create a retrieval agent with a retriever tool and a language model
  static create(tools: StructuredToolInterface[]) {
    // Create a retrieval agent that has access to the retrieval tool.
    const retrievalAgent = createReactAgent({
      llm: new ChatOpenAI({ temperature: 0, model: "gpt-4o-mini" }),
      tools,
      stateModifier: [
        "Answer the user's question only based on context retrieved from provided tools.",
        "Only use the information provided by the tools.",
        "If you need more information, ask for it.",
      ].join(" "),
    });

    return new RetrievalAgent(retrievalAgent);
  }

  // Query the retrieval agent with a user question
  async query(query: string) {
    const { messages } = await this.agent.invoke({
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
    });

    return messages.at(-1)?.content;
  }
}

async function readDoc(path: string) {
  return await fs.readFile(path, "utf-8");
}

/* Reads documents from the assets folder and converts them to langChain Documents */
export async function readDocuments() {
  const folderPath = "./assets";
  const files = await fs.readdir(folderPath);
  const documents: Document[] = [];

  for (const file of files) {
    documents.push(
      new Document({
        pageContent: await readDoc(`${folderPath}/${file}`),
        metadata: { id: file.slice(0, file.lastIndexOf(".")) },
      })
    );
  }

  return documents;
}
```

## Create a RAG Pipeline

Define a RAG tool that uses the `FGARetriever` to filter authorized data from an in-memory vector database.

In the first step, we will define a new RAG tool. The agent calls the tool when needed.

<!--don't need all these code comments-->

<!--don't need all these code comments-->

```ts showLineNumbers title="./index.ts"
import "dotenv/config";

import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { FGARetriever } from "@auth0/ai-langchain";

import { readDocuments, RetrievalAgent } from "./helpers";

async function main() {
  console.info(
    "\n..:: LangGraph Agents Example: Agentic Retrieval with Auth0 FGA \n\n"
  );

  const user = "user1";
  // 1. Read and load documents from the assets folder
  const documents = await readDocuments();
  // 2. Create an in-memory vector store from the documents for OpenAI models.
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings({ model: "text-embedding-3-small" })
  );
  // 3. Create a retriever that uses FGA to gate fetching documents on permissions.
  const retriever = FGARetriever.create({
    retriever: vectorStore.asRetriever(),
    // FGA tuple to query for the user's permissions
    buildQuery: (doc) => ({
      user: `user:${user}`,
      object: `doc:${doc.metadata.id}`,
      relation: "viewer",
    }),
  });
  // 4. Convert the retriever into a tool for an agent.
  const fgaTool = retriever.asJoinedStringTool();
  // 5. The agent will call the tool, rephrasing the original question and
  // populating the "query" argument, until it can answer the user's question.
  const retrievalAgent = RetrievalAgent.create([fgaTool]);
  // 6. Query the retrieval agent with a prompt
  const answer = await retrievalAgent.query("Show me forecast for ZEKO?");

  console.info(answer);
}

main().catch(console.error);
```

## Run the application

To run the application, add the below to `package.json`:

```json showLineNumbers title="package.json"
"x-type": "module",
"main": "index.js",
"scripts": {
  "start": "npx tsx index.ts"
},
```

Run the application using `npm start`, and the agent will respond that it cannot find the required information.

The application can retrieve the information if you change the query to something available in the public document.

Now, to access the private information, you’ll need to update your tuple list. Go back to the Okta FGA dashboard in the **Tuple Management** section and click **+ Add Tuple**. Fill in the following information:

- **User**: `user:user1`
- **Object**: select doc and add `private-doc` in the ID field
- **Relation**: `viewer`

Now, click **Add Tuple** and then run `npm start` again. This time, you should see a response containing the forecast information since you added a tuple that defines the `viewer` relation for `user1` to the `private-doc` object.

Explore [the example app on GitHub](https://github.com/auth0-samples/auth0-ai-samples/tree/main/authorization-for-rag/langgraph-agentic-js).

  </Language>
  <Language id="python" name="Python" icon="python.svg">
  ## Install dependencies

Please use [Python version \>\=3.11 and \<4.0](https://www.python.org/downloads/).

As a first step, let’s create a virtual environment and install the dependencies:

```bash showLineNumbers
# Create a virtual env
python -m venv venv
# Activate the virtual env
source ./venv/bin/activate
# Install dependencies
pip install langgraph langchain-openai python-dotenv faiss-cpu langchain-community auth0-ai-langchain langgraph-prebuilt
```

## Set up an FGA Store

In the [Auth0 FGA dashboard](https://dashboard.fga.dev/):

1. Navigate to **Settings**. In the **Authorized Clients** section, click **+ Create Client**.
2. Give your client a name and mark all the client permissions that are required for your use case. For the quickstart you’ll only need **Read and query**.
3. Click **Create**.

![Set up FGA Store](/img/auth_for_rag_set_up_fga_store.png)

Once your client is created, you’ll see a modal containing Store ID, Client ID, and Client Secret. Add an `.env.local` file with the following content to the root directory of the project. Click **Continue** to see the `FGA_API_URL` and `FGA_API_AUDIENCE.`

The confirmation dialog will provide you with all the information that you need for your environment file.

```bash showLineNumbers title=".env.local"
# You can use any provider of your choice supported by Vercel AI
OPENAI_API_KEY=<your-openai-api-key>

# Auth0 FGA
FGA_STORE_ID=<your-fga-store-id>
FGA_CLIENT_ID=<your-fga-store-client-id>
FGA_CLIENT_SECRET=<your-fga-store-client-secret>
FGA_API_URL=https://api.xxx.fga.dev
FGA_API_AUDIENCE=https://api.xxx.fga.dev/
```

Next, navigate to **Model Explorer**. You’ll need to update the model information with this:

```bash showLineNumbers
model
  schema 1.1

type user

type doc
  relations
    define owner: [user]
    define viewer: [user, user:*]
```

Remember to click **Save**.

Now, to access public information, you’ll need to add a tuple on FGA. Navigate to the **Tuple Management** section and click **+ Add Tuple**. Fill in the following information:

- **User**: `user:*`
- **Object**: select doc and add `public-doc` in the ID field
- **Relation**: `viewer`

A tuple signifies a user’s relation to a given object. For example, the above tuple implies that all users can view the `public-doc` object.

## Secure the RAG Tool

After all this configuration, let’s get back to our node.js project. There you’ll secure the RAG tool using [Auth0 FGA](https://auth0.com/fine-grained-authorization) and [Auth0 AI SDK](https://github.com/auth0-lab/auth0-ai-python).

## Get the assets

Create an `assets` folder and download the below files into the folder:

- [`public-doc.md`](https://raw.githubusercontent.com/auth0-samples/auth0-ai-samples/refs/heads/main/authorization-for-rag/langgraph-agentic-js/assets/docs/public-doc.md)
- [`private-doc.md`](https://raw.githubusercontent.com/auth0-samples/auth0-ai-samples/refs/heads/main/authorization-for-rag/langgraph-agentic-js/assets/docs/private-doc.md)

## Create helper functions

<!--do we need all these helper functions?-->
Create a LangGraph agent and other helper functions that are needed to load documents.

The first helper will create an in-memory vector store using `faiss` and `OpenAIEmbeddings`. You can replace this module with your own store, as long as it follows the LangChain retriever specification.

```Python showLineNumbers title="./helpers/memory_store.py"
import faiss

from langchain_openai import OpenAIEmbeddings
from langchain_community.docstore import InMemoryDocstore
from langchain_community.vectorstores import FAISS

class MemoryStore:
    def __init__(self, store):
        self.store = store

    @classmethod
    def from_documents(cls, documents):
        embedding_model = OpenAIEmbeddings(model="text-embedding-ada-002")
        index = faiss.IndexFlatL2(1536)
        docstore = InMemoryDocstore({})
        index_to_docstore_id = {}
        vector_store = FAISS(embedding_model, index, docstore, index_to_docstore_id)

        vector_store.add_documents(documents)

        return cls(vector_store)

    def as_retriever(self):
        return self.store.as_retriever()
```

The second helper will load the documents from the assets folder into the store.

```python showLineNumbers title="./helpers/read_documents.py"
import os

from langchain_core.documents import Document

def read_documents():
    current_dir = os.path.dirname(__file__)
    public_doc_path = os.path.join(current_dir, "../docs/public-doc.md")
    private_doc_path = os.path.join(current_dir, "../docs/private-doc.md")

    with open(public_doc_path, "r", encoding="utf-8") as file:
        public_doc_content = file.read()

    with open(private_doc_path, "r", encoding="utf-8") as file:
        private_doc_content = file.read()

    documents = [
        Document(
            page_content=public_doc_content,
            metadata={"id": "public-doc", "access": "public"},
        ),
        Document(
            page_content=private_doc_content,
            metadata={"id": "private-doc", "access": "private"},
        ),
    ]

    return documents
```

## Create a RAG Pipeline

Define a RAG tool that uses the FGARetriever to filter authorized data from an in-memory vector database.

In the first step, we will define a new RAG tool. The agent will call up the tool when needed.

```python showLineNumbers title="./main.py"
@tool
def agent_retrieve_context_tool(query: str):
    """Call to get information about a company, e.g., What is the financial outlook for ZEKO?"""
    documents = read_documents()
    vector_store = MemoryStore.from_documents(documents)

    user_id = "admin"

    retriever = FGARetriever(
        retriever=vector_store.as_retriever(),
        build_query=lambda doc: ClientBatchCheckItem(
            user=f"user:{user_id}",
            object=f"doc:{doc.metadata.get('id')}",
            relation="viewer",
        ),
    )

    relevant_docs = retriever.invoke(query)

    if len(relevant_docs) > 0:
        return "\n\n".join([doc.page_content for doc in relevant_docs])

    return "I don't have any information on that."

tools = [agent_retrieve_context_tool]
```

The `FGARetriever` defined in the `retrieve` node is designed to abstract the base retriever from the FGA query logic. In this case, the `build_query` argument lets us specify how to query our FGA model by asking if the user is a viewer of the document.

```python showLineNumbers title="./main.py"
# ...

build_query=lambda doc: ClientBatchCheckItem(
    user=f"user:{user_id}",
    object=f"doc:{doc.metadata.get('id')}",
    relation="viewer",
),
```

Next, we define the ReActive Agent nodes, as seen in the file below. Please refer to the comments to see explanations of the steps:

```python showLineNumbers title="./main.py"
# ...

def agent_node(state: State):
    """
    Generate the response from the agent.
    """
    llm_response = llm.invoke(state["messages"])
    return {"messages": [llm_response]}

def agent_should_continue(state: State):
    """
    Determines whether the conversation should continue based on the user input.
    """
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"

    return END

def generate_response_node(state: State):
    """
    Generate the response from the agent based on the result of the RAG tool.
    """
    prompt = PromptTemplate(
        template="""You are an assistant for question-answering tasks. Use the following pieces of retrieved-context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise. Question: {question}. Context: {context}. Answer:""",
        input_variables=["question", "context"],
    )

    question = state["messages"][0].content
    context = state["messages"][-1].content

    chain = prompt | llm

    llm_response = chain.invoke(
        {"question": question, "context": context}, prompt=prompt
    )

    return {"messages": [llm_response]}
```

And finally, we build the graph.

```python showLineNumbers title="./main.py"
# ...

# Create the OpenAI chat tool
llm = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)

# Build the graph
graph_builder = StateGraph(State)
tool_node = ToolNode(tools)

# Define the nodes
graph_builder.add_node("agent", agent_node)
graph_builder.add_node("tools", tool_node)
graph_builder.add_node("generate_response", generate_response_node)

# Run the graph
result = graph.invoke(
    {"messages": [("human", "What is the financial outlook for ZEKO?")]}
)
print(result["messages"][-1].content)
```

## Run the application

To run the application, simply run the Python script as follows:

```bash showLineNumbers
python main.py
```

The application can retrieve the information if you change the query to something available in the public document.
Now, to access the private information, you’ll need to update your tuple list. Go back to the Okta FGA dashboard in the **Tuple Management** section and click **+ Add Tuple**. Fill in the following information:

- **User**: `user:user1`
- **Object**: select doc and add `private-doc` in the ID field
- **Relation**: `viewer`

Now, click **Add Tuple** and then run `npm start` again. This time, you should see a response containing the forecast information since you added a tuple that defines the `viewer` relation for `user1` to the `private-doc` object.
  </Language>
</LanguageSelector>

## Next steps

- Learn how to use <ArrowLink text="Auth0 FGA" href="https://auth0.com/fine-grained-authorization" /> to create a Relationship-Based Access Control (ReBAC) authorization model.
- Learn more about <ArrowLink text="OpenFGA" href="https://openfga.dev/docs/fga" />
