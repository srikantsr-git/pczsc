import React, { useState } from 'react';
import { useCMS, NewsMarqueeItem } from '../../context/CMSContext';
import { useToast } from '../../context/ToastContext';
import { testTelegramBot, sendTelegramMessage, formatNewsTelegramMessage } from '../../utils/telegram';
import { Send, Bot, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export const TelegramIntegrationSection: React.FC = () => {
  const { telegramConfig, updateTelegramConfig, newsMarquee } = useCMS();
  const { showToast } = useToast();

  const [botToken, setBotToken] = useState(telegramConfig.botToken || '8645351450:AAGnVU2kNW_lu3E5s3djrf1g_0h3PdHUCiM');
  const [channelId, setChannelId] = useState(telegramConfig.channelId || '');
  const [autoPost, setAutoPost] = useState(telegramConfig.autoPost ?? true);
  const [enabled, setEnabled] = useState(telegramConfig.enabled ?? true);
  const [showToken, setShowToken] = useState(false);

  const [testing, setTesting] = useState(false);
  const [postingId, setPostingId] = useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateTelegramConfig({
      botToken: botToken.trim(),
      channelId: channelId.trim(),
      autoPost,
      enabled
    });
    showToast(
      '🎉 Telegram Configuration Saved!',
      'Your bot settings and channel parameters have been updated successfully.',
      'success'
    );
  };

  const handleTestConnection = async () => {
    if (!botToken.trim()) {
      showToast('Validation Error', 'Please enter a valid Telegram Bot API Token.', 'error');
      return;
    }
    if (!channelId.trim()) {
      showToast('Validation Error', 'Please enter your Telegram Channel ID or Username (e.g. @yourchannel).', 'error');
      return;
    }

    setTesting(true);
    const res = await testTelegramBot(botToken.trim(), channelId.trim());
    setTesting(false);

    if (res.success) {
      showToast(
        '🚀 Test Message Delivered!',
        `Successfully sent test verification message to ${channelId}. Check your Telegram Channel!`,
        'success'
      );
    } else {
      showToast(
        '❌ Telegram Connection Failed',
        res.error || 'Could not send message. Ensure bot is added as Administrator in the channel.',
        'error'
      );
    }
  };

  const handleManualPost = async (item: NewsMarqueeItem) => {
    if (!botToken.trim() || !channelId.trim()) {
      showToast('Configuration Missing', 'Please configure Bot Token & Channel Username first.', 'error');
      return;
    }

    setPostingId(item.id);
    const message = formatNewsTelegramMessage(item);
    const res = await sendTelegramMessage(botToken.trim(), channelId.trim(), message);
    setPostingId(null);

    if (res.success) {
      showToast(
        '📢 News Posted to Telegram!',
        `"${item.title.substring(0, 45)}..." has been broadcast to ${channelId}.`,
        'success'
      );
    } else {
      showToast(
        '❌ Telegram Dispatch Failed',
        res.error || 'Unable to post news to Telegram.',
        'error'
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-sky-950/40 to-slate-950 border border-sky-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-extrabold uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5" />
            <span>Telegram Channel Automation</span>
          </div>
          <h2 className="text-2xl font-black text-white">Telegram Broadcast Center</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Automatically post official news announcements, sports schedules, and document circulars directly to your Telegram Channel subscribers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2.5 rounded-2xl border text-xs font-black flex items-center gap-2 ${
            enabled && channelId ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            {enabled && channelId ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{enabled && channelId ? 'Active & Ready' : 'Setup Required'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Config Form & Channel Setup Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Telegram Configuration Form (7 cols) */}
        <form onSubmit={handleSaveConfig} className="lg:col-span-7 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-400" />
              <span>Bot Credentials & Settings</span>
            </h3>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-bold text-slate-400">Integration</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Bot Token Input */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              Telegram Bot API Token <span className="text-santic-red">*</span>
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="e.g. 8645351450:AAGnVU2kNW_..."
                className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Bot Token provided by Telegram&apos;s <code className="text-sky-400">@BotFather</code>.
            </p>
          </div>

          {/* Channel Username / ID */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              Channel Username or ID <span className="text-santic-red">*</span>
            </label>
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="e.g. @pczsc_official or -1001234567890"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
            />
            <p className="text-[11px] text-slate-400">
              Enter public channel username with <code className="text-sky-400">@</code> prefix (e.g. <code className="text-sky-400">@pczscnews</code>) or private channel numeric ID.
            </p>
          </div>

          {/* Auto-Post Switch */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Post When News Published</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Automatically send a post to Telegram whenever a new item or circular is added to the home page marquee.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoPost}
                onChange={(e) => setAutoPost(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-sky-500/30 text-sky-400 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{testing ? 'Testing...' : 'Test Connection ⚡'}</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
            >
              Save Telegram Settings
            </button>
          </div>
        </form>

        {/* Right Column: Setup Instructions Guide (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 shadow-xl">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>3-Step Quick Setup Guide</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-extrabold text-[10px]">
                STEP 1
              </span>
              <p className="font-bold text-white">Create or Open your Telegram Channel</p>
              <p className="text-slate-400 text-[11px]">
                Create a new Channel in Telegram (e.g., <strong className="text-slate-200">PCZSC Official News</strong>) and set a public link like <code className="text-sky-400">@pczscnews</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-extrabold text-[10px]">
                STEP 2
              </span>
              <p className="font-bold text-white">Add Bot as Channel Administrator</p>
              <p className="text-slate-400 text-[11px]">
                In your Telegram Channel settings, go to <strong className="text-slate-200">Administrators</strong> → <strong className="text-slate-200">Add Admin</strong>, search for your bot (<code className="text-sky-400">@pczscnewsbot</code>), and allow <strong>Post Messages</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-extrabold text-[10px]">
                STEP 3
              </span>
              <p className="font-bold text-white">Enter Channel ID & Test</p>
              <p className="text-slate-400 text-[11px]">
                Enter your Channel Username (e.g. <code className="text-sky-400">@yourchannel</code>) in the field on the left and click <strong>Test Connection ⚡</strong>!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Broadcast Section: List of News Items with One-Click Post Button */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-400" />
              <span>Broadcast Published News to Telegram Channel</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Send to Telegram 🚀&quot; next to any active news marquee item to immediately broadcast it to subscribers.
            </p>
          </div>
        </div>

        {newsMarquee.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs font-bold">
            No news items currently active on the marquee. Add news items in News Marquee tab or feature circulars from Documents.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {newsMarquee.map((item) => {
              const isPostingThis = postingId === item.id;
              return (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-extrabold uppercase">
                        {item.tag || 'Announcement'}
                      </span>
                      {item.date && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.date}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-sky-400 hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        <span>{item.link}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleManualPost(item)}
                    disabled={isPostingThis}
                    className="px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 hover:text-sky-300 text-xs font-extrabold flex items-center gap-2 transition-all hover:scale-105 shrink-0"
                  >
                    {isPostingThis ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{isPostingThis ? 'Posting...' : 'Send to Telegram 🚀'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
