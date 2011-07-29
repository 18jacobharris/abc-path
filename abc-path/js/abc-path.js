"use strict";
Class('ABC_Path', {
});
Class('ABC_Path.Constants', {
    methods: {
        LEN : function () {
            return 5;
        },
        LEN_LIM : function () {
            return (this.LEN()-1);
        },
        BOARD_SIZE : function() {
            return this.LEN() * this.LEN();
        },
        
        Y : function() {
            return 0;
        },

        X : function() {
            return 1;
        },

        letters : function() {
            return [
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
            ];
        },

        NUM_CLUES : function() {
            return 2 + this.LEN() + this.LEN();
        },

        ABCP_MAX_LETTER : function() {
            return this.letters().length - 1;
        }
    }
});
Class('ABC_Path.Solver', {
});
Class('ABC_Path.Solver.Base', {
    isa: ABC_Path.Constants,
    methods: {
        _xy_to_int: function(xy) {
            return xy[this.Y()] * this.LEN() + xy[this.X()];
        },
        _to_xy: function(myint) {
            return [Math.floor(myint / this.LEN()), (myint % this.LEN())];
        },
        _perl_range: function(start, end) {
            var ret = [];
            
            for (var i = start; i <= end; i++) {
                ret.push(i);
            }

            return ret;
        },
        _y_indexes: function() {
            return this._perl_range(0,this.LEN_LIM());
        },
        _x_indexes: function() {
            return this._y_indexes(); 
        },
        _x_in_range: function(x) {
            return ((x >= 0) && (x < this.LEN()));
        },
        _y_in_range: function(y) {
            return this._x_in_range(y);
        },
    },
});
Class('ABC_Path.Solver.Board', {
    isa: ABC_Path.Solver.Base,
    has: {
        letters_map: {
            is: 'ro',
            init: function(){ 
                var ret = {};
                var l = this.letters();
                for (var i in l) {
                    ret[l[i]] = i;
                }
                return ret;
            },
        },
        _iter_changed: {
            is: 'rw',
            init: 0,
        },
        _moves: {
            is: 'rw',
            init: function() { return [];},
        },
        _error: {
            is: 'rw',
            init: undefined,
        },
        _successful_layouts: {
            is: 'rw',
            init: function() { return [];},
        },
        _layout: {
            is: 'rw',
            init: '',
        },
    },
    methods: {
        ABCP_VERDICT_NO: function() {
            return 0;
        },
        ABCP_VERDICT_MAYBE: function() {
            return 1;
        },
        ABCP_VERDICT_YES: function() {
            return 2;
        },
        _get_letter_numeric: function(letter_ascii) {
            if (letter_ascii in this.letters_map)
            {
                return this.letters_map[letter_ascii];
            }
            else
            {
                throw "Unknown letter '" + letter_ascii + "'";
                return;
            }
        },
        _inc_changed: function() {
            this.setIter_changed(this.getIter_changed() + 1);
            return;
        },
        _flush_changed: function() {
            
            var ret = this.getIter_changed();

            this.setIter_changed(0);

            return ret;
        },
        _add_move: function(move) {
            this.getMoves().push(move);
            this._inc_changed();
            return;
        },
        get_successful_layouts: function() {
            // slice(0) performs a shallow copy.
            return this.getSuccesful_layouts().slice(0);
        },
        _l_indexes: function() {
            return this._perl_range(0, this.ABCP_MAX_LETTER());
        },
        _calc_offset: function(letter, x, y) {
            return letter * this.BOARD_SIZE() + this._xy_to_int([y,x]);
        },
    },
});