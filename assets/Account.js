const states = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
};

$$.asset.describe("Account", {
    public: {
        alias: "string",
        uid: "string:alias",
        owner: "string",
        amount: "number",
        symbol: "string",
        state: "string"
    },
    init: function(uid, symbol, owner){
        if(!!this.owner){
            return false;
        }

        this.uid = uid;
        this.alias = uid;
        this.symbol = symbol;
        this.owner = owner;
        this.amount = 0;
        this.state = states.ACTIVE;

        return true;
    },
    transfer: function(tokens){
        if(this.state !== states.ACTIVE){
            return false;
        }

        if(tokens > amount && tokens < 0){
            return false;
        }

        this.amount -= tokens;
        return true;
    },
    receive: function(tokens){
        if(this.state !== states.ACTIVE){
            return false;
        }

        if(tokens < 0){
            return false;
        }
        this.amount += tokens;
        return true;
    },
    valid: function(){
        return !!this.state;
    },
    active: function(){
        return this.state === states.ACTIVE;
    },
    close: function(){
        if(this.amount > 0){
            return false;
        }

        if(this.state != states.ACTIVE){
            return false;
        }

        this.state = states.INACTIVE;
        return true;
    },
    balance: function(){
        return this.amount;
    },
    getSymbol: function(){
        return this.symbol;
    }
});
