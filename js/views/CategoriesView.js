templates.CategoriesView = "js/views/CategoriesView.html";

window.CategoriesView = Backbone.View.extend({

    destructionPolicy: 'never',
    title: "Categories",
    menuLabel: "Menu",

    initialize: function (options) {

        //this.model = options.result;
        //this.searchString = options.searchString;

        this.render();
        this.view = this.$el;
    },

    events: {
        "click li": "CategoryItemClick"
    },

    render: function (eventName) {
        var template = _.template(templates.CategoriesView);
        this.$el.css("background", "white");
        this.$el.html(template({ Categories: selectedcats }));
        var $list = this.$el.find("#list");

        var self = this;
        //var index = 1;
        _.each(selectedcats, function (category) {
            //category.__index = index;
            //poi.__svgColor = window.POIUtil.getCalculatedColor(poi);
            $list.append(new CategoryItemView({ model: category }).render().el);
            //index += 1;
        }, this);

        //this.headerActions = $("<li class='viewNavigator_header_backlink viewNavigator_backButtonPosition viewNavigator_backButton'>Menu</li>");
        //var self = this;
        //this.headerActions.on("click", function (event) {
        //    self.headerButtonClick(event);
        //})

        return this;
    },

    //showMapView: function (event) {
    //    var mapView = new MapView({ model: this.model })
    //    window.viewNavigator.pushView(mapView);
    //},

    CategoryItemClick: function (event) {
        //console.log(event);

        this.$el.find("li").removeClass("listSelected");
        var target = $(event.target)
        while (target.get(0).nodeName.toUpperCase() != "LI") {
            target = target.parent();
        }

        target.addClass("listSelected");
        var id = target.attr("id");
        //console.log(id);
        //var likes = SelectedLikes.findPointById(id, this.model.category);
        var likesView = new LikesView({ model: selectedlikes });
        window.viewNavigator.pushView(likesView);
    },
    headerButtonClick: function (event) {
        console.log("Menu Clicked");
        var leftval = pagebody.css('left');
        if (leftval == "0px") {
            openme();
        }
        else {
            closeme();
        }
    }
});