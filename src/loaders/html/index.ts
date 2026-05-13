/**
 * HTML document loader
 * Handles HTML files (.html, .htm)
 */

import type { Document, DocumentLoader, LoaderConfig } from '../../types/index.js';
import { promises as fs } from 'node:fs';
import { basename } from 'node:path';
import { Buffer } from 'node:buffer';
import { parse } from 'node-html-parser';

/**
 * Load HTML documents
 */
export class HTMLLoader implements DocumentLoader {
  supportedExtensions = ['.html', '.htm'];

  async load(source: string, config?: LoaderConfig): Promise<Document[]> {
    try {
      const content = await fs.readFile(source, 'utf-8');
      const stats = await fs.stat(source);

      // Parse once — used for both title extraction and text extraction.
      const root = parse(content, {
        comment: false,
        blockTextElements: { script: false, style: false },
      });

      const titleNode = root.querySelector('title');
      const title = titleNode?.text?.trim() || basename(source);

      // Extract text content
      const textContent = config?.preserveFormatting
        ? content
        : this.extractText(root);

      const document: Document = {
        id: this.generateId(source),
        content: textContent,
        metadata: {
          source,
          type: 'html',
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
          title,
          ...config?.metadata,
        },
      };

      // Apply chunking if configured
      if (config?.chunkSize) {
        return this.chunkDocument(document, config);
      }

      return [document];
    } catch (error) {
      throw new Error(`Failed to load HTML file ${source}: ${error}`);
    }
  }

  /**
   * Extract text content from HTML using a proper parser.
   *
   * Replaces a regex-based sanitizer that triggered CodeQL findings
   * (js/bad-tag-filter, js/double-escaping, js/incomplete-multi-character-sanitization).
   * The parser handles script/style removal, entity decoding, and nested
   * tag edge cases that regex can't safely cover.
   */
  private extractText(root: ReturnType<typeof parse>): string {
    // Strip script + style nodes before reading text.
    root.querySelectorAll('script, style').forEach((node) => node.remove());

    // `.text` returns innerText with HTML entities already decoded by the parser.
    return root.text.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  }

  /**
   * Split document into chunks
   */
  private chunkDocument(document: Document, config: LoaderConfig): Document[] {
    const chunkSize = config.chunkSize ?? 1000;
    const chunkOverlap = config.chunkOverlap ?? 200;
    const content = document.content;
    const chunks: Document[] = [];

    let start = 0;
    let chunkIndex = 0;

    while (start < content.length) {
      const end = Math.min(start + chunkSize, content.length);
      const chunkContent = content.slice(start, end);

      chunks.push({
        id: `${document.id}-chunk-${chunkIndex}`,
        content: chunkContent,
        metadata: {
          ...document.metadata,
          chunkIndex,
          startChar: start,
          endChar: end,
          parentDocumentId: document.id,
        },
      });

      start += chunkSize - chunkOverlap;
      chunkIndex++;
    }

    return chunks;
  }

  /**
   * Generate document ID from source
   */
  private generateId(source: string): string {
    return `html-${Buffer.from(source, 'utf-8').toString('base64').slice(0, 16)}`;
  }
}
