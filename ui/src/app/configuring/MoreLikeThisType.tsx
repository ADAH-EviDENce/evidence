type EnumLiteralsOf<T extends object> = T[keyof T]

export type MoreLikeThisType = EnumLiteralsOf<typeof MoreLikeThisType>

export const MoreLikeThisType = Object.freeze({
    ES: 'elastic' as 'es',
    DOC2VEC: 'doc2vec' as 'doc2vec',
    NONE: 'no_type' as 'no_type'
});

export function fromVal(val: string) : MoreLikeThisType {
    switch (val) {
        case MoreLikeThisType.ES:
            return MoreLikeThisType.ES;
        case MoreLikeThisType.DOC2VEC:
            return MoreLikeThisType.DOC2VEC;
        default:
            return MoreLikeThisType.NONE
    }
}