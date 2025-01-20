import { eq, and, asc, desc, gt, gte, sql } from 'drizzle-orm';
import { db } from './';
import { user, subscription } from './schema';

type SortDirection = 'asc' | 'desc';
type UserSortField = 'email' | 'name' | 'phone' | 'createdAt';
type SubscriptionSortField = 'email' | 'createdAt' | 'plan' | 'validUntil';

export async function getPaginatedUsers(
  page: number = 1, 
  limit: number = 25,
  sortField: UserSortField = 'createdAt',
  sortDirection: SortDirection = 'desc'
) {
  const offset = (page - 1) * limit;
  const orderByField = {
    email: user.email,
    name: user.name,
    phone: user.phone,
    createdAt: user.createdAt,
  }[sortField];

  const users = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      createdAt: user.createdAt,
    })
    .from(user)
    .limit(limit)
    .offset(offset)
    .orderBy(sortDirection === 'asc' ? asc(orderByField) : desc(orderByField));

  const totalUsers = await db
    .select({ count: sql<number>`count(*)` })
    .from(user);

  return {
    users,
    total: totalUsers[0].count,
    pages: Math.ceil(totalUsers[0].count / limit),
  };
}

export async function getPaginatedSubscriptions(
  page: number = 1, 
  limit: number = 25,
  sortField: SubscriptionSortField = 'createdAt',
  sortDirection: SortDirection = 'desc'
) {
  const offset = (page - 1) * limit;
  const orderByField = {
    email: user.email,
    createdAt: subscription.createdAt,
    plan: subscription.plan,
    validUntil: subscription.validUntil,
  }[sortField];

  const subscriptions = await db
    .select({
      email: user.email,
      plan: subscription.plan,
      validUntil: subscription.validUntil,
      createdAt: subscription.createdAt,
    })
    .from(subscription)
    .innerJoin(user, eq(subscription.userId, user.id))
    .limit(limit)
    .offset(offset)
    .orderBy(sortDirection === 'asc' ? asc(orderByField) : desc(orderByField));

  const totalSubscriptions = await db
    .select({ count: sql<number>`count(*)` })
    .from(subscription);

  return {
    subscriptions,
    total: totalSubscriptions[0].count,
    pages: Math.ceil(totalSubscriptions[0].count / limit),
  };
}