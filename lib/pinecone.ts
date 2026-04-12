/**
 * Pinecone Client Configuration
 *
 * This file initializes the Pinecone client and exports a reference to the main index.
 * Pinecone is used as the vector database for storing and retrieving code embeddings
 * to support RAG (Retrieval-Augmented Generation).
 */

import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_DB_API_KEY;
if (!apiKey) {
	throw new Error("PINECONE_DB_API_KEY environment variable is required");
}

export const pinecone = new Pinecone({
	apiKey,
});

// Index name: set PINECONE_INDEX_NAME in .env. Dimension 3072 = gemini-embedding-001.
const indexName =
	process.env.PINECONE_INDEX_NAME ?? "codenawin-vector-embeddings";
const embeddingDimension = 3072;
const cloud = (process.env.PINECONE_CLOUD ?? "aws") as "aws" | "gcp" | "azure";
const region = process.env.PINECONE_REGION ?? "us-east-1";

export const pineconeIndex = pinecone.Index(indexName);

let ensurePromise: Promise<void> | null = null;

/** Ensures the Pinecone index exists; creates it if missing. Await before first query/upsert. */
export async function ensurePineconeIndex(): Promise<void> {
	if (ensurePromise) return ensurePromise;
	ensurePromise = (async () => {
		const list = await pinecone.listIndexes();
		const exists = list.indexes?.some((i) => i.name === indexName);
		if (exists) return;
		await pinecone.createIndex({
			name: indexName,
			dimension: embeddingDimension,
			spec: { serverless: { cloud, region } },
			waitUntilReady: true,
			suppressConflicts: true,
		});
	})();
	return ensurePromise;
}
