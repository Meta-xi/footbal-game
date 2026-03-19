import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { EncryptionService } from '../services/encryption.service';
import { from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const encryption = inject(EncryptionService);

  const authToken = storage.get<string>(AUTH_TOKEN_KEY);
  const userData = storage.get<{ id?: string | number; username?: string }>(USER_DATA_KEY);
  const userId = userData?.id?.toString() || '';

  let clonedReq = req.clone({
    setHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });

  if (environment.apiBaseUrl.includes(req.url)) {
    const isPostWithBody = ['POST', 'PUT', 'PATCH'].includes(req.method);

    const isRegister = req.url.includes('/Auth/register');
    if (isPostWithBody && userId && authToken && !isRegister) {
      return from(encryption.generateUniqueToken(userId)).pipe(
        switchMap(({ token, timestamp }) => {
          let body = req.body ? { ...req.body as Record<string, unknown> } : {};

          body = { ...body, token, timestamp };

          clonedReq = clonedReq.clone({ body });

          return next(clonedReq);
        })
      );
    }
  }

  return next(clonedReq);
};
