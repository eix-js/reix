/**
 * Enum with different flags contained in computation node states
 */
export const enum computationFlags {
    dead = 0b00,
    dirty = 0b01,
    active = 0b10
}
