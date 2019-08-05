const states = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
};

$$.asset.describe("Site", {
    public: {
        alias: "string",
        uid: "string:alias",
        owner: "string",
        values:"string",
        time: "string",
        state: "string"
    },
    init: function(uid, time, owner){
        if(!!this.owner){
            return false;
        }

        this.uid = uid;
        this.alias = uid;
        this.time = time;
        this.owner = owner;
        this.values = "";
        this.user = "";
        this.state = states.ACTIVE;

        return true;
    },
    valid: function(){
        return !!this.state;
    },
    active: function(){
        return this.state === states.ACTIVE;
    },
    getOwner: function(){
        return this.owner;
    },
    setOwner: function(newOwner){
        this.owner = newOwner;
        //console.log("Site.js - owner updated!!!");
        return true;
    },
    getTime: function(){
        return this.time;
    },
    getValues: function(){
        return this.values;
    },
    setValues: function(newValues){
        this.values = newValues;
        return true;
    }
});
