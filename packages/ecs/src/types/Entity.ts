import { EntitySchema } from './EntitySchema'

export interface Entity<T extends EntitySchema> {
    id: number
    schema: T
}
