export async function GET() {
  return Response.json({
    ok: true,
    message: 'InciLab API route çalışıyor.',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}
