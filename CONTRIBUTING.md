# Contributing to @dcyfr/ai-rag

Thank you for your interest in contributing to the DCYFR RAG framework!

## Licensing & Contributions

By contributing to `@dcyfr/ai-rag`, you agree that:

- Your contributions will be licensed under the project's MIT License
- You have the right to submit the contribution under this license
- You grant DCYFR Labs perpetual rights to use, modify, and distribute your contribution

### Trademark

Do not use "DCYFR" trademarks in ways that imply endorsement without permission. See [../TRADEMARK.md](../TRADEMARK.md) for usage guidelines.

**Questions?** Contact [licensing@dcyfr.ai](mailto:licensing@dcyfr.ai)

## Development Setup

```bash
# Clone repository
git clone https://github.com/dcyfr/ai-rag.git
cd ai-rag

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm run test:run

# Watch mode
npm run test:watch
```

## Project Structure

```
dcyfr-ai-rag/
├── src/
│   ├── loaders/          # Document loaders (text, markdown, HTML)
│   ├── pipeline/         # Ingestion, embedding, retrieval pipelines
│   ├── stores/           # Vector stores (in-memory, persistent)
│   └── types/            # TypeScript type definitions
├── tests/
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── examples/             # Working examples
└── docs/                 # Additional documentation
```

## Code Style

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with `@typescript-eslint`
- **Formatting**: Prettier (run `npm run lint:fix`)
- **Naming**: camelCase for variables/functions, PascalCase for classes

## Testing Guidelines

- **Coverage target**: 99%+
- **Test all public APIs**: Ensure every exported function/class has tests
- **Use descriptive names**: `should handle empty documents` not `test1`
- **Arrange-Act-Assert**: Structure tests clearly

Example:

```typescript
it("should chunk documents with overlap", async () => {
  // Arrange
  const loader = new TextLoader();
  const content = "a".repeat(2000);

  // Act
  const docs = await loader.load("./test.txt", {
    chunkSize: 1000,
    overlap: 200,
  });

  // Assert
  expect(docs.length).toBeGreaterThan(1);
  expect(docs[0].content.length).toBeLessThanOrEqual(1000);
});
```

## Pull Request Process

**Branch Naming Convention:**
```bash
# Format: <type>/DCYFR-<NUMBER>-<description>
git checkout -b feat/DCYFR-123-add-new-feature
git checkout -b fix/DCYFR-456-resolve-bug
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**PR Workflow:**
1. **Fork** the repository
2. **Create a feature branch** following naming convention above
3. **Make your changes** with tests
4. **Run tests**: `npm run test:run`
5. **Lint code**: `npm run lint`
6. **Commit**: Use conventional commits with `DCYFR-<NUMBER>` reference
7. **Push**: `git push origin <your-branch>`
8. **Open a Pull Request** with title: `[DCYFR-<NUMBER>] Brief description`

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Code refactoring
- `perf`: Performance improvement

Example:

```
feat(loaders): add PDF document loader

Implement PDF loader with text extraction and chunking support.
Uses pdf-parse for content extraction.

Closes #42
```

## Adding New Features

### Adding a New Document Loader

1. Create loader in `src/loaders/<name>/`
2. Implement `DocumentLoader` interface
3. Add tests in `tests/unit/loaders/<name>-loader.test.ts`
4. Export from `src/loaders/index.ts`
5. Update README with usage example

### Adding a New Vector Store

1. Create store in `src/stores/vector/<name>.ts`
2. Implement `VectorStore` interface
3. Add comprehensive tests
4. Document configuration options
5. Provide migration guide from in-memory store

### Adding a New Embedding Generator

1. Create generator in `src/pipeline/embedding/<name>.ts`
2. Implement `EmbeddingGenerator` interface
3. Document API keys and setup
4. Add integration tests with real API
5. Update production setup guide

## Documentation

- **README.md**: Keep quick start up-to-date
- **Code comments**: Use JSDoc for all public APIs
- **Examples**: Add working examples for new features
- **ARCHITECTURE.md**: Document significant design decisions

## Performance Guidelines

- **Batch operations**: Use batching for embeddings and vector operations
- **Stream large files**: Don't load entire files into memory
- **Progress callbacks**: Provide progress updates for long operations
- **Async/await**: Use async patterns consistently

## Security

- **No hardcoded secrets**: Use environment variables
- **Validate inputs**: Check all user inputs
- **Sanitize outputs**: Clean any user-generated content
- **Dependencies**: Keep dependencies up-to-date

## Questions?

- **GitHub Discussions**: Ask questions, share ideas
- **Issues**: Report bugs, request features
- **Email**: [hello@dcyfr.ai](mailto:hello@dcyfr.ai)

---

Thank you for contributing! 🎉
