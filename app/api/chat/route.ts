import { generateText, Output, zodSchema } from 'ai';
import { z } from 'zod';

const DIALECTS: Record<string, string> = {
  'mx': 'Mexican',
  'es': 'Iberian'
};

const translationSchema = z.object({
  translation: z.string().describe('The natural Spanish translation'),
  literal: z.string().describe('A word-for-word literal translation, if meaningfully different from the natural translation. Empty string if the same.'),
  notes: z.string().describe('A brief cultural or linguistic note about the translation. Empty string if nothing notable.'),
});

export async function POST(req: Request) {
  const { text, dialect }: { text: string; dialect: string } = await req.json();
  const spanishDialect = DIALECTS[dialect];

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    output: Output.object({ schema: zodSchema(translationSchema) }),
    system: `You are a Spanish translator. Translate the user's text into ${spanishDialect} Spanish.`,
    prompt: text,
  });

  return Response.json(output);
}
