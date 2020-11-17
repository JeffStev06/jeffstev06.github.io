// Array con dos dimensiones [nivel][puzzle]
var niveles = [[1],[2,3],[4,5,6]], nivel = 0;

var cols, rows, sizeX, sizeY;
var width = 0, height = 0;

var inicio, final, board, tiempo, etapa, thumbnail, jugador;
var lstPiezas = [], lstShuffle = [];
var timer, sec = 0, totalJugado = 0;

// Booleanas
var showHint = false;
var isPlaying = false;

$(document).ready(function () {

    board = $('#board');
    inicio = $('#inicio');
    final = $('#fin');
    nivel = 0;
    etapa = 0;
    thumbnail = $('#thumbnail_img');

    $('#btnPlay').click(loadControls);
    $('#btnPause').click(loadControls);

    $('#btnHint').click(function () {
        if (isPlaying) {
            if (!showHint) {
                showHint = true;
                $('#thumbnail_img').css('display', '');
            } else {
                showHint = false;
                $('#thumbnail_img').css('display', 'none');
            }
        }
    });

    loadVariables();
    //loadGame(niveles[etapa].nvl,niveles[etapa].pzl);
    $('#btnPlay').click(function () {
        if (sec == 0) {
            jugador = $('#name').val();
            inicio.css('display','none');
            final.css('display','none');
            board.css('display','');
            loadGame(nivel+1,niveles[nivel][etapa]);
        }
        
    });
    
});

function loadControls() {

    if (!isPlaying) {
        isPlaying = true;
        $('#btnPause').css('display', '');
        $('#btnPlay').css('display', 'none');
        startTime();
        dragNDrop();
        console.log('Estoy en play');
    } else {
        isPlaying = false;
        $('#btnPlay').css('display', '');
        $('#btnPause').css('display', 'none');
        pauseTime();
        console.log('Estoy en pausa');
    }

}

function loadVariables() {

    var windowWidth = $(window).width();

    if (windowWidth >= 600) {
        width = 600;
        height = 400;
    } else if (windowWidth < 600 && windowWidth >= 480) {
        width = 480;
        height = 320;
    } else {
        width = 350;
        height = 240;
    }

    thumbnail.css({
        height: height,
        width: width,
        top: 'calc(50% - ' + height / 2 + ')'
    });
    //let basis = 100 / cols;
    //$('.pieza').css('flex-basis', basis);

}

function loadGame(nvl, imgNum) {

    switch (nvl) {
        case 1:
            rows = 4;
            cols = 5;
            break;
        case 2:
            rows = 5;
            cols = 6;
            break;
        case 3:
            rows = 6;
            cols = 8;
            break;
    }
    sizeX = width / cols;
    sizeY = height / rows;
    console.log('Puzzle nivel: ' + nvl + ', de ' + width + 'x' + height + '. FilasxColumnas: ' + rows + 'x' + cols + ' con piezas de tamaño ' + sizeX + 'x' + sizeY);

    board.css({
        height: 4 + (sizeY*rows),
        width: 4 + (sizeX*cols),
    });
    //board.css('grid-template-columns', 'repeat(' + cols + ', 1fr)');
    // Hacer aperecer el Tablero

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let imgHTML = `<div id="${i}${j}" style="background-position: -${sizeX * j}px -${sizeY * i}px ; background-image: url(img/puzzle1/pzl${imgNum}.jpg); background-size: ${width}px ${height}px;  width:${sizeX }px; height:${sizeY }px" class="pieza draggable droppable" />`;

            let pieza = {
                id: i + '' + j,
                content: imgHTML,
            }
            // Lista con las piezas en orden correcto
            lstPiezas.push(pieza);
            lstShuffle.push(pieza);
        }
    }
    // Lista con piezas desordenadas
    shuffle(lstShuffle);

    dibujarTablero(lstShuffle);

    //verificacion();
    thumbnail.attr('src', `img/puzzle1/pzl${imgNum}.jpg`)

    $('#nvl').html(nvl)
    //startTime();

}

function startTime() {
    timer = setInterval(function () {
        $('#tmp').html(sec++ + 's');
    }, 1000);
}

function pauseTime() {
    clearInterval(timer);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // Mientras todavía queden elementos que reordenar...
    while (0 !== currentIndex) {

        // Elige un elemento restante...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Y se intercambia con el elemento actual.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function dragNDrop() {
    
    $('.draggable').draggable({
        start: function(event, ui) {
            let piezaMoviendo = $(this);
            piezaMoviendo.addClass('sobre')
        },
        stop: function(event, ui) {
            let piezaMoviendo = $(this);
            piezaMoviendo.removeClass('sobre')
        }
    });
    $('.droppable').droppable({
        drop: function(event,ui) {
            var piezaMovida = ui.draggable;
            var piezaAMover = $(this);
            
            reordenarTablero(piezaMovida.attr('id'), piezaAMover.attr('id'))

            dibujarTablero(lstShuffle);
            verificacion();
        }
    });

}

function reordenarTablero(id1, id2) {

    let pos = 0, pos1 = 0, pos2 = 0;
    let piezaTemp;
    lstShuffle.forEach(function(val) {
        if (val.id == id1) {
            pos1 = pos;
        }
        if (val.id == id2) {
            pos2 = pos;
        }
        pos ++;
        //console.log(val.id)
    })

    piezaTemp = lstShuffle[pos1];
    lstShuffle[pos1] = lstShuffle[pos2];
    lstShuffle[pos2] = piezaTemp
    
}

function dibujarTablero(lista) {
    board.html("");
    lista.forEach(function (val) {
        board.append(val.content);
    })
    dragNDrop()

}

function verificacion() {
    let i = 0, oks = 0;
    lstShuffle.forEach(function (val) {
        if (lstPiezas[i].id == val.id) {
            //$('#' + val.id).addClass('ok');
            oks++;
        }
        i++;
    });

    
    if (oks == lstShuffle.length) {
    setTimeout(function() {
        //let nivel;
        // Pausar el tiempo y 
        isPlaying = true;
        loadControls();
        
        totalJugado = totalJugado + sec;
        
        etapa ++;
        if (niveles[nivel][etapa] == undefined) {
            nivel++;
            etapa = 0;
        }
        lstPiezas = [];
        lstShuffle = [];
        board.html("");
        if(niveles[nivel] != undefined) {
            if (etapa == 0) {
                alertify.alert('Bien hecho', 'Has completado el nivel '+nivel+'/3 en '+sec+' segundos', 
                function(){ 
                    loadGame(nivel+1,niveles[nivel][etapa])
                });
            } else {
                alertify.alert('Listo', 'Acabas de completar la etapa '+etapa+' del nivel '+(nivel+1)+' en '+sec+' segundos', 
                function(){ 
                    loadGame(nivel+1,niveles[nivel][etapa])
                });
            }
            sec = 0;
            loadControls();
        } else {
            // LLAMAR A Nombre de INTEGRANTES
            alertify.success('Finalizaste el juego');
            fin();
        }
        }, 1000);
    }
}

function fin() {
    board.css('display','none');
    $('#thanks').html(`Gracias por jugar ${jugador}  🥳`);
    $('#score').html(`Tiempo jugado ${totalJugado} segundos`);
    final.css('display','');
    $('#nvl').html('-')
    $('#tmp').html(0 + 's');
    board.html("");
    lstPiezas = [];
    lstShuffle = [];

    etapa = 0;
    nivel = 0;
    totalJugado = 0;
    sec = 0;    

}
