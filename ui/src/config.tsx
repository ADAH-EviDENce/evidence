const prod = {
    ES_HOST: 'http://localhost:8080/es',
    ASSESS_HOST: 'http://localhost:8080/assess',
    SEARCH_RESULTS_SIZE: 10,
    MORE_LIKE_THIS_SIZE: 10
};

const dev = {
    ES_HOST: 'http://localhost:3000/es',
    ASSESS_HOST: 'http://localhost:3000/assess',
    SEARCH_RESULTS_SIZE: 3,
    MORE_LIKE_THIS_SIZE: 3
};

const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;

export default {
    // Common config values:
    BASENAME: '/ui',
    ...config
};