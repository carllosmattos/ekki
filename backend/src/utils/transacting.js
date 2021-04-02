/**
 *  @param {import('knex').Knex.QueryBuilder} query 
 *  @param {import('knex').Knex.Transaction} trx 
 *  @returns {import('knex').Knex.QueryBuilder}
 */
const transacting = (query, trx)=>{
    if(trx){
        query.transacting(trx)
    }
    return query
}

export default transacting