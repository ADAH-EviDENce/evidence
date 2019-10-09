import {MoreLikeThisType} from "./app/configuring/MoreLikeThisType";

const prod = {
    HOST: process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : 'http://localhost:8080',
    MORE_LIKE_THIS_SIZE: 10,
    SEARCH_RESULTS_SIZE: 10,
    POSITIVE_SIZE: 10,
    USE_ROCCHIO: true,
    DEFAULT_USER: ""
};

const dev = {
    HOST:  'http://localhost:3000',
    MORE_LIKE_THIS_SIZE: 3,
    SEARCH_RESULTS_SIZE: 3,
    POSITIVE_SIZE: 3,
    USE_ROCCHIO: true,
    DEFAULT_USER: "henk"
};

const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;

export default {

    // Common config values:
    MORE_LIKE_THIS_TYPE: MoreLikeThisType.DOC2VEC,
    BASENAME: '/ui',
    ES_HOST: config.HOST + '/es',
    ES_ROCCHIO_HOST: config.HOST + '/rocchio',
    ASSESS_HOST: config.HOST + '/assess',
    USERS_HOST: config.HOST + '/users',
    EXPORT_HOST: config.HOST + '/export',
    PURGE_HOST: config.HOST + '/purge',
    SEED_HOST: config.HOST + '/seed',
    POSITIVE_HOST: config.HOST + '/positive',

    ...config
};
