import {MoreLikeThisType} from "./app/configuring/MoreLikeThisType";

const prod = {
    HOST: process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : 'http://localhost:8080',
    SEARCH_RESULTS_SIZE: 10,
    MORE_LIKE_THIS_SIZE: 10
};

const dev = {
    HOST:  'http://localhost:3000',
    SEARCH_RESULTS_SIZE: 3,
    MORE_LIKE_THIS_SIZE: 3
};

const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;

export default {

    // Common config values:
    MORE_LIKE_THIS_TYPE: MoreLikeThisType.DOC2VEC,
    BASENAME: '/ui',
    ES_HOST: config.HOST + '/es',
    DOC2VEC_HOST: config.HOST + '/doc2vec',
    ASSESS_HOST: config.HOST + '/assess',
    USERS_HOST: config.HOST + '/users',
    EXPORT_HOST: config.HOST + '/export',
    PURGE_HOST: config.HOST + '/purge',

    ...config
};