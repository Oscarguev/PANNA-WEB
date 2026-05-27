import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { page } from '../index'

/** Automatically fires a page_view event on every route change */
export function usePageView() {
  const { pathname } = useLocation()
  useEffect(() => {
    page(pathname)
  }, [pathname])
}
