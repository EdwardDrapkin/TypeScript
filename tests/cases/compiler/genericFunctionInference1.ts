// @strict: true
// @target: es2015

declare function pipe<A extends any[], B>(ab: (...args: A) => B): (...args: A) => B;
declare function pipe<A extends any[], B, C>(ab: (...args: A) => B, bc: (b: B) => C): (...args: A) => C;
declare function pipe<A extends any[], B, C, D>(ab: (...args: A) => B, bc: (b: B) => C, cd: (c: C) => D): (...args: A) => D;

declare function list<T>(a: T): T[];
declare function box<V>(x: V): { value: V };
declare function foo<T extends { value: T }>(x: T): T;

const f00 = pipe(list);
const f01 = pipe(list, box);
const f02 = pipe(box, list);
const f03 = pipe(x => list(x), box);
const f04 = pipe(list, x => box(x));
const f05 = pipe(x => list(x), x => box(x))
const f06 = pipe(list, pipe(box));
const f07 = pipe(x => list(x), pipe(box));
const f08 = pipe(x => list(x), pipe(x => box(x)));
const f09 = pipe(list, x => x.length);
const f10 = pipe(foo);
const f11 = pipe(foo, foo);

const g00: <T>(x: T) => T[] = pipe(list);
const g01: <T>(x: T) => { value: T[] } = pipe(list, box);
const g02: <T>(x: T) => { value: T }[] = pipe(box, list);
const g03: <T>(x: T) => { value: T[] } = pipe(x => list(x), box);
const g04: <T>(x: T) => { value: T[] } = pipe(list, x => box(x));
const g05: <T>(x: T) => { value: T[] } = pipe(x => list(x), x => box(x))
const g06: <T>(x: T) => { value: T[] } = pipe(list, pipe(box));
const g07: <T>(x: T) => { value: T[] } = pipe(x => list(x), pipe(box));
const g08: <T>(x: T) => { value: T[] } = pipe(x => list(x), pipe(x => box(x)));
const g09: <T>(x: T) => number = pipe(list, x => x.length);
const g10: <T extends { value: T }>(x: T) => T = pipe(foo);
const g12: <T extends { value: T }>(x: T) => T = pipe(foo, foo);

declare function pipe2<A, B, C, D>(ab: (a: A) => B, cd: (c: C) => D): (a: [A, C]) => [B, D];

const f20 = pipe2(list, box);
const f21 = pipe2(box, list);
const f22 = pipe2(list, list);
const f23 = pipe2(box, box);
const f24 = pipe2(f20, f20);
const f25 = pipe2(foo, foo);
const f26 = pipe2(f25, f25);

declare function pipe3<A, B, C>(ab: (a: A) => B, ac: (a: A) => C): (a: A) => [B, C];

const f30 = pipe3(list, box);
const f31 = pipe3(box, list);
const f32 = pipe3(list, list);

declare function pipe4<A, B, C>(funcs: [(a: A) => B, (b: B) => C]): (a: A) => C;

const f40 = pipe4([list, box]);
const f41 = pipe4([box, list]);

declare function pipe5<A, B>(f: (a: A) => B): { f: (a: A) => B };

const f50 = pipe5(list);  // No higher order inference

// #417

function mirror<A, B>(f: (a: A) => B): (a: A) => B { return f; }
var identityM = mirror(identity);

var x = 1;
var y = identity(x);
var z = identityM(x);

// #3038

export function keyOf<a>(value: { key: a; }): a {
    return value.key;
}
export interface Data {
    key: number;
    value: Date;
}

var data: Data[] = [];

declare function toKeys<a>(values: a[], toKey: (value: a) => string): string[];

toKeys(data, keyOf);  // Error

// #9366

function flip<a, b, c>(f: (a: a, b: b) => c): (b: b, a: a) => c {
  return (b: b, a: a) => f(a, b);
}
function zip<T, U>(x: T, y: U): [T, U] {
  return [x, y];
}

var expected: <T, U>(y: U, x: T) => [T, U] = flip(zip);
var actual = flip(zip);

// #9366

const map = <T, U>(transform: (t: T) => U) =>
    (arr: T[]) => arr.map(transform)

const identityStr = (t: string) => t;

const arr: string[] = map(identityStr)(['a']);
const arr1: string[] = map(identity)(['a']);

// #9949

function of2<a, b>(one: a, two: b): [a, b] {
    return [one, two];
}

const flipped = flip(of2);

// #29904.1

type Component<P> = (props: P) => {};

declare const myHoc1: <P>(C: Component<P>) => Component<P>;
declare const myHoc2: <P>(C: Component<P>) => Component<P>;

declare const MyComponent1: Component<{ foo: 1 }>;

const enhance = pipe(
    myHoc1,
    myHoc2,
);

const MyComponent2 = enhance(MyComponent1);

// #29904.2

const fn20 = pipe((_a?: {}) => 1);

// #29904.3

type Fn = (n: number) => number;
const fn30: Fn = pipe(
    x => x + 1,
    x => x * 2,
);

const promise = Promise.resolve(1);
promise.then(
    pipe(
        x => x + 1,
        x => x * 2,
    ),
);

// #29904.4

declare const getString: () => string;
declare const orUndefined: (name: string) => string | undefined;
declare const identity: <T>(value: T) => T;

const fn40 = pipe(
    getString,
    string => orUndefined(string),
    identity,
);

// #29904.6

declare const getArray: () => string[];
declare const first: <T>(ts: T[]) => T;

const fn60 = pipe(
    getArray,
    x => x,
    first,
);

const fn61 = pipe(
    getArray,
    identity,
    first,
);

const fn62 = pipe(
    getArray,
    x => x,
    x => first(x),
);
