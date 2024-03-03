/* 
 * Tumblr support.
 */
var Tumblr = {
    
    ICON_DEFAULT: '/img/logo64.png'
    ,
    
    normalizeItemData : function(v) {
        v.icon = Tumblr.ICON_DEFAULT;
        if (v.type=='video') {
                v.name = v["video-caption"];
                v.description = v['video-player'];
            } else if (v.type=='conversation') {
                v.name = v["conversation-title"];
                v.description = (v['conversation-text']||'').replace('\r\n','<br/>');
            } else if (v.type=='photo') {
                v.name = v["photo-caption"];
                v.description = '<img src="'+v['photo-url-400']+'"/>';
            } else  if (v.type=='quote') {
                v.name = "Цитата";
                v.description = '<blockquote><p>'+v['quote-text']+'</p><small><cite>'+v['quote-source']+'</cite></small></blockquote>';
            } else if (v.type=='link') {
                v.name = String.formatWithMap('<a href="{link-url}">{link-text}</a>',v);
                v.description = v['link-description'];
            } else if (v.type=="regular"){
                v.name = v["regular-title"];
                var p, descr= (v['regular-body']||'')
                    //.replace("<img ", '<img align="left" style="margin:0 0.5em;" class="img-polaroid"');
                    
                if ((p = descr.indexOf('<!-- more -->'))!=-1){
                    descr = descr.substring(0, p) +'<a href="'+v.url+'">Подробнее → </a>';
                }
                v.description = descr;
            }
            return v;
    }
    ,
    normalizeItemDataIterator: (function(v){
            this.push(Tumblr.normalizeItemData(v));
    }).iterator()
};


Object.entity.define('TumblrHtml extends html', {
    htmlTemplate : '<h2>{name}</h2><article>{description}</article>'
    ,
    methods: function(_super) {
        return {
            // adopt html content
            htmlAsyncAdapter: function(err, data) {
                var posts = Object.get(window,'tumblr_api_read.posts');
                if (!posts || !posts.length) return '<hr/>';
                return String.formatWithMap(this.htmlTemplate,Tumblr.normalizeItemData(posts[0]));
            }
        }
    }
});


Object.entity.define('TumblrPicOfTheDay extends html', {
    htmlUrl:'script://grodno-chess.tumblr.com/tagged/pic-of-the-day/json'
    ,
    htmlTemplate : '<h4>{photo-caption}</h4><img src="{photo-url-1280}" style="width:100%" width="100%"/>'
    ,
    methods: function(_super) {
        return {
            // adopt html content
            htmlAsyncAdapter: function(err, data) {
                var posts = Object.get(window,'tumblr_api_read.posts');
                if (!posts ||!posts.length) return '<hr/>';
                var index = Math.round(Math.random()*(posts.length-1));
                return String.formatWithMap(this.htmlTemplate,posts[index]);
            }
        }
    }
});
    
Object.entity.define('TumblrNewsList extends List', {
    itemTemplate:'<a class="pull-left" href="{url}"><img class="media-object" src="{icon}"></a><div class="media-body"><h4 class="media-header">{name}</h4><p>{description}</p></div>'
    ,
    itemStyle:'media panel'
    ,
    domNodeType:'dl'
    ,
    css:'list-style: none;'
    ,
    methods: function(_super) {
        return {
            // adopt html content
            dataAsyncAdapter: function(err, data) {
                this.domNode.innerHTML='';
                return Tumblr.normalizeItemDataIterator(data ? data.posts : window.tumblr_api_read.posts, []);
            }
        }
    }
});
