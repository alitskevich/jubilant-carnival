const BEHAVIOR = [
    {
        id: 'keydown',
        handler: function (evt) {
            if (this.isVisibleInDOM()) {
                if (evt.keyCode === 37) {
                    //left arrow
                    this.shiftCol(-1);
                    evt.preventDefault();
                } else if (evt.keyCode === 39) {
                    //right arrow
                    this.shiftCol();
                    evt.preventDefault();
                } else if (evt.keyCode === 38) {
                    //up arrow
                    this.shiftRow(-1);
                    evt.preventDefault();
                } else if (evt.keyCode === 40) {
                    //down arrow
                    this.shiftRow();
                    evt.preventDefault();
                }
            }

        }
    },
    {
        id: 'wheel',
        handler: function (evt) {
            if (this.isVisibleInDOM() && this.mouseOnTable) {
                if (evt.deltaX > 0) {
                    this.shiftRow(-1);
                    evt.preventDefault();
                }
                if (evt.deltaX < 0) {
                    this.shiftRow();
                    evt.preventDefault();
                }
                if (this.vScroll && evt.deltaY < 0) {
                    this.shiftCol(-1);
                    evt.preventDefault();
                }
                if (this.vScroll && evt.deltaY > 0) {
                    this.shiftCol();
                    evt.preventDefault();
                }
                //DO NOT PREVENT DEFAULT 'wheel' EVENT IF WAS NOT HANDLED BY THIS COMPONENT
            }
        }
    },
    {
        id: 'resize',
        handler: function (e) {
            this.setClientSize()
        }
    },
    {
        id: 'mouseenter',
        ref: 'root',
        handler: function () {
            this.mouseOnTable = true
        }
    },
    {
        id: 'mouseleave',
        ref: 'root',
        handler: function () {
            this.mouseOnTable = false
        }
    }

];

export default class Behavior {

    constructor(target) {

        this.target = target;

        this.handlers = BEHAVIOR.map(function (b) {
            const handler = b.handler.bind(target);
            (b.ref ? target.refs[b.ref] : window).addEventListener(b.id, handler, false);
            return {...b, handler};
        });
    }

    detach() {

        this.handlers.forEach((b)=> {
            (b.ref ? this.target.refs[b.ref] : window).removeEventListener(b.id, b.handler);
        });
    }

}