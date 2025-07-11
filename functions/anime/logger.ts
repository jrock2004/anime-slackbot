type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class Logger {
  private static formatMessage(
    level: LogLevel,
    message: string,
    meta?: object
  ): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  public static info(message: string, meta?: object): void {
    console.log(this.formatMessage('info', message, meta));
  }

  public static warn(message: string, meta?: object): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  public static error(message: string, error?: Error | object): void {
    const meta =
      error instanceof Error
        ? { error: error.message, stack: error.stack }
        : error;
    console.error(this.formatMessage('error', message, meta));
  }

  public static debug(message: string, meta?: object): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}
