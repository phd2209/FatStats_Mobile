templates.LikesIndexView = "js/views/LikesIndexView.html";

window.LikesIndexView = Backbone.View.extend({

    template: undefined,
    backLabel: "Back",
    title: "LikesIndex",

    initialize: function (options) {

        this.template = _.template(templates.LikesIndexView),
        this.render();
        this.view = this.$el;
    },

    events: {
    },

    render: function (eventName) {
        var model = this.model;
        this.$el.html(this.template({ LikesIndex: this.model }));
        this.$el.css("background", "white");
    }
});