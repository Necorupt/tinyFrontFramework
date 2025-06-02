export default function $compileProvider($provide){

    let a = 100;


    b = 300 + a;
};

$compileProvider.$inject = ['$provide'];
$compileProvider.$get = function() {

    let item = {};

    return item;
}
$compileProvider.derective = function(){

}