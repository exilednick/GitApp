const axios = require('axios');
module.exports = {
    getRepoData : async function (access_token, org, n) {
        let i = 1;
        let forkCount = {};
        while(true) {
            const response = await axios(`https://api.github.com/orgs/${org}/repos?per_page=100&page=${i}&sort=forks`, {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            });
            if (response.data.length === 0)
                break;
            for(let j in response.data) {
                forkCount[response.data[j]['name']] = response.data[j]['forks_count'];
            }
            i++;
        }
        
        let tmp = Object.entries(forkCount)
        .sort(([,a],[,b]) => b-a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    
        result = Object.keys(tmp).slice(0, n).reduce((result, key) => {
            result[key] = tmp[key];
    
            return result;
        }, {});
        return result;
    }
}