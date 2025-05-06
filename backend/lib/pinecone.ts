import { Pinecone } from '@pinecone-database/pinecone'

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not set')
}

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('PINECONE_INDEX_NAME is not set')
}

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
})
export const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME)

export async function verifyIndexConfiguration() {
  try {
    const indexDescription = await pinecone.describeIndex(
      process.env.PINECONE_INDEX_NAME!
    )
    console.log('Current index configuration:', indexDescription)
    return indexDescription
  } catch (error) {
    console.error('Error verifying index configuration:', error)
    throw error
  }
}
