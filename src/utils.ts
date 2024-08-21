export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * This error occurs when we try to persist an entity that has been changed since we last fetched it
 * This is optimistic because a) it won't happen often and b) we will retry when it does.
 *
 * The check works by comparing a `etag` on the entity to what is stored in the DB.
 * If the etag is different, we know the entity has been changed since we last fetched it and throw an error.
 * If the etag is the same, we successfully persist the entity with a new etag.
 *
 */
export class OptimisticConcurrencyCheckError extends Error {
  constructor() {
    super();
    this.name = OptimisticConcurrencyCheckError.name;
    this.message =
      'Could not persist entity changes due to the persisted entity having being changed by the time the operation was completed. Please retry.';
  }
}
/**
 * Retry the provided function if it throws an {@link OptimisticConcurrencyCheckError}
 *
 * Number of retries defaults to 3 but can be explicitly set
 */

export function ConcurrencyRetryWrapper<T>(
  fn: () => Promise<T>,
  retries = 3,
): Promise<T> {
  async function attempt(remainingRetries: number): Promise<T> {
    try {
      const res = await fn();
      return res;
    } catch (error) {
      if (error instanceof OptimisticConcurrencyCheckError) {
        if (remainingRetries > 0) {
          await wait(100 * (Math.floor(Math.random() * 3) + 1));
          return attempt(remainingRetries - 1);
        }
      }
      throw error;
    }
  }
  return attempt(retries);
}
