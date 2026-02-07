import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error({
      error: exception.message,
      detail: exception.getResponse(),
      request: request.url,
      time: new Date().toLocaleString(),
    });

    response.status(status).json({
      error: exception.message,
      detail: exception.getResponse(),
      request: request.url,
    });
  }
}
