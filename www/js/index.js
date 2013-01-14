const snake_colours = ['#333399','#6666cc'];

function createRect(c_x,c_y,col)
{
    $('#gameBoard').append('<div class=\'boardCell\' style=\'background-color: ' + col + '\'></div>');
}

var app = {
    // Application Constructor
    initialize: function(W,H) {
        this.boardWidth = W;
        this.boardHeight = H;

        // setup game board
        var cc_x,cc_y;
        for (cc_y = 0; cc_y < this.boardHeight; cc_y++)
            for (cc_x = 0; cc_x < W; cc_x++)
                createRect(cc_x,cc_y,snake_colours[(cc_x+cc_y)%2]);
        
    },
};
