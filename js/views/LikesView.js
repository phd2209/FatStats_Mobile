templates.LikesView = "js/views/LikesView.html";

window.LikesView = Backbone.View.extend({

    template: undefined,
    backLabel: "Back",
    title: "Likes in category",

    initialize: function (options) {

        this.template = _.template(templates.LikesView),
        this.render();
        this.view = this.$el;
    },

    events: {
    },

    render: function (eventName) {
        var model = this.model;
        this.$el.html(this.template({ Likes: this.model }));
        this.$el.css("background", "white");
    }
});