export interface Dictionary<T> {
    [key: string]: T
}

export type EnumDictionaryStrict<T extends string | symbol | number, U> = {
    [K in T]: U
}

export type EnumDictionary<T extends string | symbol | number, U> = {
    [K in T]?: U
}