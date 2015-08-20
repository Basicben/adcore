// data base connection configuration.
var dbconfig = {
    dev : {
        mongo: {
            url: 'mongodb://adcore:adcore@ds057862.mongolab.com:57862/adcoretest'
        }
    },
    prod: {
        mongo: {
            url: 'mongodb://adcore:adcore@ds057862.mongolab.com:57862/adcoretest'
        }
    },
    stage: {
        mongo: {
            url: 'mongodb://adcore:adcore@ds057862.mongolab.com:57862/adcoretest'
        }
    }
}

// common config
var commonConfig = {
    dev: {
        
    },
    prod: {
       
    },
    stage: {
        
    }
}

// config object
var appData = {
    version: '6.00',
    mongo_db_environment: 'dev',
    sys_environment: 'dev',
    connection: '',
    common: null,
    dbconfig: { mongo: null },
    is_db_connection: false
}

// get relevant config by environment
appData.common = commonConfig[appData.sys_environment] || commonConfig['dev'];
appData.dbconfig.mongo = dbconfig[appData.mongo_db_environment].mongo;


module.exports = appData;