import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth  = inject(AuthService);
  const user  = auth.currentUserValue;
  const token = user?.token;

  // Solo agrega el token a requests hacia nuestro backend
  const isOwnApi = req.url.startsWith(environment.apiUrl) || req.url.startsWith('/api');

  if (token && isOwnApi) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
