$$.transaction.describe("siteManagement", {
    create: function (timestamp, owner) {
        let transaction = $$.blockchain.beginTransaction({});
        let uid = $$.uidGenerator.safe_uuid();
        let site = transaction.lookup('measurement_example.Site', uid);

        site.init(uid, timestamp, owner);
        console.log(owner, timestamp);

        try{
            transaction.add(site);
            $$.blockchain.commit(transaction);
        }catch(err){
            this.return("Site creation failed!");
            return;
        }
        this.return(null, uid);
    },
    close: function(siteId){
        let transaction = $$.blockchain.beginTransaction({});

        let site = transaction.lookup('measurement_example.Site', siteId);

        if(!site.valid()){
            this.return("Invalid site");
            return;
        }

        if(!site.active()){
            this.return("Site is not active.");
            return;
        }

        if(site.balance() > 0){
            this.return("Site balance to high.");
            return;
        }

        if(!site.close()){
            this.return("Site closing procedure failed.");
            return;
        }

        try{
            transaction.add(site);
            $$.blockchain.commit(transaction);
        }catch(err){
            this.return("Site closing procedure failed.");
            return;
        }

        this.return(null, siteId);
    },
    existingSite: function(siteId){
        let transaction = $$.blockchain.beginTransaction({});
        let site = transaction.lookup('measurement_example.Site', siteId);

        if(!site.valid()){
            this.return("Invalid site");
            return;
        }

        if(!site.active()){
            this.return("Site is not active.");
            return;
        }
        else{
           // console.log("Site (siteManager):",site.getOwner());
            var siteDetail = {};
            siteDetail['owner'] = site.getOwner();
            siteDetail['time'] = site.getTime();
            console.log("Site (siteManager):",JSON.stringify(siteDetail));
            this.return(null, siteDetail);
        }
    },
    updateSiteProperty: function(siteId, property, value){
        let transaction = $$.blockchain.beginTransaction({});
        let site = transaction.lookup('measurement_example.Site', siteId);

        if(!site.valid()){
            this.return("Invalid site");
            return;
        }

        if(!site.active()){
            this.return("Site is not active.");
            return;
        }
        else{
            // console.log("Site (siteManager):",site.getOwner());
            console.log("Owner updated!!!")
            if(site.setOwner(value)) {
                console.log(site.getOwner());
            }
            try{
                transaction.add(site);
                $$.blockchain.commit(transaction);
            }catch(err){
                this.return("Site creation failed!");
                return;
            }
            this.return (null, value);
        }
    },
    printSiteValues: function(siteId){
        let transaction = $$.blockchain.beginTransaction({});
        let site = transaction.lookup('measurement_example.Site', siteId);

        if(!site.valid()){
            this.return("Invalid site");
            return;
        }

        if(!site.active()){
            this.return("Site is not active.");
            return;
        }
        else{
            console.log("Site Values (siteManager):",site.getValues());
            let val = site.getValues();
            this.return(null, val);
        }
    },
    updateSiteValues: function(siteId, value){
        let transaction = $$.blockchain.beginTransaction({});
        let site = transaction.lookup('measurement_example.Site', siteId);

        if(!site.valid()){
            this.return("Invalid site");
            return;
        }

        if(!site.active()){
            this.return("Site is not active.");
            return;
        }
        else{
            console.log("Values updated!!!")
            if(site.setValues(value)) {
                console.log(site.getValues());
            }
            try{
                transaction.add(site);
                $$.blockchain.commit(transaction);

            }catch(err){
                this.return("Site creation failed!");
                return;
            }
            this.return (null, value);
        }
    }
});