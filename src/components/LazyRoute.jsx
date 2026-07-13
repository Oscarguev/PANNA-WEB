import { Suspense } from 'react';
import PageLoader from './PageLoader';

/**
 * LazyRoute — wrapper estándar para code-split de páginas.
 * Saca el componente `Lazy` de router.jsx para que Vite Fast Refresh
 * sólo vea exports de componentes en cada archivo.
 */
export default function LazyRoute({ Page }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Page />
    </Suspense>
  );
}