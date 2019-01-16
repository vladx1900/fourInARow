
var UIController = (function() {

    var DOMstrings = {
        gameCircle: '.game-circle',
        gameTable: '.table-rows',
        newGame: 'newGame',
        undo: 'undo'
    };

    return {
        getDOMstrings: function () {
            return DOMstrings;
        },

        createTable: function() {

            var circle, newRow, endRow, row, column;

            circle = '';
            newRow = '<tr><td>';
            endRow = '</td></tr>';

            for (row = 0; row <= 5 ; row++) {
                for (column = 0; column <= 6 ; column++) {
                    if (column === 0) {
                        document.querySelector(DOMstrings.gameTable).insertAdjacentHTML('beforeend', newRow);
                    }

                    document.querySelector(DOMstrings.gameTable).insertAdjacentHTML('beforeend', '<div class="game-circle" id="' + row + '' + column + '"></div>');

                    if (column === 6) {
                        document.querySelector(DOMstrings.gameTable).insertAdjacentHTML('beforeend', endRow);
                    }
                }
            }
        }
    };

})();

var controller = (function(UICtr) {

    var activePlayer = 1, lastMove = [], gameOver = -1;

    var setupEventListeners = function() {

        var DOM = UICtr.getDOMstrings();

        var gameCircles = document.querySelectorAll(DOM.gameCircle);

        document.getElementById(DOM.newGame).addEventListener('click', newGame);
        document.getElementById(DOM.undo).addEventListener('click', undo);

        if (gameOver === 0) {
            gameCircles.forEach(function (gameCircle) {
                gameCircle.addEventListener('mouseover', hoveredCircle, gameCircle);
                gameCircle.addEventListener('mouseout', unhoverCircle, gameCircle);
                gameCircle.addEventListener('click', clickedCircle, gameCircle);
            });
        }

        if (gameOver === -1) {
            gameCircles.forEach(function (gameCircle) {
                gameCircle.removeEventListener('mouseover', hoveredCircle, gameCircle);
                gameCircle.removeEventListener('click', clickedCircle, gameCircle);
            });
        }

    };

    var newGame = function() {
        gameOver = 0;
        setupEventListeners();
        activePlayer = 1;
        lastMove = [];

        var gameCircles = document.querySelectorAll(UICtr.getDOMstrings().gameCircle);
        gameCircles.forEach(function (gameCircle) {
            gameCircle.classList.remove('red-circle');
            gameCircle.classList.remove('blue-circle');
            gameCircle.classList.remove('win-circle');
            gameCircle.classList.remove('last-move');
        });
    };

    var undo = function() {

        if (lastMove.length > 1) {
            var element = document.getElementById(lastMove[lastMove.length - 1]);
            element.classList.remove('red-circle');
            element.classList.remove('blue-circle');
            element.classList.remove('last-move');

            lastMove.pop();
            var lastMoveElement = document.getElementById(lastMove[lastMove.length - 1]);
            lastMoveElement.classList.add('last-move');
        }

        if (activePlayer === 1) {
            activePlayer = 2;
        } else {
            activePlayer = 1;
        }
    };

    var clickedCircle = function(circle) {

        var row, aCircle;

        for (row = 5; row >= 0; row--) {

            aCircle = document.getElementById(row + '' + circle.srcElement.id%10);

            if (!aCircle.classList.contains('red-circle') && !aCircle.classList.contains('blue-circle') && aCircle.classList.contains('last-move')) {
                if (activePlayer === 1) {
                    aCircle.classList.add('red-circle');
                    activePlayer = 2;
                } else {
                    aCircle.classList.add('blue-circle');
                    activePlayer = 1;
                }

                if (lastMove.length !== 0) {
                    var lastMoveElement = document.getElementById('' + lastMove[lastMove.length-1]);
                    lastMoveElement.classList.remove('last-move');
                }
                lastMove.push(row + '' + circle.srcElement.id%10);
            }
        }

        if (!isGameFinished(lastMove[lastMove.length-1])) {
            unhoverCircle(circle);
            hoveredCircle(circle);
        }
    };

    var isGameFinished = function(lastM) {
        var index, column, row, targetElement, isOver, circleType, index2;

        column = lastM%10;
        row = parseInt(lastM/10);

        if (activePlayer === 1) {
            circleType = 'blue-circle';
        } else {
            circleType = 'red-circle';
        }

        checkAllPossibilities: {

            //right
            if (column + 3 < 7) {
                isOver = 0;

                for (index = column + 1; index <= column + 3; index++) {
                    targetElement = document.getElementById(row + '' + index);
                    if (targetElement.classList.contains(circleType)) {
                        isOver++;
                    }
                }

                if (isOver === 3) {
                    for (index = column; index <= column + 3; index++) {
                        targetElement = document.getElementById(row + '' + index);
                        targetElement.classList.add('win-circle')
                    }

                    showWinner();
                    break checkAllPossibilities;
                }
            }

            //left
            if (column - 3 >= 0) {
                isOver = 0;

                for (index = column - 1; index >= column - 3; index--) {
                    targetElement = document.getElementById(row + '' + index);
                    if (targetElement.classList.contains(circleType)) {
                        isOver++;
                    }
                }

                if (isOver === 3) {
                    for (index = column; index >= column - 3; index--) {
                        targetElement = document.getElementById(row + '' + index);
                        targetElement.classList.add('win-circle');
                    }

                    showWinner();
                    break checkAllPossibilities;
                }
            }

            //down
            if (row + 3 <= 5) {
                isOver = 0;

                for (index = row + 1; index <= row + 3; index++) {
                    targetElement = document.getElementById(index + '' + column);
                    if (targetElement.classList.contains(circleType)) {
                        isOver++;
                    }
                }

                if (isOver === 3) {
                    for (index = row; index <= row + 3; index++) {
                        targetElement = document.getElementById(index + '' + column);
                        targetElement.classList.add('win-circle');
                    }

                    showWinner();
                    break checkAllPossibilities;
                }
            }

            //NE
            if (column + 3 <= 6 && row - 3 >= 0) {
                isOver = 0;

                index2 = column + 1;
                for (index = row - 1; index >= row - 3; index--) {
                    targetElement = document.getElementById(index + '' + index2);
                    if (targetElement.classList.contains(circleType)) {
                        isOver++;
                    }

                    index2++;
                }

                if (isOver === 3) {
                    index2 = column;
                    for (index = row; index >= row - 3; index--) {
                        targetElement = document.getElementById(index + '' + index2);
                        targetElement.classList.add('win-circle');

                        index2++;
                    }

                    showWinner();
                    break checkAllPossibilities;
                }
            }

            //SV
            if (row + 3 <= 5 && column - 3 >= 0) {
                isOver = 0;

                index2 = column - 1;
                for (index = row + 1; index <= row + 3; index++) {
                    targetElement = document.getElementById(index + '' + index2);
                    if (targetElement.classList.contains(circleType)) {
                        isOver++;
                    }

                    index2--;
                }

                if (isOver === 3) {
                    index2 = column;
                    for (index = row; index <= row + 3; index++) {
                        targetElement = document.getElementById(index + '' + index2);
                        targetElement.classList.add('win-circle');

                        index2--;
                    }

                    showWinner();
                    break checkAllPossibilities;
                }
            }

            //NV
            if (row - 3 >= 0 && column - 3 >= 0) {
                isOver = 0;

                index2 = column - 1;
                for (index = row - 1; index >= row - 3; index--) {
                    targetElement = document.getElementById(index + '' + index2);
                    if (targetElement.classList.contains(circleType)) {
                        isOver++;
                    }

                    index2--;
                }

                if (isOver === 3) {
                    index2 = column;
                    for (index = row; index >= row - 3; index--) {
                        targetElement = document.getElementById(index + '' + index2);
                        targetElement.classList.add('win-circle');

                        index2--;
                    }

                    showWinner();
                    break checkAllPossibilities;
                }
            }

            //SE
            if (row + 3 <= 5 && column + 3 <= 6) {
                isOver = 0;

                index2 = column + 1;
                for (index = row + 1; index <= row + 3; index++) {
                    targetElement = document.getElementById(index + '' + index2);
                    if (targetElement.classList.contains(circleType)) {
                        isOver++;
                    }

                    index2++;
                }

                if (isOver === 3) {
                    index2 = column;
                    for (index = row; index <= row + 3; index++) {
                        targetElement = document.getElementById(index + '' + index2);
                        targetElement.classList.add('win-circle');

                        index2++;
                    }

                    showWinner();
                    break checkAllPossibilities;
                }
            }
        }
    };

    var showWinner = function() {
        gameOver = -1;
        setupEventListeners();

        if (activePlayer === 1) {
            swal('PLAYER 2 WON!!!');
        } else {
            swal('PLAYER 1 WON!!!');
        }
    };

    var hoveredCircle = function(circle) {
        var directionCircle, row, actualCircle, lastMoveMarked = 0;

        for (row = 4; row >= 0; row--) {
            directionCircle = document.getElementById(row + '' + circle.srcElement.id%10);
            actualCircle = document.getElementById((row + 1)  + '' + circle.srcElement.id%10);
            if (!directionCircle.classList.contains('red-circle') && !directionCircle.classList.contains('blue-circle') && (!actualCircle.classList.contains('red-circle') && !actualCircle.classList.contains('blue-circle') || directionCircle.classList.contains('arrow-circle'))) {
                if (!directionCircle.classList.contains('arrow-circle')) {
                    directionCircle.classList.add("arrow-circle");

                    if (lastMoveMarked === 0) {
                        actualCircle.classList.add('last-move');
                        lastMoveMarked = 1;
                    }
                }
            }

            if (row === 0 && !directionCircle.classList.contains('red-circle') && !directionCircle.classList.contains('blue-circle') && ( actualCircle.classList.contains('red-circle') || actualCircle.classList.contains('blue-circle'))) {
                if (!directionCircle.classList.contains('last-move')) {
                    directionCircle.classList.add("last-move");
                }
            }
        }
    };

    var unhoverCircle = function(circle) {
        var directionCircle, row;

        for (row = 5; row >= 0; row--) {
            directionCircle = document.getElementById(row + '' + circle.srcElement.id % 10);

            directionCircle.classList.remove('arrow-circle');
            if (!directionCircle.classList.contains('red-circle') && !directionCircle.classList.contains('blue-circle')) {
                directionCircle.classList.remove('last-move');
            }
        }
    };

    return {
        init: function() {

            UICtr.createTable();
            setupEventListeners();
        }
    };

})(UIController);

controller.init();