# `rxjs-bits`

> Rxjs integration for the @reix/bits package.

## Usage

This package requires both `rxjs` and `@reix/bits` as peer dependencies.

```ts
import { toSubjects } from '@reix/rxjs-bits'
import { BitFieldEmitter } from '@reix/bits'

const myEventCode = 2

const emitter = new BitFieldEmitter<number>()
const { on$, emit$, dispose } = toSubjects(emitter, myEventCode)

on$.subscribe(({ value, code }) => {
    console.log(`Fired with value ${value} and code ${code}`)
})

emitter.emit(myEventCode, 7) // Fired with value 7 and code 2

emit$.next({
    value: 7
}) // Fired with value 7 and code 2

emit$.next({
    value: 7,
    code: myEventCode | 4
}) // Fired with value 7 and code 6

// do cleanup
dispose()
```
