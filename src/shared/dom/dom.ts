export function getRequiredElement<T extends Element>(
  selector: string,
  parent: ParentNode = document,
): T {
  const el = parent.querySelector<T>(selector);
  if (!el) throw new Error(`Missing required element: ${selector}`);
  return el;
}
