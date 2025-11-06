import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/mailerlite';

export const dynamic = 'force-dynamic';

/**
 * Newsletter Subscription API Route
 *
 * POST /api/newsletter/subscribe
 * Adds a subscriber to MailerLite
 *
 * Body:
 * {
 *   email: string;
 *   name?: string;
 *   lastName?: string;
 *   groupId?: string; // Optional, defaults to env variable
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, lastName, groupId } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Get default group ID from environment if not provided
    const targetGroupId = groupId || process.env.MAILERLITE_GROUP_ID;

    if (!targetGroupId) {
      return NextResponse.json(
        { error: 'MailerLite group ID is not configured' },
        { status: 500 }
      );
    }

    // Prepare subscriber data
    const subscriberData = {
      email: email.toLowerCase().trim(),
      fields: {
        ...(name && { name }),
        ...(lastName && { last_name: lastName }),
      },
      groups: [targetGroupId],
      status: 'active' as const,
    };

    // Add subscriber to MailerLite
    const result = await addSubscriber(subscriberData);

    // Check if there was an error
    if (result.errors || result.message) {
      return NextResponse.json(
        {
          error: result.message || 'Failed to subscribe',
          details: result.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while subscribing',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
