/**
 * Structured logging system for BetLink
 * Provides consistent logging across the application
 * 
 * IMPORTANTE: Use sempre este logger no lugar de console.log/error/warn
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'audit';

interface LogContext {
  userId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isServer = typeof window === 'undefined';

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, error } = entry;
    
    // Format context for better readability
    let contextStr = '';
    if (context) {
      const { timestamp: _, ...restContext } = context; // Remove duplicate timestamp
      if (Object.keys(restContext).length > 0) {
        contextStr = ` | Context: ${JSON.stringify(restContext)}`;
      }
    }
    
    const errorStr = error ? `\n  Error: ${error.message}\n  Stack: ${error.stack}` : '';
    
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}${errorStr}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    // Adiciona timestamp ao contexto se não existir
    const enrichedContext = {
      ...context,
      timestamp: context?.timestamp || new Date().toISOString(),
    };

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: enrichedContext,
      error,
    };

    // Skip debug logs in production
    if (!this.isDevelopment && level === 'debug') {
      return;
    }

    // In development, use console methods with formatting
    if (this.isDevelopment) {
      const formatted = this.formatLog(entry);
      
      switch (level) {
        case 'error':
          console.error(formatted);
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'debug':
          console.debug(formatted);
          break;
        case 'audit':
          console.log(`🔒 ${formatted}`);
          break;
        default:
          console.log(formatted);
      }
    } else {
      // In production, use structured JSON logging
      if (level !== 'debug') {
        console.log(JSON.stringify(entry));
      }
    }

    // Store audit logs in database (future implementation)
    if (level === 'audit' && this.isServer) {
      this.storeAuditLog(entry);
    }
  }

  private async storeAuditLog(entry: LogEntry) {
    // TODO: Store in audit_logs table when implemented
    // For now, ensure audit logs are properly formatted
    if (!this.isDevelopment) {
      // In production, audit logs should be specially marked
      console.log(JSON.stringify({ ...entry, type: 'AUDIT_LOG' }));
    }
  }

  debug(message: string, data?: any) {
    const context: LogContext = typeof data === 'object' ? data : { data };
    this.log('debug', message, context);
  }

  info(message: string, data?: any) {
    const context: LogContext = typeof data === 'object' ? data : { data };
    this.log('info', message, context);
  }

  warn(message: string, data?: any) {
    const context: LogContext = typeof data === 'object' ? data : { data };
    this.log('warn', message, context);
  }

  error(message: string, error: Error | unknown, data?: any) {
    const context: LogContext = typeof data === 'object' ? data : { data };
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log('error', message, context, errorObj);
  }

  audit(userId: string, event: string, entity: string, data?: any) {
    const context: LogContext = {
      userId,
      event,
      entity,
      ...(typeof data === 'object' ? data : { data }),
    };
    this.log('audit', `User ${userId} performed ${event} on ${entity}`, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogLevel, LogContext, LogEntry };