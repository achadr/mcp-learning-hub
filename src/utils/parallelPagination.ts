/**
 * Utility for fetching paginated API data in parallel batches
 * Improves performance by fetching multiple pages simultaneously
 */

export interface PageFetcher<T> {
  /**
   * Function to fetch a single page
   * @param page - Page number to fetch (1-indexed)
   * @returns Array of results or null if page fails
   */
  (page: number): Promise<T[] | null>;
}

export interface ParallelPaginationOptions {
  /**
   * Total number of pages to fetch
   */
  totalPages: number;

  /**
   * Number of pages to fetch in parallel per batch
   * @default 3
   */
  batchSize?: number;

  /**
   * Delay in milliseconds between batches
   * @default 150
   */
  batchDelay?: number;

  /**
   * Number of retries per page if it fails
   * @default 2
   */
  retries?: number;

  /**
   * Delay in milliseconds between retries
   * @default 200
   */
  retryDelay?: number;

  /**
   * Service name for logging
   */
  serviceName: string;
}

/**
 * Fetch multiple pages in parallel batches
 * Stops if a batch returns no results
 */
export async function fetchPagesInParallel<T>(
  pageFetcher: PageFetcher<T>,
  options: ParallelPaginationOptions
): Promise<T[]> {
  const {
    totalPages,
    batchSize = 3,
    batchDelay = 150,
    retries = 2,
    retryDelay = 200,
    serviceName,
  } = options;

  const allResults: T[] = [];
  let currentPage = 1;

  // Process pages in batches
  while (currentPage <= totalPages) {
    const batchStart = currentPage;
    const batchEnd = Math.min(currentPage + batchSize - 1, totalPages);
    const pagesInBatch = batchEnd - batchStart + 1;

    console.log(
      `[${serviceName}] Fetching batch: pages ${batchStart}-${batchEnd} (${pagesInBatch} pages in parallel)`
    );

    // Create array of page numbers for this batch
    const pageNumbers = Array.from(
      { length: pagesInBatch },
      (_, i) => batchStart + i
    );

    // Fetch all pages in this batch in parallel
    const batchPromises = pageNumbers.map((page) =>
      fetchPageWithRetry(page, pageFetcher, retries, retryDelay, serviceName)
    );

    const batchResults = await Promise.all(batchPromises);

    // Process results
    let emptyPagesCount = 0;
    for (let i = 0; i < batchResults.length; i++) {
      const pageNum = pageNumbers[i];
      const result = batchResults[i];

      if (result === null) {
        // Page failed after retries
        console.warn(`[${serviceName}] Page ${pageNum} failed, stopping pagination`);
        return allResults;
      }

      if (result.length === 0) {
        emptyPagesCount++;
      } else {
        allResults.push(...result);
      }
    }

    console.log(
      `[${serviceName}] Batch ${batchStart}-${batchEnd}: ${
        allResults.length - (allResults.length - batchResults.reduce((sum, r) => sum + (r?.length || 0), 0))
      } → ${allResults.length} total items`
    );

    // If all pages in batch were empty, stop fetching
    if (emptyPagesCount === pagesInBatch) {
      console.log(`[${serviceName}] All pages in batch were empty, stopping pagination`);
      break;
    }

    // Move to next batch
    currentPage = batchEnd + 1;

    // Add delay before next batch (but not after the last batch)
    if (currentPage <= totalPages) {
      await new Promise((resolve) => setTimeout(resolve, batchDelay));
    }
  }

  console.log(`[${serviceName}] ✅ Completed: ${allResults.length} total items`);
  return allResults;
}

/**
 * Fetch a single page with retry logic
 */
async function fetchPageWithRetry<T>(
  page: number,
  pageFetcher: PageFetcher<T>,
  retries: number,
  retryDelay: number,
  serviceName: string
): Promise<T[] | null> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await pageFetcher(page);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < retries) {
        console.warn(
          `[${serviceName}] Page ${page} failed (attempt ${attempt + 1}/${retries + 1}), retrying...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  console.error(
    `[${serviceName}] Page ${page} failed after ${retries + 1} attempts:`,
    lastError?.message
  );
  return null;
}
