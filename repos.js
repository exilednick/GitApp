const {graphql} = require('@octokit/graphql');
module.exports = {
    getRepoData : async function(access_token, org, n) {
        let after = "";
        let forks = {};
        let total, cursor;
        while(true) {
            try {
                const response = await graphql(`{
                    organization(login: "${org}") {
                        repositories(first:100 ${after}) {
                            edges {
                                node {
                                    name,
                                    forkCount
                                }
                                cursor
                            }
                        }
                    }
                }`,
                {
                    headers : {
                        Authorization: `bearer ${access_token}`
                    }
                });
                let tmp = response.organization.repositories.edges;
                if(tmp.length === 0)
                    break;
                for(let i = 0; i<tmp.length; i++) {
                    forks[tmp[i].node.name] = tmp[i].node.forkCount;
                    cursor = tmp[i].cursor;
                }
                cursor = cursor.slice(0, cursor.indexOf('='));
                after = `, after: "${cursor}"`;
            }
            catch(err) {
                return -1;
            }
        }

        //Sorting the forks object according to number of forks
        let tmp = Object.entries(forks)
        .sort(([,a],[,b]) => b-a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        
        //Slicing the object to get the top n repos
        result = Object.keys(tmp).slice(0, n).reduce((result, key) => {
            result[key] = tmp[key];
    
            return result;
        }, {});
        return result;
    }
}