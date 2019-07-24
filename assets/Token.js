$$.asset.describe("Token", {
    public: {
        alias: "string:alias",
        name: "",
        emitter: "string",
        supply: "number"
    },
    prepareToEmit: function(name, symbol){
        if(!!this.emitter){
            return false;
        }

        this.name = name;
        this.alias = symbol;
        return true;
    },
    emit:function(supply, emitter){
        if(!!this.supply){
            return false;
        }

        this.emitter = emitter;
        this.supply = supply;
        return true;
    },
    totalSupply: function(){
        return this.supply;
    }
});
