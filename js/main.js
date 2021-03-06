var fbid;
var fetches;
var userCollection = new Array();
var categories = [];

var selectedcats = [{ category:"Musician/band", cnt:671, pct:23, sex:"Total"}, 
        { category:"Local business", cnt:487, pct:17, sex:"Total"},
		{ category:"Public figure", cnt:414, pct:14, sex:"Total"},
		{ category:"Company", cnt:260, pct:9, sex:"Total"},
		{ category:"Website", cnt:202, pct:7, sex:"Total"},
		{ category:"Tv show", cnt:201, pct:7, sex:"Total"},
		{ category:"Movie", cnt:186, pct:6, sex:"Total"},
		{ category:"Product/service", cnt:158, pct:6, sex:"Total"},
		{ category:"Actor/director", cnt:149, pct:5, sex:"Total"},
		{ category:"Food/beverages", cnt:138, pct:5, sex:"Total"},
		{ category:"Company", cnt:120, pct:4, sex:"male"},
		{ category:"Website", cnt:96, pct:3, sex:"male"},
		{ category:"Tv show", cnt:68, pct:2, sex:"male"},
		{ category:"Musician/band", cnt:276, pct:10, sex:"male"},
		{ category:"Company", cnt:139, pct:5, sex:"female"},
		{ category:"Food/beverages", cnt:76, pct:3, sex:"female"},	
		{ category:"Movie", cnt:140, pct:5, sex:"female"},
		{ category:"Public figure", cnt:255, pct:9, sex:"female"},
		{ category:"Product/service", cnt:72, pct:3, sex:"female"},
		{ category:"Musician/band", cnt:388, pct:14, sex:"female"},
		{ category:"Local business", cnt:270, pct:9, sex:"female"},
		{ category:"Tv show", cnt:131, pct:5, sex:"female"},
		{ category:"Movie", cnt:46, pct:2, sex:"male"},
		{ category:"Public figure", cnt:155, pct:5, sex:"male"},
		{ category:"Product/service", cnt:86, pct:3, sex:"male"},
		{ category:"Local business", cnt:213, pct:7, sex:"male"},
		{ category:"Actor/director", cnt:47, pct:2, sex:"male"},
		{ category:"Actor/director", cnt:102, pct:4, sex:"female"},
		{ category:"Website", cnt:104, pct:4, sex:"female"},
		{ category:"Food/beverages", cnt:62, pct:2, sex:"male"}
];

var selectedlikes = [{ id:"19691681472", name:"Michael Jackson", cnt:9, pct:39, sex:"Total"},
         { id:"12626353545", name:"Ti�sto", cnt:4, pct:17, sex:"Total"},
         { id:"52097374857", name:"Medina", cnt:4, pct:17, sex:"Total"},
         { id:"15253175252", name:"Coldplay", cnt:3, pct:13, sex:"Total"},
         { id:"5330548481", name:"Maroon 5", cnt:3, pct:13,  sex:"Total"},
         { id:"15253175252", name:"Coldplay", cnt:2, pct:9, sex:"male"},
         { id:"5330548481", name:"Maroon 5", cnt:1, pct:4, sex:"male"},
         { id:"12626353545", name:"Ti�sto", cnt:2, pct:9, sex:"female"},
         { id:"19691681472", name:"Michael Jackson", cnt:7, pct:30, sex:"female"},
         { id:"52097374857", name:"Medina", cnt:3, pct:13, sex:"male"},
         { id:"12626353545", name:"Ti�sto", cnt:2, pct:9, sex:"male"},
         { id:"52097374857", name:"Medina", cnt:1, pct:4, sex:"female"},
         { id:"19691681472", name:"Michael Jackson", cnt:2, pct:9, sex:"male"},
         { id:"15253175252", name:"Coldplay", cnt:1, pct:4, sex:"female"},
         { id:"5330548481", name:"Maroon 5", cnt:2, pct:9, sex:"female"}];


var likeindex = [{ minlikecount: 1, avglikecount: 76, youlikecount: 78, maxlikecount: 250, sex: "Total" },
                 { minlikecount: 1, avglikecount: 100, youlikecount: 78, maxlikecount: 250, sex: "female" },
                 { minlikecount: 1, avglikecount: 66, youlikecount: 78, maxlikecount: 175, sex: "male" }];

document.addEventListener("deviceready", onDeviceReady, false);

$(document).ready(function () {
    onDeviceReady();
});

$(document).on('logout', function () {
    FB.logout();
    return false;
});

$(document).on('login', function () {
    FB.login(function (response) {
    }, { scope: 'email,user_likes,user_photos,friends_likes' });
    return false;
});

function onDeviceReady() {
    //FB.init({ appId: "465374093524857", /*nativeInterface: CDV.FB,*/ useCachedDialogs: false, status: true });
    FB.init({ appId: "465374093524857", nativeInterface: CDV.FB, useCachedDialogs: false, status: true });

    FB.Event.subscribe('auth.statusChange', function (event) {
        if (event.status === 'connected') {

            // Get info about the logged in user
            FB.api('/fql', { 'q': 'SELECT uid, name, locale, friend_count FROM user WHERE uid = me()' }, function (response) {

                // check for a valid response
                if (response == "undefined" || response == null || !response || response.error) {
                    alert("error occured");
                    return;
                }

                //Create to global variables fbid and fetches (friend_count divided by 50 rounded up)
                fbid = response.data.uid;
                fetches = Math.ceil(response.data[0].friend_count / 50);
                var country = response.data[0].locale;

                for (i = 0; i < Math.ceil(response.data[0].friend_count / 50) ; i++) {
                    //Create a batch request first to get friends then to get all likes for these friends
                    //Batch requests a limited to 50 - use limit= 50 and offset = i * 50 to get all friends in batches
                    FB.api('/', 'POST', {
                        batch: [
                            { method: 'GET', name: 'get-friends', "omit_response_on_success": false, relative_url: 'me/friends?fields=id,name,locale,gender&limit=5&offset=' + i * 5 },
                            { method: 'GET', "omit_response_on_success": false, relative_url: 'likes?ids={result=get-friends:$.data.*.id}' }
                        ]
                    }, function (response) {

                        // check for a valid response
                        if (response == "undefined" || response == null || !response || response.error) {
                            alert("error occured");
                            return;
                        }

                        fetches--;

                        var body = JSON.parse(response[0].body);

                        $.each(body.data, function (i, user) {
                            var fbuser = new Object();
                            fbuser.id = user.id;
                            fbuser.name = user.name;
                            fbuser.country = user.locale;
                            fbuser.sex = user.gender;
                            userCollection.push(fbuser);
                        });

                        body = JSON.parse(response[1].body);

                        $.each(body, function (id, user) {
                            for (var i = 0; i < userCollection.length; i++) {
                                if (id === userCollection[i].id) {
                                    userCollection[i].likes = user.data;
                                    userCollection[i].likescount = user.data.length;
                                    break;
                                }
                            }
                        });

                        //Run data_fetch_all function when fetches reaches 0
                        if (fetches === 0) { data_fetch_postproc(); };
                    });
                }
            });
        } else {
            //fb.user = null; // Reset current FB user
            //fb.router.navigate("", { trigger: true });
        }
    });
    loadTemplates(appTemplatesLoaded);
}


function appTemplatesLoaded() {
    //console.log( "VIEW TEMPLATES LOADED" );    
    
    var loginView = new LoginView();
    //Setup the ViewNavigator
    window.viewNavigator = new ViewNavigator( 'body' );	
    window.viewNavigator.pushView(loginView);
    document.addEventListener("backbutton", onBackKey, false);
}

function onBackKey( event ) {
    if ( window.viewNavigator.history.length > 1 ){
        event.preventDefault();
        window.viewNavigator.popView();
        return false;
    }
    navigator.app.exitApp();
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

//Gets all data first categories, second likes for top category;
function data_fetch_all() {
    console.log("Number of users: " + userCollection.length);
    getCategories();

    console.log("Length of selectedcats: " + selectedcats.length);
    //console.log(selectedcats);
    var categoriesView = new CategoriesView();
    window.viewNavigator.pushView(categoriesView);
    //outputCategories();
    //getLikes(categories[0].category);
    //console.log("Length of selectedcats: " + selectedcats.length);
    //console.log(selectedcats);
    //outputLikes();
    //console.log("Length of likeindex: " + likeindex.length);
    //console.log(likeindex);
    //console.log("Length if selectedlikes: " + selectedlikes.length);
    //console.log(selectedlikes);
    //outputLikes();
}

//Gets the top10 categories - called from data_fetch_all;
function getCategories() {


    var totalLikes = 0;
    var sex;
    var number = 30;
    var usersWithLikes = 0;
    selectedcats.length = 0;

    for (var j = 0; j < userCollection.length; j++) {
        var obj = userCollection[j];
        totalLikes = totalLikes + obj.likescount;
        //insertLikeIndex(likeindex, userCollection[j].likescount, "Total");

        if (obj.likes != undefined | obj.likes == null) {
            usersWithLikes = (obj.likes.length > 0) ? usersWithLikes + 1 : usersWithLikes + 0;
            for (var i = 0; i < obj.likes.length; i++) {

                if (userCollection[j].likes[i].category.toLowerCase() != "community") {
                    insertCategory(categories, userCollection[j].likes[i].category, "Total");
                }
            };
        }
    };

    //console.log("Friends with Likes: " + usersWithLikes);
    //console.log("Total Likes: " + totalLikes);
    //console.log("Number of Categories: " + categories.length);

    sortByNum(categories);
    selectedcats = categories.slice(0, Math.min(categories.length, number));

    for (var j = 0; j < userCollection.length; j++) {
        var obj = userCollection[j];

        sex = obj.sex;
        //insertLikeIndex(likeindex, userCollection[j].likescount, sex);
        for (var i = 0; i < obj.likes.length; i++) {

            for (var h = 0; h < selectedcats.length; h++) {
                if (selectedcats[h].category === userCollection[j].likes[i].category && sex != undefined) {
                    insertCategory(selectedcats, userCollection[j].likes[i].category, sex);
                    break;
                }

            }
        };
    };
    CalculatePct(selectedcats);
}

//Utitlity function to calculate pct;
function CalculatePct(list) {
    var total = 0;

    for (var h = 0; h < list.length; h++) {
        total = (list[h].sex.toLowerCase() === "total") ? total + list[h].cnt : total + 0;
    }

    for (var h = 0; h < list.length; h++) {
        list[h].pct = Math.round(list[h].cnt / total * 100);
    }
}
//Utitlity function to sort an array;
function sortByNum(list) {
    list.sort(function (b, a) {
        return a.cnt - b.cnt;
    })
}

//Inserts categories into into an array;
function insertCategory(list, cat, sex) {

    for (var i = 0; i < list.length; i++) {
        if (cat === list[i].category && sex === list[i].sex) {
            list[i].cnt += 1;
            return;
        }
    }
    var obj;
    obj = { "category": cat, "cnt": 1, "sex": sex };
    list.push(obj);
}