import type { Attr, IOptions } from './types';
interface MaybeDoc {
    type?: string;
    text?: string;
    content?: string;
    voidElement?: boolean;
    name?: string;
    style?: string[];
    attrs?: Attr;
    children?: MaybeDoc[];
    comment?: string;
}
export declare const parse: (html: string, options?: Partial<IOptions>) => MaybeDoc[];
export {};
