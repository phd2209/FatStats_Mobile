templates.CategoryItemView = "js/views/CategoryItemView.html";

window.CategoryItemView = Backbone.View.extend({

    tagName:'li',
    template:undefined,
    
    initialize: function(options) {
    
        this.template = _.template(templates.CategoryItemView),
        this.render();
        this.view = this.$el;
    },  
    
    events:{
    },
    
    render:function (eventName) {
        var model = this.model;
        this.$el.html( this.template( model ));
        this.$el.attr('id', model.category );
        return this;
    }
});