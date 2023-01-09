exports.getdate=function (){

var today=new Date();
var options={
    weekday:"long",
    day:"numeric",
    month:"long"
};
var d=today.toLocaleDateString("en-US",options);
return d;
};

exports.getday=function(){
    var today=new Date();
    var options={
        weekday:"long"
    };
    var d=today.toLocaleDateString("en-US",options);
    return d;
}