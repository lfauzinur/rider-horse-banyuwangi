import { translations } from '@/lib/i18n/translations';
import { defaultSiteContent } from '@/lib/mock-data';

function flattenValue(
  value: unknown,
  prefix: string,
  result: Record<string, string>
) {
  if (typeof value === 'string') {
    result[prefix] = value;
    return;
  }

  if (Array.isArray(value)) {
    result[prefix] = JSON.stringify(value);
    return;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, child]) => {
      flattenValue(child, prefix ? `${prefix}.${key}` : key, result);
    });
  }
}

export function getEditableContentDefaults() {
  const result: Record<string, string> = {};
  flattenValue(translations.id, 'id', result);
  flattenValue(translations.en, 'en', result);
  Object.entries(defaultSiteContent).forEach(([key, value]) => {
    result[`global.${key}`] = value;
  });
  return result;
}

export function applyTranslationOverrides<T extends object>(
  base: T,
  locale: 'id' | 'en',
  content: Record<string, string>
): T {
  const merged = structuredClone(base) as Record<string, unknown>;

  Object.entries(content).forEach(([fullKey, rawValue]) => {
    if (!fullKey.startsWith(`${locale}.`)) return;
    const path = fullKey.slice(locale.length + 1).split('.');
    let cursor: Record<string, unknown> = merged;

    path.forEach((segment, index) => {
      if (index === path.length - 1) {
        const current = cursor[segment];
        if (Array.isArray(current)) {
          try {
            const parsed = JSON.parse(rawValue);
            cursor[segment] = Array.isArray(parsed) ? parsed : current;
          } catch {
            cursor[segment] = rawValue.split('\n').filter(Boolean);
          }
        } else {
          cursor[segment] = rawValue;
        }
        return;
      }

      const next = cursor[segment];
      if (!next || typeof next !== 'object' || Array.isArray(next)) return;
      cursor = next as Record<string, unknown>;
    });
  });

  return merged as T;
}
