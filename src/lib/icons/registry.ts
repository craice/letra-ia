// Every SVG dropped in src/assets/icons becomes an icon whose name is the file name.
// Only these files are bundled; there is no icon package at runtime.
const files = import.meta.glob('../../assets/icons/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function pathsOf(svg: string): string[] {
  return [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]!);
}

export const ICONS: Record<string, string[]> = Object.fromEntries(
  Object.entries(files).map(([file, svg]) => [file.split('/').pop()!.replace(/\.svg$/, ''), pathsOf(svg)]),
);

export function hasIcon(name: string): boolean {
  return name in ICONS;
}
