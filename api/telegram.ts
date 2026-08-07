import { sendTelegramMessage, testTelegramBot } from '../src/utils/telegram';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { action, botToken, channelId, message } = body;

    const token = botToken || process.env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

    if (action === 'test') {
      const result = await testTelegramBot(token, channelId);
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!message) {
      return new Response(JSON.stringify({ success: false, error: 'Message content is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await sendTelegramMessage(token, channelId, message);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Server error processing Telegram request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
