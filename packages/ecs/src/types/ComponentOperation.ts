import { componentOperations } from '../constants/componentOperations'

export type ComponentOperation<T> =
    | {
          type: componentOperations.add | componentOperations.change
          component: T
          id: number
      }
    | {
          type: componentOperations.remove
          id: number
      }
