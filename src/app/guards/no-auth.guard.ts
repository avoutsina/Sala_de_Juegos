import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const noAuthGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.supabase.auth.getSession().then((res) => {
    if (res.data.session) {
      return router.parseUrl('/home');
    } else {
      return true;
    }
  });
};
