$$.transaction.describe("tokenManagement", {
    emit: function (name, symbol, supply, owner) {
        let transaction = $$.blockchain.beginTransaction({});
        let uid = $$.uidGenerator.safe_uuid();
        let newToken = transaction.lookup('token_example.Token', symbol);

        if(!newToken.prepareToEmit(name, symbol)){
            this.return("Token already exists.");
            return;
        }

        if(!newToken.emit(supply, owner)){
            this.return("Token issue failed.");
            return;
        }

        let account = transaction.lookup('token_example.Account', owner);
        if(!account.valid() || !account.active()){
            this.return("Receving account not valid or not active "+account.valid()+" "+account.active());
            return;
        }

        account.receive(newToken.totalSupply());

        try{
            transaction.add(newToken);
            transaction.add(account);
            $$.blockchain.commit(transaction);
        }catch(err){
            this.return("Token issue commit failed. ");
            return;
        }

        this.return(null, symbol);
    }
});