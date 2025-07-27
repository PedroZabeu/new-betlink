# BetLink Logging System Guide

## Overview
The BetLink logging system provides structured, consistent logging across the entire application with support for different log levels and audit trails.

## Import
```typescript
import { logger } from '@/lib/utils/logger';
```

## Log Levels

### 1. Debug
Use for detailed debugging information during development:
```typescript
logger.debug('Component mounted', { componentName: 'UserDashboard' });
```

### 2. Info
Use for general informational messages:
```typescript
logger.info('User logged in successfully', { userId: user.id });
```

### 3. Warning
Use for warning conditions that aren't errors:
```typescript
logger.warn('API rate limit approaching', { remaining: 10 });
```

### 4. Error
Use for error conditions with full error objects:
```typescript
try {
  await someOperation();
} catch (error) {
  logger.error('Failed to complete operation', error as Error, {
    userId: user.id,
    operation: 'someOperation'
  });
}
```

### 5. Audit
Use for security-relevant actions that need tracking:
```typescript
logger.audit(userId, 'create', 'channel', { channelId, channelName });
logger.audit(userId, 'update', 'profile', { changes: diff });
logger.audit(userId, 'delete', 'subscription', { subscriptionId });
```

## Common Usage Patterns

### Authentication Events
```typescript
// Login
logger.audit(user.id, 'auth.login', 'session', { 
  ip: request.ip,
  userAgent: request.headers['user-agent']
});

// Logout
logger.audit(user.id, 'auth.logout', 'session');

// Failed login
logger.warn('Failed login attempt', {
  email: attemptedEmail,
  ip: request.ip
});
```

### API Operations
```typescript
// API request
logger.info('API request', {
  method: request.method,
  path: request.url,
  userId: user?.id
});

// API error
logger.error('API request failed', error, {
  method: request.method,
  path: request.url,
  statusCode: response.status
});
```

### Database Operations
```typescript
// Successful query
logger.debug('Database query executed', {
  table: 'channels',
  operation: 'select',
  duration: endTime - startTime
});

// Failed query
logger.error('Database query failed', error, {
  table: 'channels',
  operation: 'insert',
  data: sanitizedData
});
```

### Payment Events
```typescript
// Payment success
logger.audit(userId, 'payment.success', 'subscription', {
  amount,
  currency,
  paymentMethod,
  subscriptionId
});

// Payment failure
logger.error('Payment processing failed', error, {
  userId,
  amount,
  errorCode: error.code
});
```

## Feature-Scoped Logging
When working on a specific feature, use a consistent prefix:
```typescript
const FEATURE = '[Feature: ChannelDiscovery]';

logger.info(`${FEATURE} Loading channels`, { page, filters });
logger.error(`${FEATURE} Failed to load channels`, error, { page });
```

## Environment Behavior

### Development
- All log levels are output to console
- Formatted for readability
- Includes full stack traces

### Production
- Debug logs are suppressed
- Logs are JSON formatted for parsing
- Ready for integration with external services
- Audit logs will be stored in database

## Best Practices

1. **Always log errors with context**:
```typescript
// ❌ Bad
console.error(error);

// ✅ Good
logger.error('Failed to create channel', error, {
  userId: user.id,
  channelData: { name, description }
});
```

2. **Use appropriate log levels**:
```typescript
// ❌ Bad - using info for errors
logger.info('Error occurred', { error: error.message });

// ✅ Good
logger.error('Operation failed', error, context);
```

3. **Include relevant context**:
```typescript
// ❌ Bad - no context
logger.info('Subscription created');

// ✅ Good
logger.info('Subscription created', {
  userId,
  channelId,
  planType,
  amount
});
```

4. **Sanitize sensitive data**:
```typescript
// ❌ Bad - logging passwords
logger.info('User registration', { email, password });

// ✅ Good
logger.info('User registration', { email });
```

## Future Enhancements

The logging system is designed to be extended with:
- External logging service integration (Sentry, DataDog, etc.)
- Audit log database table
- Log aggregation and analysis
- Performance metrics tracking
- Real-time alerting

## Migration from Console.log

To migrate existing console.log statements:

1. **Simple logs**:
```typescript
// Before
console.log('User logged in');

// After
logger.info('User logged in');
```

2. **Error logs**:
```typescript
// Before
console.error('Error:', error);

// After
logger.error('Operation failed', error, { context });
```

3. **Debug logs**:
```typescript
// Before
console.log('Debug:', data);

// After
logger.debug('Debug information', { data });
```