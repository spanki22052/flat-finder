import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './response.js';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          return { data } as ApiResponse<T>;
        }
        if (typeof data === 'object' && data !== null && 'data' in data) {
          return data as ApiResponse<T>;
        }
        return { data } as ApiResponse<T>;
      }),
    );
  }
}
