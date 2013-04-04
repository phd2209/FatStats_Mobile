templates.LoginView = "js/views/LoginView.html";

window.LoginView = Backbone.View.extend({

    title: "Welcome",

    initialize: function (options) {

        this.template = _.template(templates.LoginView),
        this.render();
        this.view = this.$el;
    },

    events: {
    },

    render: function (eventName) {
        //var model = this.model;
        this.$el.html(this.template({ }));
        this.$el.css("background", "white");
    }
});