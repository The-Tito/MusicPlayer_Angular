import { HttpInterceptorFn } from '@angular/common/http';
import { CookiesStorageService } from '../services/cookies-storage.service';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment.development';

export const addAuthHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const _cookieStorage: CookiesStorageService = inject(CookiesStorageService);

  if (!req.url.includes(environment.API_URL))
    return next(req);

  const token = _cookieStorage.getKeyValue('access_token');
  
  if (!token) {
    return next(req);
  }

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`)
  });

  return next(newReq);
};