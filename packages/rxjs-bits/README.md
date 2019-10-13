# `rxjs-bits`

> Rxjs integration for the @reix/bits package.

## Installation

```sh
npm i @reix/rxjs-bits
```

This package requires both `rxjs` and `@reix/bits` as peer dependencies.

## Usage

### Example

```ts
import { toSubjects } from '@reix/rxjs-bits'
import { BitFieldEmitter } from '@reix/bits'

const myEventCode = 2

const emitter = new BitFieldEmitter<number>()
const { on$, emit$, dispose } = toSubjects(emitter, myEventCode)

on$.subscribe(({ value, code }) => {
    console.log(`Fired with value ${value} and code ${code}`)
})

emitter.emit(myEventCode, 2) // Fired with value 7 and code 2

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
