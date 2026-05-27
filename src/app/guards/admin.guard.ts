import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const { data: sessionData } = await auth.supabase.auth.getSession();
  if (!sessionData.session) return router.parseUrl('/login');

  const { data } = await auth.supabase
    .from('usuarios')
    .select('is_admin')
    .eq('id', sessionData.session.user.id)
    .single();

  return data?.is_admin ? true : router.parseUrl('/home');
};
