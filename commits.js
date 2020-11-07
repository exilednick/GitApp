const axios = require('axios');
module.exports = {
    getCommitData: async function(access_token, org, repo, m) {
        let i = 1;
        let limit = parseInt(m/100) + 1;
        let contributionsCount = {};
        while(i <= limit) {
            const response = await axios(`https://api.github.com/repos/${org}/${repo}/contributors?per_page=100&page=${i}`, {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            });
            if(response.data.length === 0)
                break;
            for(let j in response.data) {
                contributionsCount[response.data[j]['login']] = response.data[j]['contributions'];
            }
            i++;
        }
        result = Object.keys(contributionsCount).slice(0, m).reduce((result, key) => {
            result[key] = contributionsCount[key];
            return result;
        }, {});
        return result;
    }
}