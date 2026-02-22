/**
 * Utility to run Supabase queries with a mandatory timeout.
 * This prevents the UI from hanging indefinitely if Supabase or the network stalls.
 */
export async function withTimeout<T>(
    promise: Promise<T> | { then: (onfulfilled?: (value: T) => any) => any },
    timeoutMs: number = 15000,
    errorMessage: string = "Request timed out"
): Promise<T> {
    let timeoutId: any;
    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(errorMessage));
        }, timeoutMs);
    });

    try {
        const result = await Promise.race([Promise.resolve(promise), timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId);
        return result as T;
    } catch (error) {
        if (timeoutId) clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Example usage:
 * const { data, error } = await withTimeout(supabase.from('table').select('*'));
 */
