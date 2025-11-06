/**
 * MailerLite Integration
 *
 * This module provides utilities for integrating with MailerLite's email marketing platform.
 * Use this for lead magnets, newsletter signups, and email automation.
 *
 * API Documentation: https://developers.mailerlite.com/docs
 */

const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

interface MailerLiteSubscriber {
  email: string;
  fields?: {
    name?: string;
    last_name?: string;
    [key: string]: string | undefined;
  };
  groups?: string[]; // Array of group IDs
  status?: 'active' | 'unsubscribed' | 'unconfirmed' | 'bounced' | 'junk';
  subscribed_at?: string;
  ip_address?: string;
  opted_in_at?: string;
  optin_ip?: string;
}

interface MailerLiteResponse {
  data?: {
    id: string;
    email: string;
    status: string;
    [key: string]: unknown;
  };
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Add a subscriber to MailerLite
 *
 * @param subscriber - Subscriber data
 * @returns Promise with the API response
 *
 * @example
 * ```typescript
 * const result = await addSubscriber({
 *   email: 'user@example.com',
 *   fields: { name: 'John', last_name: 'Doe' },
 *   groups: [process.env.MAILERLITE_GROUP_ID!]
 * });
 * ```
 */
export async function addSubscriber(
  subscriber: MailerLiteSubscriber
): Promise<MailerLiteResponse> {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    throw new Error('MailerLite API key is not configured');
  }

  try {
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(subscriber),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite API error:', data);
      return {
        message: data.message || 'Failed to add subscriber',
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    console.error('Error adding subscriber to MailerLite:', error);
    throw error;
  }
}

/**
 * Update an existing subscriber
 *
 * @param email - Subscriber's email address
 * @param updates - Fields to update
 * @returns Promise with the API response
 */
export async function updateSubscriber(
  email: string,
  updates: Partial<MailerLiteSubscriber>
): Promise<MailerLiteResponse> {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    throw new Error('MailerLite API key is not configured');
  }

  try {
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers/${email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite API error:', data);
      return {
        message: data.message || 'Failed to update subscriber',
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    console.error('Error updating subscriber in MailerLite:', error);
    throw error;
  }
}

/**
 * Unsubscribe a user from a group
 *
 * @param email - Subscriber's email address
 * @param groupId - Group ID to unsubscribe from
 * @returns Promise with success status
 */
export async function unsubscribeFromGroup(
  email: string,
  groupId: string
): Promise<boolean> {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    throw new Error('MailerLite API key is not configured');
  }

  try {
    const response = await fetch(
      `${MAILERLITE_API_URL}/subscribers/${email}/groups/${groupId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error unsubscribing from MailerLite group:', error);
    throw error;
  }
}

/**
 * Get subscriber information
 *
 * @param email - Subscriber's email address
 * @returns Promise with subscriber data
 */
export async function getSubscriber(email: string): Promise<MailerLiteResponse> {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    throw new Error('MailerLite API key is not configured');
  }

  try {
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers/${email}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite API error:', data);
      return {
        message: data.message || 'Failed to get subscriber',
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting subscriber from MailerLite:', error);
    throw error;
  }
}
