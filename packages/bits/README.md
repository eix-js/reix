# `Bits`

> Bit-related utilites for the reix game engine

## Usage

### BitFieldEmitter

```ts
import { BitFieldEmitter } from '@reix/bits'

// create emitter
const emitter = new BitFieldEmitter<number>()

// each listener gets a data and a code parameter
const handler = (data: number, code: number) => console.log('fired')

emitter.on(0b011, handler)

// second param can be any number you want to pass to the handlers, i just like the digit 7:)
emitter.emit(0b001, 7) // fired
emitter.emit(0b100, 7) // nothing...
emitter.emit(0b101, 7) // fired
emitter.emit(0b110, 7) // fired
```
