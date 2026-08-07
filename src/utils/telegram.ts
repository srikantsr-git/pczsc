export interface TelegramConfig {
  botToken: string;
  channelId: string;
  autoPost: boolean;
  enabled: boolean;
}

export interface NewsTelegramItem {
  id?: string;
  title: string;
  tag?: string;
  date?: string;
  link?: string;
}

export const DEFAULT_TELEGRAM_CONFIG: TelegramConfig = {
  botToken: (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN || '8645351450:AAGnVU2kNW_lu3E5s3djrf1g_0h3PdHUCiM',
  channelId: '',
  autoPost: true,
  enabled: true
};

/**
 * Formats a news item into HTML message for Telegram
 */
export function formatNewsTelegramMessage(item: NewsTelegramItem, siteOrigin?: string): string {
  const origin = siteOrigin || (typeof window !== 'undefined' ? window.location.origin : 'https://pczsc.org');
  
  let fullLink = item.link || '/';
  if (!fullLink.startsWith('http://') && !fullLink.startsWith('https://')) {
    fullLink = `${origin}${fullLink.startsWith('/') ? '' : '/'}${fullLink}`;
  }

  const category = item.tag ? `🏷️ <b>Category:</b> ${escapeHtml(item.tag)}\n` : '';
  const dateStr = item.date ? `📅 <b>Date:</b> ${escapeHtml(item.date)}\n` : '';

  return (
    `📢 <b>NEW ANNOUNCEMENT</b>\n\n` +
    `🏆 <b>Pune District Zilla Sports Council</b>\n\n` +
    `📌 <b>${escapeHtml(item.title)}</b>\n` +
    category +
    dateStr +
    `\n🔗 <a href="${fullLink}">View Announcement / Document</a>`
  );
}

/**
 * Escapes special HTML entities for Telegram HTML parse mode
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Sends a message to a Telegram Channel using Telegram Bot API
 */
export async function sendTelegramMessage(
  botToken: string,
  channelId: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  if (!botToken || !botToken.trim()) {
    return { success: false, error: 'Telegram Bot API Token is missing.' };
  }
  if (!channelId || !channelId.trim()) {
    return { success: false, error: 'Telegram Channel ID/Username is missing. Please enter your Channel ID (e.g. @yourchannel).' };
  }

  // Ensure channelId starts with @ if it's a username and doesn't start with - or @
  let targetChannel = channelId.trim();
  if (!targetChannel.startsWith('@') && !targetChannel.startsWith('-')) {
    targetChannel = `@${targetChannel}`;
  }

  const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: targetChannel,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });

    const data = await response.json();

    if (data.ok) {
      return { success: true };
    } else {
      console.error('Telegram API Error:', data);
      return {
        success: false,
        error: data.description || 'Failed to post message to Telegram Channel.'
      };
    }
  } catch (err: any) {
    console.error('Telegram fetch error:', err);
    return {
      success: false,
      error: err?.message || 'Network error while connecting to Telegram API.'
    };
  }
}

/**
 * Tests connection to Telegram Channel by sending a ping message
 */
export async function testTelegramBot(
  botToken: string,
  channelId: string
): Promise<{ success: boolean; error?: string }> {
  const testMessage =
    `⚡ <b>PCZSC Telegram Bot Connection Test</b>\n\n` +
    `✅ Bot connection successfully verified!\n` +
    `Notifications for published news and circulars will appear in this channel.`;

  return sendTelegramMessage(botToken, channelId, testMessage);
}
