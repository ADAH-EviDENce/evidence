type EnumLiteralsOf<T extends object> = T[keyof T]

export type MoreLikeThisType = EnumLiteralsOf<typeof MoreLikeThisType>

export const MoreLikeThisType = Object.freeze({
    ES: 'es' as 'es',
    DOC2VEC: 'doc2vec' as 'doc2vec'
});