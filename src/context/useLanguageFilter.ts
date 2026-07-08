import { useContext } from 'react'
import {
  LanguageFilterContext,
  type LanguageFilterValue,
} from './languageFilterContext'

export function useLanguageFilter(): LanguageFilterValue {
  const ctx = useContext(LanguageFilterContext)
  if (!ctx) {
    throw new Error(
      'useLanguageFilter must be used within a LanguageFilterProvider',
    )
  }
  return ctx
}
