import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const raw =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Flatten the message to always be a string (NestJS wraps it in an object)
    let message: string;
    if (typeof raw === 'string') {
      message = raw;
    } else if (raw && typeof raw === 'object') {
      const r = raw as Record<string, unknown>;
      if (Array.isArray(r.message)) {
        message = (r.message as string[]).join(', ');
      } else if (typeof r.message === 'string') {
        message = r.message;
      } else {
        message = String(r.error ?? 'An error occurred');
      }
    } else {
      message = 'An error occurred';
    }

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} → ${status}`, exception as Error);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
