/* 
 * Dropbox support
 */


var Dropbox = {
    normalizeItemData : function(v) {
        if (v.is_dir) {
        } else {
        }
        v.name = v.path;
        v.url = 'http://dl.dropbox.com/u/128780158'+v.path.replace('/Public','');
        v.icon  = v.url;//'http://SnapCasa.com/Get.aspx?url='+encodeURIComponent(v.url);
        return v;
    }
    ,
    normalizeItemDataIterator: (function(v){
            this.push(Dropbox.normalizeItemData(v));
    }).iterator()
};

 
Object.entity.define('DropboxGallery extends List', {
    itemTemplate:'<a href="{url}" class="thumbnail" target="_blank"><img src="{icon}" class="h160"/></a>'
    ,
    style:'thumbnails'
    ,
    methods: function(_super) {
        return {
            // adopt html content
            dataAsyncAdapter: function(err, data) {
                this.domNode.innerHTML='';
                if (err || ! data) {
                    data = {contents:[{path:'no'}]};
                }
                return Dropbox.normalizeItemDataIterator(data.contents, []);
            }
        }
    }
});