export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};
export type Mutable<T> = {
    -readonly [Key in keyof T]: T[Key];
};

export type DateValue = string | moment.Moment | Date;
export type ToastType = "error" | "warning" | "success";
