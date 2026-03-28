const LOCAL_DEV_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/$/, "");
}

function parseOriginList(rawValue: string | undefined): string[] {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);
}

function parsePreviewPattern(rawPattern: string | undefined): RegExp | null {
  if (!rawPattern) {
    return null;
  }

  try {
    return new RegExp(rawPattern);
  } catch {
    return null;
  }
}

export type OriginPolicy = {
  exactOrigins: Set<string>;
  previewOriginPattern: RegExp | null;
  isAllowedOrigin: (origin: string) => boolean;
};

export function buildOriginPolicy(): OriginPolicy {
  const exactOrigins = new Set<string>([
    ...LOCAL_DEV_ORIGINS,
    ...parseOriginList(process.env.FRONTEND_PUBLIC_URL),
    ...parseOriginList(process.env.FRONTEND_ALLOWED_ORIGINS),
  ]);

  const previewOriginPattern = parsePreviewPattern(process.env.FRONTEND_PREVIEW_URL_PATTERN);

  return {
    exactOrigins,
    previewOriginPattern,
    isAllowedOrigin(origin: string) {
      const normalizedOrigin = normalizeOrigin(origin);

      if (exactOrigins.has(normalizedOrigin)) {
        return true;
      }

      if (previewOriginPattern?.test(normalizedOrigin)) {
        return true;
      }

      return false;
    },
  };
}

export function buildTrustedOrigins(): string[] {
  const policy = buildOriginPolicy();
  const trusted = new Set<string>(policy.exactOrigins);

  if (process.env.BACKEND_PUBLIC_URL) {
    trusted.add(normalizeOrigin(process.env.BACKEND_PUBLIC_URL));
  }

  return [...trusted];
}
