import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.supabase.auth.getSession().then((res) => {
    if (res.data.session) {
      return true;
    } else {
      return router.parseUrl('/login');
    }
  });
};
