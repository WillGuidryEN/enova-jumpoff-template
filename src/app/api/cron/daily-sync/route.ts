import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Daily Sync Cron Job
 *
 * This cron job runs daily at 2:00 AM UTC
 * Configured in vercel.json
 *
 * Use this for:
 * - Syncing external data (YouTube videos, analytics, etc.)
 * - Cleaning up expired sessions or data
 * - Sending scheduled emails or notifications
 * - Generating daily reports
 */
export async function GET(req: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = req.headers.get('authorization');

    // In production, Vercel adds this header automatically
    // For local testing, you can skip this check or use a custom secret
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    console.log('[CRON] Daily sync started at:', new Date().toISOString());

    // Add your cron job logic here
    // Example: Sync YouTube videos, clean up old data, etc.

    // Example 1: Clean up old sessions
    // await cleanupExpiredSessions();

    // Example 2: Send daily digest emails
    // await sendDailyDigestEmails();

    // Example 3: Update analytics
    // await updateDailyAnalytics();

    console.log('[CRON] Daily sync completed successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Daily sync completed successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CRON] Daily sync failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Daily sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// You can also expose a POST method if you want to manually trigger the cron
export async function POST(req: NextRequest) {
  // Verify authorization for manual triggers
  const authHeader = req.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Call the GET method to execute the cron logic
  return GET(req);
}
