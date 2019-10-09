import { ComponentManager, ExtractManagerType } from './ComponentManager'

/**
 * Possible types for names of components.
 */
export type componentName = string | number

/**
 * Map of managers to their respective manager types.
 */
export type ComponentManagerMap<T> = T extends Record<
    componentName,
    ComponentManager<unknown>
>
    ? T
    : never

/**
 * Extract the underlying ComponentMap from a ComponentManagerMap type.
 */
export type ExtractComponentMap<T> = T extends ComponentManagerMap<T>
    ? {
          [key in keyof T]: ExtractManagerType<T[key]>
      }
    : never

/**
 * Basic type for a componentName => type Record.
 */
export type ComponentMap = Record<componentName, unknown>

/**
 * Map containing a subset of the total properties.
 */
export type ComponentSubMap<
    T extends ComponentMap,
    L extends ReadonlyArray<keyof T>
> = {
    [key in L[number]]: T[key]
}
