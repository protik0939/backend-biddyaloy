type PostingCandidate = {
  id: string;
  title: string;
  summary: string;
  location?: string | null;
  institution: string;
  departmentName?: string | null;
  programTitle?: string | null;
};

type RecommendationRequest = {
  mode: "teacher" | "student";
  query: string;
  postings: PostingCandidate[];
};

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function extractTextContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const collected = content
      .map((item) => {
        if (!item || typeof item !== "object") {
          return "";
        }

        const maybeText = (item as { text?: unknown }).text;
        return typeof maybeText === "string" ? maybeText : "";
      })
      .filter(Boolean);

    return collected.join("\n");
  }

  return "";
}

function extractJsonPayload(text: string): Record<string, unknown> | null {
  const fencedRegex = /```json\s*([\s\S]*?)\s*```/i;
  const fencedMatch = fencedRegex.exec(text);
  const source = fencedMatch?.[1] ?? text;

  const firstCurly = source.indexOf("{");
  const lastCurly = source.lastIndexOf("}");
  if (firstCurly < 0 || lastCurly <= firstCurly) {
    return null;
  }

  const candidate = source.slice(firstCurly, lastCurly + 1);

  try {
    const parsed = JSON.parse(candidate);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function uniqueById(items: PostingCandidate[]) {
  const seen = new Set<string>();
  const ordered: PostingCandidate[] = [];

  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      ordered.push(item);
    }
  }

  return ordered;
}

const recommendPostings = async (payload: RecommendationRequest) => {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    throw createHttpError(500, "OPENROUTER_API_KEY is not configured");
  }

  const model = process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4o-mini";
  const limitedPostings = uniqueById(payload.postings).slice(0, 40);

  const systemPrompt = [
    "You are an educational placement assistant.",
    "Analyze the provided postings and return strict JSON only.",
    "JSON shape: { \"summary\": string, \"recommendedPostingIds\": string[], \"tips\": string[] }",
    "Recommendations must reference valid posting IDs from the input.",
    "Keep summary concise (max 120 words) and tips practical (3-5 items).",
  ].join(" ");

  const userPrompt = JSON.stringify(
    {
      mode: payload.mode,
      userQuery: payload.query,
      postings: limitedPostings,
    },
    null,
    2,
  );

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(process.env.OPENROUTER_APP_URL
        ? { "HTTP-Referer": process.env.OPENROUTER_APP_URL }
        : {}),
      ...(process.env.OPENROUTER_APP_NAME
        ? { "X-Title": process.env.OPENROUTER_APP_NAME }
        : {}),
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  const raw = (await response.json().catch(() => ({}))) as {
    choices?: Array<{
      message?: {
        content?: unknown;
      };
    }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw createHttpError(
      502,
      raw.error?.message || "OpenRouter request failed",
    );
  }

  const text = extractTextContent(raw.choices?.[0]?.message?.content);
  const parsed = extractJsonPayload(text);

  const recommendedIds = Array.isArray(parsed?.recommendedPostingIds)
    ? parsed?.recommendedPostingIds.filter(
        (item): item is string => typeof item === "string" && item.length > 0,
      )
    : [];

  const selectedIds =
    recommendedIds.length > 0
      ? recommendedIds
      : limitedPostings.slice(0, 3).map((item) => item.id);

  const recommendations = selectedIds
    .map((id) => limitedPostings.find((item) => item.id === id))
    .filter((item): item is PostingCandidate => Boolean(item));

  const summary =
    typeof parsed?.summary === "string" && parsed.summary.trim().length > 0
      ? parsed.summary.trim()
      : text || "Here are the best-fit postings based on your preferences.";

  const tips = Array.isArray(parsed?.tips)
    ? parsed.tips.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  return {
    model,
    summary,
    tips,
    recommendedPostingIds: recommendations.map((item) => item.id),
    recommendations,
  };
};

export const AIService = {
  recommendPostings,
};
