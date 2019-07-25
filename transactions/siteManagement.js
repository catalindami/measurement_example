$$.transaction.describe("siteManagement", {
    create: function (symbol, owner) {
        let transaction = $$.blockchain.beginTransaction({});
        let uid = $$.uidGenerator.safe_uuid();
        let site = transaction.lookup('measurement_example.Site', uid);

        site.init(uid, symbol, owner);
        console.log(owner);

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
    transfer: function(tokens, symbol, from, to){
        let transaction = $$.blockchain.beginTransaction({});

        let sourceAccount = transaction.lookup('measurement_example.Site', from);
        if(from.getSymbol() !== symbol || !from.transfer(tokens)){
            this.return("Transfer failed!");
            return;
        }

        let targetAccount = transaction.lookup('measurement_example.Site', to);
        if(to.getSymbol() !== symbol || !to.receive(tokens)){
            this.return("Transfer failed");
            return;
        }

        try{
            transaction.add(to);
            transaction.add(from);
            $$.blockchain.commit(transaction);
        }catch(err){
            this.return("Transfer failed!");
            return;
        }

        this.return(null, uid);
    },
    balanceOf: function(siteId){
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

        this.return(null, site.balance());
    },
    existingAccount: function(siteId){
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
            let own = site.getOwner();
            this.return(null, own);
        }
    }
});