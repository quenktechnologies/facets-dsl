import * as ast from '../../ast';
import { Value } from '@quenk/noni/lib/data/json';
import { Term, FilterInfo, FilterTermConstructor } from '../term';
import { Context } from './';
/**
 * Operator
 */
export declare type Operator = string;
/**
 * Policies used during compilation.
 */
export interface Policies<F> {
    [key: string]: Policy<F>;
}
/**
 * Policy sets out the rules applied to filters that have been parsed.
 */
export interface Policy<F> {
    /**
     * type indicates what JS type the value should be.
     *
     * If the value does not match the type it is rejected.
     */
    type: string;
    /**
     * operators is a list of operators allowed.
     * The first is used as the default when 'default' is specified.
     */
    operators: Operator[];
    /**
     * term provides a function for constructing the field's term.
     */
    term: FilterTermConstructor<F>;
}
/**
 * maxFilterExceededErr indicates the maximum amount of filters allowed
 * has been surpassed.
 */
export declare const maxFilterExceededErr: (n: number, max: number) => {
    n: number;
    max: number;
    message: string;
};
/**
 * invalidFilterOperatorErr indicates an invalid operator was supplied.
 */
export declare const invalidFilterOperatorErr: <V>({ field, operator, value }: FilterInfo<V>) => {
    field: string;
    operator: string;
    value: V;
    message: string;
};
/**
 * invalidFilterTypeErr indicates the value used with the
 * filter is the incorrect type.
 */
export declare const invalidFilterTypeErr: <V>({ field, operator, value }: FilterInfo<V>, typ: string) => {
    field: string;
    operator: string;
    value: V;
    message: string;
};
/**
 * toNative converts a parsed value into a JS native value.
 */
export declare const toNative: (v: ast.Value) => Value;
/**
 * apply a policy to a filter.
 *
 * This function will produce a Term for the filter or an error if any occurs.
 */
export declare const apply: <F>(ctx: Context<F>, p: Policy<F>, n: ast.Filter) => import("@quenk/noni/lib/data/either").Either<import("@quenk/noni/lib/control/error").Err, Term<F>>;