export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  label = 'Operation'
): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(
          () => reject(new Error(`${label} timed out after ${timeoutMs} ms.`)),
          timeoutMs
        );
      })
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

