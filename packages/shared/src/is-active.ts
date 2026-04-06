export function isActive(
  url: string,
  pathname: string,
  nested = true,
): boolean {
  if (url === '/') return pathname === '/';

  return nested ? pathname.startsWith(url) : pathname === url;
}
