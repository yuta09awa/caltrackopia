/**
 * Alert Utilities
 * Send notifications to Slack/Discord on critical errors
 */

import type { Env } from '../index';

export async function sendAlert(
  env: Env,
  message: string,
  severity: 'error' | 'warn' | 'info'
): Promise<void> {
  if (!env.SLACK_WEBHOOK_URL) {
    return; // Gracefully skip if not configured
  }

  const emoji = severity === 'error' ? '🚨' : severity === 'warn' ? '⚠️' : 'ℹ️';

  try {
    await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${emoji} **NutriMap Edge Alert**\n${message}\n_Timestamp: ${new Date().toISOString()}_`
      })
    });
  } catch (error) {
    console.error('[Alert] Failed to send alert:', error);
  }
}
