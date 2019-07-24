$$.transaction.describe("accountManagement", {
    create: function (symbol, owner) {
        let transaction = $$.blockchain.beginTransaction({});
        let uid = $$.uidGenerator.safe_uuid();
        let account = transaction.lookup('measurement_example.Account', uid);

        account.init(uid, symbol, owner);

        try{
            transaction.add(account);
            $$.blockchain.commit(transaction);
        }catch(err){
            this.return("Account creation failed!");
            return;
        }
        this.return(null, uid);
    },
    close: function(accountId){
        let transaction = $$.blockchain.beginTransaction({});

        let account = transaction.lookup('token_example.Account', accountId);

        if(!account.valid()){
            this.return("Invalid account");
            return;
        }

        if(!account.active()){
            this.return("Account is not active.");
            return;
        }

        if(account.balance() > 0){
            this.return("Account balance to high.");
            return;
        }

        if(!account.close()){
            this.return("Account closing procedure failed.");
            return;
        }

        try{
            transaction.add(account);
            $$.blockchain.commit(transaction);
        }catch(err){
            this.return("Account closing procedure failed.");
            return;
        }

        this.return(null, accountId);
    },
    transfer: function(tokens, symbol, from, to){
        let transaction = $$.blockchain.beginTransaction({});

        let sourceAccount = transaction.lookup('token_example.Account', from);
        if(from.getSymbol() !== symbol || !from.transfer(tokens)){
            this.return("Transfer failed!");
            return;
        }

        let targetAccount = transaction.lookup('token_example.Account', to);
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
    balanceOf: function(accountId){
        let transaction = $$.blockchain.beginTransaction({});
        let account = transaction.lookup('token_example.Account', accountId);

        if(!account.valid()){
            this.return("Invalid account");
            return;
        }

        if(!account.active()){
            this.return("Account is not active.");
            return;
        }

        this.return(null, account.balance());
    },
    existingAccount: function(accountId){
        let transaction = $$.blockchain.beginTransaction({});
        let account = transaction.lookup('measurement_example.Account', accountId);

        if(!account.valid()){
            this.return("Invalid account");
            return;
        }

        if(!account.active()){
            this.return("Account is not active.");
            return;
        }
        else{
            this.return(null, true);
        }
    }
});