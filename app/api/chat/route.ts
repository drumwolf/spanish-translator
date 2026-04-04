import {
  UIMessage,
  convertToModelMessages,
  streamText
} from 'ai';

const DIALECTS: any = {
  'mx': 'Mexican',
  'es': 'Iberian'
}

export async function POST(req: Request) {
  const { messages, dialect }: { messages: UIMessage[], dialect: string } = await req.json();
  const spanishDialect = DIALECTS[dialect]

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    system: `You are a Spanish translator. Translate everything the user writes into ${spanishDialect} Spanish. Reply with only the translation, nothing else.`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
