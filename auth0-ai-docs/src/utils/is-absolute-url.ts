export function isAbsoluteUrl(url: string): boolean {
  try {
    new URL(url);
    // If the URL constructor does not throw, it is an absolute URL
    return true;
  } catch {
    return false;
  }
}
