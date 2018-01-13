/// <reference path="../src/Parser.d.ts" />
import * as ast from './ast';
import { Either } from 'afpl/lib/monad/Either';
/**
 * defaultOptions
 */
export declare const defaultOptions: {
    maxFilters: number;
};
/**
 * Context represents the context the compilation
 * takes place in.
 *
 * It specifies the options and functions required to complete
 * the transformation process.
 *
 */
export interface Context<F> {
    /**
     * options for compilation.
     */
    options: Options;
    /**
     * empty function for empty strings.
     */
    empty: EmptyProvider<F>;
    /**
     * and function used to construct an 'and' unit.
     */
    and: AndProvider<F>;
    /**
     * or function used to construct an 'or' unit.
     */
    or: OrProvider<F>;
    /**
     * policies that can be defined via strings.
     * each field allowed.
     */
    policies: PolicyMap<F>;
}
/**
 * PolicyMap maps a string to a policy.
 */
export interface PolicyMap<F> {
    [key: string]: Policy<F>;
}
/**
 * Policies used during compilation.
 */
export interface Policies<F> {
    [key: string]: PolicySpec<F>;
}
/**
 * PolicySpec
 */
export declare type PolicySpec<F> = string | Policy<F>;
/**
 * Policy provides information relating to how a filter should
 * be treated after parsing.
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
    term: TermProvider<F>;
}
/**
 * Operator for the filter condition.
 */
export declare type Operator = string;
/**
 * Source text for parsing and compilation.
 */
export declare type Source = string;
/**
 * Options used during the compilation process.
 */
export interface Options {
    [key: string]: any;
    /**
     * maxFilters allowed to specified in the source.
     */
    maxFilters?: number;
}
/**
 * TermProvider provides the unit used to compile a filter.
 */
export declare type TermProvider<F> = (c: Context<F>) => (filter: FilterSpec<any>) => Term<F>;
/**
 * FilterSpec holds information about a Filter being processed.
 */
export interface FilterSpec<V> {
    field: string;
    operator: string;
    value: V;
}
/**
 * EmptyProvider provides the empty unit.
 */
export declare type EmptyProvider<F> = () => Term<F>;
/**
 * AndProvider provides the unit for compiling 'and' expressions.
 */
export declare type AndProvider<F> = (c: Context<F>) => (left: Term<F>) => (right: Term<F>) => Term<F>;
/**
 * OrProvider provides the unit for compiling 'or' expressions.
 */
export declare type OrProvider<F> = (c: Context<F>) => (left: Term<F>) => (right: Term<F>) => Term<F>;
/**
 * Term is a chain of verticies that ultimately form the filter to be
 * used in the application.
 */
export interface Term<F> {
    /**
     * compile this Term returning it's native filter representation.
     */
    compile(): Either<Err, F>;
}
/**
 * Err indicates something went wrong.
 */
export interface Err {
    /**
     * message of the error.
     */
    message: string;
}
/**
 * FilterErr
 */
export interface FilterErr<V> extends Err {
    /**
     * field the filter applies to.
     */
    field: string;
    /**
     * operator used.
     */
    operator: string;
    /**
     * value used.
     */
    value: V;
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
 * invalidFilterFieldErr invalid indicates the filter supplied is not supported.
 */
export declare const invalidFilterFieldErr: <V>({field, operator, value}: FilterSpec<V>) => {
    field: string;
    operator: string;
    value: V;
    message: string;
};
/**
 * invalidFilterOperatorErr indicates an invalid operator was supplied.
 */
export declare const invalidFilterOperatorErr: <V>({field, operator, value}: FilterSpec<V>) => {
    field: string;
    operator: string;
    value: V;
    message: string;
};
/**
 * invalidFilterTypeErr indicates the value used with the filter is the incorrect type.
 */
export declare const invalidFilterTypeErr: <V>({field, operator, value}: FilterSpec<V>, typ: string) => {
    field: string;
    operator: string;
    value: V;
    message: string;
};
/**
 * count the number of filters in the AST.
 */
export declare const count: (n: ast.Node) => number;
/**
 * ensureFilterLimit prevents abuse via excessively long queries.
 */
export declare const ensureFilterLimit: (n: ast.Condition, max: number) => Either<Err, ast.Condition>;
/**
 * value2JS converts a parseed value node into a JS value.
 */
export declare const value2JS: <J>(v: ast.Value) => J;
/**
 * parse a string turning it into an Abstract Syntax Tree.
 */
export declare const parse: (ast: ast.Nodes) => (source: string) => Either<Err, ast.Conditions>;
export declare const parse$: (source: string) => Either<Err, ast.Conditions>;
/**
 * ast2Terms converts an AST into a graph of verticies starting at the root node.
 */
export declare const ast2Terms: <F>(ctx: Context<F>) => (policies: Policies<F>) => (n: ast.Node) => Either<Err, Term<F>>;
/**
 * convert source text to a Term.
 */
export declare const convert: <F>(ctx: Context<F>) => (policies: Policies<F>) => (source: string) => Either<Err, Term<F>>;
/**
 * compile a string into a usable string of filters.
 */
export declare const compile: <F>(ctx: Context<F>) => (policies: Policies<F>) => (source: string) => Either<Err, F>;