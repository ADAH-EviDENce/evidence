type EnumLiteralsOf<T extends object> = T[keyof T]

export type MoreLikeThisOption = EnumLiteralsOf<typeof MoreLikeThisOption>

export const MoreLikeThisOption = Object.freeze({
    YES: 'yes' as 'yes',
    NO: 'no' as 'no',
    MAYBE: '' as ''
});