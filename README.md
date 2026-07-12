# @dcyfr/ai-rag

<!-- README-META
  tlp_clearance: GREEN
  status: active
  name: dcyfr-ai-rag
  description: RAG (Retrieval-Augmented Generation) system template - DCYFR AI starter
  last_validated: 2026-07-11
-->

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/dcyfr-labs/dcyfr-ai-rag)

> **RAG (Retrieval-Augmented Generation) framework for Node.js and TypeScript**

Build production-ready RAG systems with document loading, embedding, vector stores, and semantic search.

[![npm version](https://img.shields.io/npm/v/@dcyfr/ai-rag.svg)](https://www.npmjs.com/package/@dcyfr/ai-rag)
[![CI](https://github.com/dcyfr-labs/dcyfr-ai-rag/actions/workflows/ci.yml/badge.svg)](https://github.com/dcyfr-labs/dcyfr-ai-rag/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About DCYFR

`@dcyfr/ai-rag` is maintained by **DCYFR Labs** as part of the DCYFR AI tooling portfolio.

- **DCYFR** is a registered trademark of DCYFR Labs.
- Primary domain: [www.dcyfr.ai](https://www.dcyfr.ai)
- Licensing details: [LICENSE](./LICENSE)
- Security policy: [SECURITY.md](./SECURITY.md)

---

## ⚡ 30-Second Quick Start

```bash
# Install package
npm install @dcyfr/ai-rag

# Basic usage
import { TextLoader, InMemoryVectorStore } from '@dcyfr/ai-rag';

const loader = new TextLoader();
const store = new InMemoryVectorStore();
# ✅ RAG system ready for document ingestion
```

---

## 📄 Document Conversion (MarkItDown)

Convert diverse document formats to LLM-optimized Markdown:

```typescript
import { convertToMarkdown, convertBatch } from "@dcyfr/ai-rag";

// Single document conversion
const result = await convertToMarkdown("/path/to/document.pdf", {
  timeout: 45000, // 45 seconds
  maxFileSize: 50 * 1024 * 1024, // 50 MB
  enableLLMDescriptions: true, // Use GPT-4 Vision for image descriptions
});

console.log(result.markdown); // Converted markdown content
console.log(result.metadata); // File size, duration, page count, etc.

// Batch conversion (parallel, concurrency-controlled)
const files = ["/docs/report.pdf", "/slides/deck.pptx", "/data/sheet.xlsx"];
const results = await convertBatch(files, { timeout: 60000 });

results.forEach((r, i) => {
  if (r.success) {
    console.log(`✅ ${files[i]}: ${r.markdown.length} chars`);
  } else {
    console.error(`❌ ${files[i]}: ${r.error}`);
  }
});
```

**Supported Formats:**

- **Documents:** PDF, DOCX, PPTX, XLSX, CSV, TXT, Markdown
- **Web:** HTML, XML, JSON
- **Images:** PNG, JPG, JPEG, GIF, WEBP (with optional LLM-powered OCR)
- **Audio:** MP3, WAV, M4A (transcription)
- **Archives:** EPUB, ZIP

**Installation:**

```bash
# Requires a Python 3 environment with the MarkItDown package
pip install 'markitdown>=0.1.5'
```

Verify availability at runtime with `checkMarkItDownInstalled()` (exported from the package root).

**Performance:**

- **Latency:** 200-500ms per document (PDF/Office), <100ms (text/HTML)
- **Concurrency:** Max 3 parallel conversions (configurable)
- **Memory:** ~50-200 MB per conversion (temp files auto-cleaned)

**Error Handling:**

```typescript
import { ConversionError, ConversionErrorType } from "@dcyfr/ai-rag";

try {
  const result = await convertToMarkdown("/path/to/file.pdf");
} catch (error) {
  if (error instanceof ConversionError) {
    switch (error.type) {
      case ConversionErrorType.TIMEOUT:
        console.error("Conversion timed out - file too large?");
        break;
      case ConversionErrorType.FILE_TOO_LARGE:
        console.error(`File exceeds ${error.details?.maxFileSize} bytes`);
        break;
      case ConversionErrorType.UNSUPPORTED_FORMAT:
        console.error("File format not supported by MarkItDown");
        break;
      default:
        console.error(`Conversion failed: ${error.message}`);
    }
  }
}
```

**LLM Integration (Optional):**

```typescript
// Enable GPT-4 Vision or Claude for image descriptions
const result = await convertToMarkdown("/path/to/presentation.pptx", {
  enableLLMDescriptions: true,
  llmModel: "gpt-4-vision-preview", // or 'claude-3-opus-20240229'
});

// Requires environment variables:
// OPENAI_API_KEY=sk-...
// ANTHROPIC_API_KEY=sk-ant-...
```

---

## 🧭 Related Packages

| Package                                  | Purpose                | Type        |
| ---------------------------------------- | ---------------------- | ----------- |
| [@dcyfr/ai](https://github.com/dcyfr-labs/dcyfr-ai)                 | Core AI harness        | npm package |
| [@dcyfr/ai-agents](https://github.com/dcyfr-labs/dcyfr-ai-agents)   | Autonomous agents      | Template    |
| [@dcyfr/ai-chatbot](https://github.com/dcyfr-labs/dcyfr-ai-chatbot) | Chatbot template       | Template    |
| [dcyfr-labs](https://github.com/dcyfr-labs/dcyfr-labs)              | Production Next.js app | Application |

---

## ✨ Features

- **📄 Document Loaders** - `TextLoader`, `MarkdownLoader`, `HTMLLoader` with configurable chunking
- **📥 Document Conversion** - PDF/Office/image/audio → Markdown via the MarkItDown bridge (`convertToMarkdown`, `convertBatch`)
- **🔢 Embeddings** - `SimpleEmbeddingGenerator` for dev/testing + a pluggable `EmbeddingGenerator` interface for real providers (OpenAI, Cohere, Ollama, …)
- **🗄️ Vector Store** - `InMemoryVectorStore` (the only store shipped today); implement the `VectorStore` interface to plug in a persistent backend
- **🔍 Semantic Retrieval** - Find relevant documents by meaning, not just keywords
- **🎯 Metadata Filtering** - Single-field filters with `eq/ne/gt/gte/lt/lte/in/nin` operators
- **⚡ Batch Processing** - Efficient ingestion with progress tracking and error handling
- **📊 Multiple Distance Metrics** - Cosine similarity, dot product, euclidean
- **📚 Complete Documentation** - 5 guides (`docs/`) + 6 runnable/type-checked examples (hybrid BM25+semantic search ships as an example; built-in support is on the Roadmap below)

---

## 📦 Installation

```bash
npm install @dcyfr/ai-rag
```

### Optional Peer Dependencies

Declared in `package.json` (both optional):

```bash
# Core AI harness integration
npm install @dcyfr/ai        # ^3.0.1

# For building a persistent vector store on Chroma
npm install chromadb         # ^1.8.0 — note: no Chroma store ships in this package yet;
                             # you implement the VectorStore interface against it
```

For production embeddings, bring your own provider SDK (e.g. `npm install openai`) and implement `EmbeddingGenerator` (see [Production Setup](#-production-setup)).

---

## 🚀 Quick Start

```typescript
import {
  TextLoader,
  SimpleEmbeddingGenerator,
  InMemoryVectorStore,
  IngestionPipeline,
  RetrievalPipeline,
} from "@dcyfr/ai-rag";

// 1. Setup components
const loader = new TextLoader();
const embedder = new SimpleEmbeddingGenerator({ dimensions: 384 });
const store = new InMemoryVectorStore({
  collectionName: "my-docs",
  embeddingDimensions: 384,
});

// 2. Ingest documents
const ingestion = new IngestionPipeline(loader, embedder, store);
await ingestion.ingest(["./docs/file1.txt", "./docs/file2.txt"]);

// 3. Query for relevant context
const retrieval = new RetrievalPipeline(store, embedder);
const result = await retrieval.query("What is machine learning?", {
  limit: 5,
  threshold: 0.7,
});

console.log(result.context); // Assembled context from top results
console.log(result.results); // Ranked document chunks with scores
```

---

## 📚 Documentation

### Comprehensive Guides

Explore our detailed documentation covering all aspects of RAG development:

- **[Document Loaders Guide](docs/DOCUMENT_LOADERS.md)** - Complete guide to loading and chunking documents
  - TextLoader, MarkdownLoader, HTMLLoader
  - Chunking strategies (fixed-size, sentence-aware, paragraph-based, semantic)
  - Custom loaders and streaming

- **[Embeddings Guide](docs/EMBEDDINGS.md)** - Vector embedding providers and techniques
  - OpenAI, Cohere, Anthropic, Ollama (local)
  - Batch processing and caching
  - Similarity metrics explained

- **[Vector Stores Guide](docs/VECTOR_STORES.md)** - Storage and retrieval optimization
  - InMemoryVectorStore (shipped) + integration patterns for external stores
  - Metadata filtering
  - Performance optimization

- **[Pipelines Guide](docs/PIPELINES.md)** - End-to-end RAG workflows
  - Ingestion pipeline (load → chunk → embed → store)
  - Retrieval pipeline (query → search → assemble context)
  - Production patterns (hybrid search, re-ranking, error handling)

- **[API Reference](docs/API.md)** - Full API documentation for all exports

### Quick Reference

**Document Loaders** - Load and chunk documents

```typescript
import { TextLoader } from "@dcyfr/ai-rag";

const loader = new TextLoader();
const docs = await loader.load("./document.txt", {
  chunkSize: 1000,
  chunkOverlap: 200,
});
```

**MarkdownLoader** - Load markdown files (`.md`)

```typescript
import { MarkdownLoader } from "@dcyfr/ai-rag";

const loader = new MarkdownLoader();
const docs = await loader.load("./README.md", {
  chunkSize: 800,
  chunkOverlap: 150,
});
```

**HTMLLoader** - Load HTML files (`.html`)

```typescript
import { HTMLLoader } from "@dcyfr/ai-rag";

const loader = new HTMLLoader();
const docs = await loader.load("./page.html", {
  chunkSize: 600,
  chunkOverlap: 100,
});
```

### Embedding Generators

**SimpleEmbeddingGenerator** - Placeholder embeddings (for development/testing)

```typescript
import { SimpleEmbeddingGenerator } from "@dcyfr/ai-rag";

const embedder = new SimpleEmbeddingGenerator({ dimensions: 384 });
const embeddings = await embedder.embed(["text 1", "text 2"]);
```

⚠️ **Production Note:** Use real embedding models in production:

- OpenAI `text-embedding-3-small` (1536 dimensions)
- Cohere `embed-english-v3.0`
- Local models via Ollama

### Vector Stores

**InMemoryVectorStore** - Fast in-memory storage

```typescript
import { InMemoryVectorStore } from "@dcyfr/ai-rag";

const store = new InMemoryVectorStore({
  collectionName: "docs",
  embeddingDimensions: 384,
  distanceMetric: "cosine", // 'cosine' | 'dot' | 'euclidean'
});

// Add documents
await store.addDocuments(chunks);

// Search
const results = await store.search(queryEmbedding, 10);

// Filter by metadata
const filtered = await store.search(queryEmbedding, 10, {
  field: "category",
  operator: "eq",
  value: "documentation",
});
```

### Ingestion Pipeline

```typescript
import { IngestionPipeline } from "@dcyfr/ai-rag";

const pipeline = new IngestionPipeline(loader, embedder, store);

const result = await pipeline.ingest(["./docs/"], {
  batchSize: 32,
  onProgress: (current, total, details) => {
    console.log(`Processing ${current}/${total}`);
  },
});

console.log(`Processed ${result.documentsProcessed} documents`);
console.log(`Generated ${result.chunksGenerated} chunks`);
```

### Retrieval Pipeline

```typescript
import { RetrievalPipeline } from "@dcyfr/ai-rag";

const pipeline = new RetrievalPipeline(store, embedder);

// Semantic search
const result = await pipeline.query("your question here", {
  limit: 5,
  threshold: 0.7,
  includeMetadata: true,
});

console.log(result.context); // Assembled context
console.log(result.results); // Ranked results
console.log(result.metadata); // Query metadata

// Find similar documents
const similar = await pipeline.findSimilar("doc-id-123", { limit: 10 });
```

---

## 💡 Examples

### Basic Examples

- **[Basic RAG](examples/basic-rag/)** - Simple document ingestion and retrieval workflow
- **[Semantic Search](examples/semantic-search/)** - Advanced search with metadata filtering
- **[Q&A System](examples/qa-system/)** - Question answering with context assembly

### Advanced Examples

- **[Advanced RAG](examples/advanced-rag/)** - Production-shaped workflow (in-memory components with notes on swapping in real providers):
  - Retry logic with exponential backoff
  - Metadata filtering with multiple sequential queries
  - Progress tracking and error handling
  - Question answering with retrieved context

- **[Metadata Filtering](examples/metadata-filtering/)** - Query scenarios with the single-field `MetadataFilter`:
  - All operators (`eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`)
  - Temporal queries (date ranges)
  - Tag-based search with the `in` operator
  - Performance comparison (filtered vs unfiltered)

- **[Hybrid Search](examples/hybrid-search/)** - Combine keyword + semantic:
  - BM25 keyword search implementation
  - Weighted score fusion
  - Reciprocal rank fusion (RRF)
  - Performance comparisons

### Running Examples

```bash
# Basic examples (runnable npm scripts)
npm run example:basic     # examples/basic-rag
npm run example:search    # examples/semantic-search
npm run example:qa        # examples/qa-system

# Advanced examples: no run scripts — execute directly with tsx…
npx tsx examples/advanced-rag/index.ts
npx tsx examples/metadata-filtering/index.ts
npx tsx examples/hybrid-search/index.ts

# …or type-check all three at once
npm run examples:check
```

For a quick directory index and targeted type-check commands, see [`examples/README.md`](examples/README.md).

---

## 🏗️ Architecture

```
┌─────────────┐
│  Documents  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Loaders   │ (Text, Markdown, HTML)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Chunking   │ (Size + overlap)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Embeddings │ (Vector generation)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Vector Store│ (In-memory or persistent)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Retrieval  │ (Semantic search)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Context   │ (Assembled results)
└─────────────┘
```

---

## 💡 Best Practices

### Chunking Strategy

**Choose appropriate chunk sizes:**

- Technical documentation: 800-1200 characters
- Blog posts/articles: 1000-1500 characters
- Code documentation: 600-1000 characters
- Q&A pairs: 400-800 characters

**Use 15-20% overlap:**

```typescript
const loader = new TextLoader();
const docs = await loader.load("./document.txt", {
  chunkSize: 1000,
  chunkOverlap: 200, // 20% overlap prevents context loss at boundaries
});
```

**Preserve document structure:**

- Use MarkdownLoader for `.md` files (preserves headings, code blocks)
- Use HTMLLoader for web pages (extracts main content, excludes nav/footer)
- Add rich metadata (source, category, tags, dates, author)

### Embedding Selection

**Development/Testing:**

- SimpleEmbeddingGenerator (fast, no API costs, not for production)

**Production (Recommended):**

- OpenAI `text-embedding-3-small` (1536 dim, $0.02/1M tokens, fast, good quality)
- OpenAI `text-embedding-3-large` (3072 dim, best quality, higher cost)
- Cohere `embed-english-v3.0` (1024 dim, multilingual support)
- Ollama local models (no API costs, data privacy, requires GPU)

**Critical:** Use the same embedder for both documents and queries!

### Search Optimization

**Set appropriate similarity thresholds:**

```typescript
const result = await pipeline.query("search query", {
  limit: 10,
  threshold: 0.7, // Filter results with score < 0.7 (adjust 0.6-0.8 based on needs)
});
```

**Use metadata filtering to narrow search space** (filters are single-field — for compound conditions run multiple sequential queries):

```typescript
const result = await pipeline.query("search query", {
  limit: 5,
  filter: { field: "category", operator: "eq", value: "technical" },
});
```

**For large collections (>100k documents):**

- Implement the `VectorStore` interface against a persistent backend with ANN indexing (e.g. Chroma via the optional `chromadb` peer)
- Implement caching for frequent queries

---

## 🔧 Troubleshooting

### Poor Search Results

**Problem:** Retrieved context not relevant to query

**Solutions:**

1. Verify using same embedder for docs and queries
2. Increase similarity threshold (0.75-0.8 for higher quality)
3. Test embedding quality:
   ```typescript
   const [ml, ai, pizza] = await embedder.embed([
     "machine learning",
     "artificial intelligence",
     "pizza",
   ]);
   const similarity = cosineSimilarity(ml, ai); // Should be >0.7
   const unrelated = cosineSimilarity(ml, pizza); // Should be <0.3
   ```
4. Adjust chunk size (smaller chunks = more precise, larger = more context)
5. Add metadata filters to narrow search space

### High API Costs

**Problem:** Embedding API costs too high

**Solutions:**

1. Implement caching for frequent queries:

   ```typescript
   const cache = new LRUCache<string, number[]>({
     max: 10000,
     ttl: 1000 * 60 * 60,
   });

   async function embedWithCache(text: string): Promise<number[]> {
     const cached = cache.get(text);
     if (cached) return cached;

     const [embedding] = await embedder.embed([text]);
     cache.set(text, embedding);
     return embedding;
   }
   ```

2. Use smaller embedding dimensions (OpenAI supports 512, 1024, 1536)
3. Switch to local models (Ollama) for development/testing
4. Batch process documents (100+ at a time) to reduce API calls

### Slow Performance

**Problem:** Search or ingestion too slow

**Solutions:**

1. **For ingestion:**
   - Increase batch size: `{ batchSize: 100 }`
   - Process files in parallel (use Promise.all with batches)
   - Use streaming loader for huge files

2. **For search:**
   - Reduce result limit: `{ limit: 5 }` instead of 50
   - Use metadata filters to narrow search space
   - `InMemoryVectorStore` does exact (brute-force) search — for collections >100k, implement the `VectorStore` interface against a persistent backend with ANN indexing

### Memory Issues

**Problem:** Application crashes with large document collections

**Solutions:**

1. Use a persistent vector store instead of in-memory (`InMemoryVectorStore` holds every document in RAM with no eviction)
2. Delete stale documents explicitly with `store.deleteDocuments(ids)` or `store.clear()`
3. Process documents in smaller batches

---

## 🧪 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test (one-shot)
npm run test:run

# Watch mode
npm run test

# Coverage
npm run test:coverage

# Lint
npm run lint
```

---

## 🔧 Production Setup

### 1. Use Real Embedding Models

```typescript
import OpenAI from "openai";

class OpenAIEmbeddingGenerator implements EmbeddingGenerator {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async embed(texts: string[]): Promise<number[][]> {
    const response = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });
    return response.data.map((d) => d.embedding);
  }

  getDimensions(): number {
    return 1536;
  }
}
```

### 2. Use Persistent Vector Stores

```typescript
import { ChromaClient } from "chromadb";

// Initialize Chroma for persistent storage
const client = new ChromaClient({ path: "./chroma-data" });
```

### 3. Add Production Monitoring

```typescript
const result = await ingestion.ingest(files, {
  onProgress: (current, total, details) => {
    // Send metrics to monitoring service
    metrics.gauge("rag.ingestion.progress", current / total);
    logger.info({ current, total, details }, "Ingestion progress");
  },
});
```

---

## 🗺️ Roadmap

_v1.1 shipped the MarkItDown document-conversion integration (see [CHANGELOG.md](CHANGELOG.md))._

### Planned

- [ ] Persistent vector stores (Chroma, Qdrant, Milvus)
- [ ] Streaming ingestion pipeline
- [ ] Built-in caching layer
- [ ] Query expansion and synonyms
- [ ] Document versioning and updates

### v1.2 (Planned)

- [ ] Hybrid search (keyword + semantic) built-in
- [ ] Re-ranking strategies (cross-encoder models)
- [ ] Multi-query retrieval
- [ ] Sparse + dense vector support
- [ ] Advanced chunking (recursive, semantic)

### v2.0 (Future)

- [ ] Distributed vector search
- [ ] Graph RAG (knowledge graphs + vectors)
- [ ] Multi-modal embeddings (text + images)
- [ ] Real-time indexing
- [ ] Auto-tuning (chunk size, thresholds)

See our [GitHub Issues](https://github.com/dcyfr-labs/dcyfr-ai-rag/issues) for feature requests and progress.

---

## 📄 License

MIT © [DCYFR](https://www.dcyfr.ai)

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## 🔗 Links

- [Website](https://www.dcyfr.ai)
- [Documentation](https://www.dcyfr.ai/docs/ai-rag)
- [GitHub](https://github.com/dcyfr-labs/dcyfr-ai-rag)
- [npm](https://www.npmjs.com/package/@dcyfr/ai-rag)

---

Built with ❤️ by the DCYFR team
