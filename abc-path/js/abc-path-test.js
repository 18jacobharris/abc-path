"use strict";
/*
 * Tests for the ABC Path Solver and Generator.
 * Copyright by Shlomi Fish, 2011.
 * Released under the MIT/X11 License
 * ( http://en.wikipedia.org/wiki/MIT_License ).
 * */
function test_abc_path()
{
    module("Constants");

    test("Constants Test", function() {
        expect(9);

        var myconst = new ABC_Path.Constants({});

        // TEST
        ok (myconst, "myconst was initialized.");

        // TEST
        equal (myconst.LEN(), 5, "LEN is 5.");

        // TEST
        equal (myconst.LEN_LIM(), 4, "LEN_LIM is 4 - one less than LEN.");

        // TEST
        equal (myconst.BOARD_SIZE(), 25, "BOARD_SIZE is 25 - LEN*LEN.");

        // TEST
        equal(myconst.Y(), 0, "Y is 0.");

        // TEST
        equal(myconst.X(), 1, "X is 1, because coordinates are (Y,X)");

        // TEST
        equal(myconst.letters()[0], 'A', "First letter is A.");

        // TEST
        deepEqual(myconst.letters(), [
'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
            ],
            "Letters are OK."
            );

        // TEST
        equal(myconst.ABCP_MAX_LETTER(), 24, 'ABCP_MAX_LETTER is ok.');
    });

    module("Solver.Base");

    test("Solver.Base _xy_to_int", function() {
        expect(5);

        var mybase = new ABC_Path.Solver.Base({});

        // TEST
        ok (mybase, "myconst was initialized.");

        // TEST
        equal(mybase._xy_to_int([0,0]), 0, 'int of (Y,X) = [0,0] is 0.');
        // TEST
        equal(mybase._xy_to_int([0,1]), 1, 'int of (Y,X) = [0,1] is 1.');
        // TEST
        equal(mybase._xy_to_int([1,0]), 1*5+0, 'int of (Y,X) = [1,0] is 5.');
        // TEST
        equal(mybase._xy_to_int([2,3]), 2*5+3, 'int of (Y,X) = [2,3] is 2*5+3.');
    });

    test("Solver.Base _to_xy", function() {
        expect(3);

        var mybase = new ABC_Path.Solver.Base({});

        // TEST
        deepEqual(mybase._to_xy(0), [0,0], '_to_xy(0) -> [0,0]');

        // TEST
        deepEqual(mybase._to_xy(0*5+1), [0,1], '_to_xy(1) -> [0,1]');

        // TEST
        deepEqual(mybase._to_xy(3*5+4), [3,4], '_to_xy(3*5+4) -> [3,4]');
    });

    test("Solver.Base _replaceSubstring", function() {
        expect(2);

        var mybase = new ABC_Path.Solver.Base({});
        // TEST
        equal(mybase._replaceSubstring('0123456789', 0, 1, 'foo'),
            'foo123456789',
            '_replaceSubstring simple test.');
        // TEST
        equal(mybase._replaceSubstring('abcdef', 1, 3, 'REPLACE'),
            'aREPLACEdef',
            '_replaceSubstring second test.');
    });

    test("Solver.Base _y_indexes", function() {
        expect(4);

        var mybase = new ABC_Path.Solver.Base({});

        // TEST
        deepEqual(mybase._perl_range(0,2), [0,1,2], '_perl_range');

        // TEST
        deepEqual(mybase._perl_range(2,6), [2,3,4,5,6], '_perl_range #2');

        // TEST
        deepEqual(mybase._y_indexes(), mybase._perl_range(0, 4),
            '_y_indexes returns right value.'
        );
        // TEST
        deepEqual(mybase._x_indexes(), mybase._perl_range(0, 4),
            '_x_indexes returns right value.'
        );
    });

    test("Solver.Base _x_in_range", function() {
        expect(4);

        var mybase = new ABC_Path.Solver.Base({});

        // TEST
        ok (mybase._x_in_range(0), '0 is in range');

        // TEST
        ok (mybase._x_in_range(4), '4 is in range');

        // TEST
        ok (!mybase._x_in_range(-1), '-1 is not in range.');

        // TEST
        ok (!mybase._x_in_range(5), '5 is not in range.');
    });

    module("Solver.Board");

    test("Solver.Board iter_changed", function() {
        expect(5);

        var myboard = new ABC_Path.Solver.Board({});

        // TEST
        equal(myboard.getIter_changed(), 0, 'iter_changed is initialised to 0.');

        myboard._inc_changed();
        // TEST
        equal(myboard.getIter_changed(), 1, 'iter_changed is now 1.');

        myboard._inc_changed();
        // TEST
        equal(myboard.getIter_changed(), 2, 'iter_changed is now 2.');

        // TEST
        equal(myboard._flush_changed(), 2, 'flush_changed returned 2.');

        // TEST
        equal(myboard.getIter_changed(), 0, 'iter_changed was reset to 0 after flush.');
    });

    test("Solver.Board _add_move", function() {
        expect(4);

        var myboard = new ABC_Path.Solver.Board({});

        myboard._add_move("Token");

        // TEST
        deepEqual(myboard.getMoves(), ["Token"],
            '_add_move works.'
        );

        // TEST
        equal(myboard.getIter_changed(), 1, 'iter_changed is 1 after _add_move.');

        myboard._add_move("SecondToken");
        // TEST
        deepEqual(myboard.getMoves(), ["Token", "SecondToken"],
            '_add_move works again.'
        );

        // TEST
        equal(myboard.getIter_changed(), 2, 'iter_changed is 2 after two _add_move-s.');
    });

    test("Solver.Board _calc_offset", function() {
        expect(2);

        var myboard = new ABC_Path.Solver.Board({});

        // TEST
        equal(myboard._calc_offset(0, 0, 0), 0*25+0*5+0,
            '_calc_offset(0,0,0)'
        );

        // TEST
        equal(myboard._calc_offset(20, 3, 2), 20*25+2*5+3,
            '_calc_offset(20,3,2)'
        );
    });

    test("Solver.Board _xy_loop", function() {
        expect(1);

        var myboard = new ABC_Path.Solver.Board({});

        var result = [];

        // TEST
        myboard._xy_loop(function(x,y) {
            result.push('' + y + ',' + x);
            return;
        });

        deepEqual(result, [
            "0,0", "0,1", "0,2", "0,3", "0,4",
            "1,0", "1,1", "1,2", "1,3", "1,4",
            "2,0", "2,1", "2,2", "2,3", "2,4",
            "3,0", "3,1", "3,2", "3,3", "3,4",
            "4,0", "4,1", "4,2", "4,3", "4,4",
        ],
        '_xy_loop works.'
        );

    });

    test("Solver.Board get_successes_text_tables", function() {
        expect(2);
        // Games::ABC_Path::Generator layout No. 1.
        var myboard = new ABC_Path.Solver.Board({});

        myboard.input_from_clues({
            clue_letter: 'A',
            clue_letter_x: 1,
            clue_letter_y: 3,
            major_diagonal: ['Y', 'L'],
            minor_diagonal: ['T', 'H'],
            columns: [
            ['G','E',],
            ['B','X',],
            ['J','C',],
            ['N','Q',],
            ['U','P',],
            ],
            rows: [
            ['S','R',],
            ['D','W',],
            ['F','V',],
            ['O','K',],
            ['M','I',],
            ],
            }
        );

        // TEST
        deepEqual(myboard.solve(), ['success'], 'solved successfully.');
        // TEST
        deepEqual(myboard.get_successes_text_tables(), [
("| X = 1 | X = 2 | X = 3 | X = 4 | X = 5 |\n" +
 "|   Y   |   X   |   R   |   S   |   T   |\n" +
 "|   E   |   D   |   W   |   Q   |   U   |\n" +
 "|   F   |   B   |   C   |   V   |   P   |\n" +
 "|   G   |   A   |   K   |   L   |   O   |\n" +
 "|   H   |   I   |   J   |   N   |   M   |\n" +
 "")
                ], 'solves Generator Board No. 1 OK.');
    });

    test("Solver.Board Brain Bashers 2010-12-21", function() {
        expect(2);
        // Brain Bashers 2010-12-21
        var myboard = new ABC_Path.Solver.Board({});

        myboard.input_from_clues({
            clue_letter: 'A',
            clue_letter_x: 4,
            clue_letter_y: 0,
            major_diagonal: ['O', 'H'],
            minor_diagonal: ['N', 'T'],
            columns: [
            ['W','V',],
            ['X','M',],
            ['I','G',],
            ['B','C',],
            ['Q','D',],
            ],
            rows: [
            ['J','K',],
            ['E','L',],
            ['U','F',],
            ['Y','P',],
            ['R','S',],
            ],
            }
        );

        // TEST
        deepEqual(myboard.solve(), ['success'], 'solved successfully.');
        // TEST
        deepEqual(myboard.get_successes_text_tables(), [
("| X = 1 | X = 2 | X = 3 | X = 4 | X = 5 |\n" +
 "|   K   |   J   |   I   |   B   |   A   |\n" +
 "|   L   |   H   |   G   |   C   |   E   |\n" +
 "|   U   |   M   |   N   |   F   |   D   |\n" +
 "|   V   |   T   |   Y   |   O   |   P   |\n" +
 "|   W   |   X   |   S   |   R   |   Q   |\n" +
 "")
                ], 'solves Brain-Bashers-2010-12-21');
    });

    test("Solver.Board Brain Bashers 2010-12-22", function() {
        expect(2);
        // Brain Bashers 2010-12-22
        var myboard = new ABC_Path.Solver.Board({});

        myboard.input_from_clues({
            clue_letter: 'A',
            clue_letter_x: 1,
            clue_letter_y: 2,
            major_diagonal: ['P', 'N'],
            minor_diagonal: ['K', 'T'],
            columns: [
            ['E','F',],
            ['I','C',],
            ['R','M',],
            ['Q','Y',],
            ['X','V',],
            ],
            rows: [
            ['D','S',],
            ['B','U',],
            ['O','G',],
            ['W','H',],
            ['J','L',],
            ],
            }
        );

        // TEST
        deepEqual(myboard.solve(), ['success'], 'solved successfully.');
        // TEST
        deepEqual(myboard.get_successes_text_tables(), [
("| X = 1 | X = 2 | X = 3 | X = 4 | X = 5 |\n" +
 "|   E   |   D   |   R   |   S   |   T   |\n" +
 "|   F   |   C   |   B   |   Q   |   U   |\n" +
 "|   G   |   A   |   P   |   O   |   V   |\n" +
 "|   H   |   K   |   M   |   N   |   W   |\n" +
 "|   J   |   I   |   L   |   Y   |   X   |\n" +
 "")
                ], 'solves Brain-Bashers-2010-12-22');
    });

    module("MSRand");

    test("MSRand Seed 1", function() {
        expect(4);

        var r = new MSRand({seed : 1 });

        // TEST
        ok (r, 'r was initialized.');

        // TEST
        equal(r.rand(), 41, "First result for seed 1 is 41.");

        // TEST
        equal (r.rand(), 18467, "2nd result for seed 1 is 18,467.");

        // TEST
        equal (r.rand(), 6334, "3rd result for seed 1 is 6,334.");
    });

    test("MSRand Shuffle", function() {
        expect(2);

        var r = new MSRand({seed : 24 });

        var myarr = [0,1,2,3,4,5,6,7,8,9];

        var ret = r.shuffle(myarr);
        // TEST
        deepEqual(
            myarr,
            [1,7,9,8,4,5,3,2,0,6],
            'Array was shuffled.'
            );

        // TEST
        equal (ret, myarr, 'shuffle returns the same array.');
    });

    module("FinalLayoutObj");

    test("FinalLayoutObj", function() {
        expect(3);

        var myboard = new ABC_Path.Solver.Board({});
        var layout_string = myboard._perl_range(1,25).map(
            function (x) { return String.fromCharCode(x); }
        ).join('');

        var obj = new ABC_Path.Generator.FinalLayoutObj({ s: layout_string });

        // TEST
        deepEqual (obj.get_A_xy(), {x : 0, y: 0}, 'A xy is OK.');

        // TEST
        equal(obj.get_letter_at_pos({ y: 1, x: 0 }), 'F', 'L[0,1] = F');
        // TEST
        equal(obj.get_letter_at_pos({ y: 0, x: 2 }), 'C', 'L[2,0] = C');
    });

    module("ABC_Path.Generator.Generator");

    test("_get_next_cells", function() {
        expect(2);
        var pos_array = _shlomif_repeat(['\0'], 5*5);

        pos_array[0*5+0] = String.fromCharCode(1);
        pos_array[1*5+1] = String.fromCharCode(2);

        var pos_s = pos_array.join('');

        var gen = new ABC_Path.Generator.Generator({seed : 1});
        // TEST
        deepEqual (gen._get_next_cells(pos_s, 1*5+1),
            [0*5+1, 0*5+2, 1*5+0, 1*5+2, 2*5+0, 2*5+1, 2*5+2],
            'get_next_cells for (1,1)'
        );

        // TEST
        deepEqual (gen._get_next_cells(pos_s, 0*5+1),
            [0*5+2, 1*5+0, 1*5+2],
            'get_next_cells for (0,1) - an edge cell.'
        );
    });

    test("_get_num_connected", function() {
        expect(1);
        var pos_array = _shlomif_repeat(['\0'], 5*5);

        pos_array[0*5+0] = String.fromCharCode(1);
        pos_array[1*5+0] = String.fromCharCode(2);
        pos_array[1*5+1] = String.fromCharCode(3);
        pos_array[1*5+2] = String.fromCharCode(4);
        pos_array[1*5+3] = String.fromCharCode(4);
        pos_array[0*5+3] = String.fromCharCode(5);

        var pos_s = pos_array.join('');

        var gen = new ABC_Path.Generator.Generator({seed : 1});
        // TEST
        equal(gen._get_num_connected(pos_s), 2);
    });

    var calc_final_layout_string = function (final_layout) {
        var got_matrix = final_layout._y_indexes().map(function (y) {
            return final_layout._x_indexes().map(function(x) {
                return final_layout.get_letter_at_pos({y : y, x: x})
            }
            )
            });

        var got_string = [].concat.apply([], got_matrix).join('');

        return got_string;
    };

    test("calc_final_layout seed 1.", function() {
        expect(1);

        var gen = new ABC_Path.Generator.Generator({seed : 1});
        var final_layout = gen.calc_final_layout();
        var expected_string =
            'YXRST' +
            'EDWQU' +
            'FBCVP' +
            'GAKLO' +
            'HIJNM';

        // TEST
        equal(calc_final_layout_string(final_layout), expected_string,
            'Layout with seed 1 is right.');
    });

    test("calc_final_layout seed 25.", function() {
        expect(1);

        var gen = new ABC_Path.Generator.Generator({seed : 25});
        var final_layout = gen.calc_final_layout();
        var expected_string =
            'HIFUV' +
            'JGETW' +
            'KDSRX' +
            'LBCQY' +
            'AMNOP';

        // TEST
        equal(calc_final_layout_string(final_layout), expected_string,
            'Layout with seed 25 is right.');
    });

    test("_clues_positions", function() {
        expect(4);

        // The seed does not matter.
        var gen = new ABC_Path.Generator.Generator({seed : 1});

        var map_clue = function(clue) { return clue.map(function (i) {
            return gen._to_xy(i);
        }) };

        // TEST
        deepEqual(map_clue(gen._clues_positions[0]), [[0,0],[1,1],[2,2],[3,3],[4,4]],
            'clue No. 0 (diagonal) is OK.'
        );
        // TEST
        deepEqual(map_clue(gen._clues_positions[1]), [[0,4],[1,3],[2,2],[3,1],[4,0]],
            'clue No. 1 (anti-diagonal) is OK.'
        );

        // TEST
        deepEqual(map_clue(gen._clues_positions[2]), [[0,0],[0,1],[0,2],[0,3],[0,4]],
            'clue No. 2 (y=0) is OK.'
        );
        // TEST
        deepEqual(map_clue(gen._clues_positions[2+5]), [[0,0],[1,0],[2,0],[3,0],[4,0]],
            'clue No. 2+5 (x=0) is OK.'
        );
    });

    test("calc_riddle", function() {
        expect(1);
        var gen = new ABC_Path.Generator.Generator({seed : 1});
        var riddle = gen.calc_riddle();

        // TEST
        deepEqual(riddle.get_clues_for_input_to_board(),
            {
            clue_letter: 'A',
            clue_letter_x: 1,
            clue_letter_y: 3,
            major_diagonal: ['Y', 'L'],
            minor_diagonal: ['T', 'H'],
            columns: [
            ['G','E',],
            ['B','X',],
            ['J','C',],
            ['N','Q',],
            ['U','P',],
            ],
            rows: [
            ['S','R',],
            ['D','W',],
            ['F','V',],
            ['O','K',],
            ['M','I',],
            ],
            }, 'clues for layout No. 1 are OK.');
    });

    test("calc_riddle for another seed", function() {
        expect(1);
        var gen = new ABC_Path.Generator.Generator({seed : 251});
        var riddle = gen.calc_riddle();

        // TEST
        deepEqual(riddle.get_clues_for_input_to_board(),
            {
            clue_letter: 'A',
            clue_letter_x: 3,
            clue_letter_y: 1,
            major_diagonal: ['K', 'C'],
            minor_diagonal: ['G', 'R'],
            columns: [
            ['V','X',],
            ['D','F',],
            ['E','I',],
            ['S','L',],
            ['O','Q',],
            ],
            rows: [
            ['B','U',],
            ['T','W',],
            ['P','N',],
            ['Y','M',],
            ['H','J',],
            ],
            }, 'clues for layout No. 1 are OK.');
    });

}
