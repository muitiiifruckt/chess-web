let promotion ;
let tempFromCoord, tempToCoord, tempId,draggedElement_2,targetSquare,board;

    function makeDraggable(element) {
    element.addEventListener('dragstart', (e) => {
        draggedElement = e.target;
        e.target.style.opacity = '0.1';
        e.dataTransfer.setDragImage(e.target, 75 / 2, 75 / 2);
    });

    element.addEventListener('dragend', (e) => {
        e.target.style.opacity = '';
    });
}
function addPiece(piece, position) {
            const pieceElement = document.createElement('img');
            pieceElement.src = '/static/figures/' + piece + '.png';
            pieceElement.className = 'chesspiece';
            pieceElement.draggable = true;

            // Вычисляем координаты
            const x = 'abcdefgh'[position % 8];
            const y = 8 - Math.floor(position / 8);
            const coord = `${x}${y}`;

            // Устанавливаем id фигуры на основе её позиции
            const pieceId = `${piece}-${coord}`;
            pieceElement.id = pieceId;

            // Устанавливаем атрибут data-coord для фигуры
            pieceElement.setAttribute('data-coord', coord);
            makeDraggable(pieceElement);



            board.children[position].appendChild(pieceElement);
        }
$(document).ready(function() {
    let end_of_game = false;

    function createChessBoard() {
        board = document.getElementById('chessboard');
        // Убедитесь, что board не null
        if (!board) {
            console.error('Chessboard element not found');
            return;
        }
        for (let i = 0; i < 64; i++) {
            const square = document.createElement('div');
            const isBlack = (Math.floor(i / 8) + i) % 2 === 0;
            square.className = isBlack ? 'black' : 'white';

            // Вычисляем координаты
            const x = 'abcdefgh'[i % 8];
            const y = 8 - Math.floor(i / 8);
            square.setAttribute('data-coord', `${x}${y}`);

            board.appendChild(square);
        }

        // Функция для добавления фигуры на доску
        function addPiece(piece, position) {
            const pieceElement = document.createElement('img');
            pieceElement.src = '/static/figures/' + piece + '.png';
            pieceElement.className = 'chesspiece';
            pieceElement.draggable = true;

            // Вычисляем координаты
            const x = 'abcdefgh'[position % 8];
            const y = 8 - Math.floor(position / 8);
            const coord = `${x}${y}`;

            // Устанавливаем id фигуры на основе её позиции
            const pieceId = `${piece}-${coord}`;
            pieceElement.id = pieceId;

            // Устанавливаем атрибут data-coord для фигуры
            pieceElement.setAttribute('data-coord', coord);
            makeDraggable(pieceElement);



            board.children[position].appendChild(pieceElement);
        }


        const pieces = ['pawn_white', 'pawn_black', 'rook_white', 'knight_white', 'bishop_white', 'queen_white', 'king_white', 'bishop_white', 'knight_white', 'rook_white', 'rook_black', 'knight_black', 'bishop_black', 'queen_black', 'king_black', 'bishop_black', 'knight_black', 'rook_black'];

        // Расстановка фигур на доске
        // Белые пешки
        for (let i = 8; i < 16; i++) {
            addPiece('pawn_black', i);
        }
        // Черные пешки
        for (let i = 48; i < 56; i++) {
            addPiece('pawn_white', i);
        }
        // Остальные фигуры
        addPiece('rook_black', 0);
        addPiece('knight_black', 1);
        addPiece('bishop_black', 2);
        addPiece('queen_black', 3);
        addPiece('king_black', 4);
        addPiece('bishop_black', 5);
        addPiece('knight_black', 6);
        addPiece('rook_black', 7);
        addPiece('rook_white', 56);
        addPiece('knight_white', 57);
        addPiece('bishop_white', 58);
        addPiece('queen_white', 59);
        addPiece('king_white', 60);
        addPiece('bishop_white', 61);
        addPiece('knight_white', 62);
        addPiece('rook_white', 63);
        function isCastling(fromCoord, toCoord, id) {
          // Проверяем, что перетаскиваемый элемент - король и находится в правильной позиции для рокировки
          const isKing = id.startsWith('king_');
          const isKingStartPosition = (fromCoord === 'e1' && id.endsWith('e1')) ||
                                      (fromCoord === 'e8' && id.endsWith('e8'));
          const isCastlingMove = toCoord === 'g1' || toCoord === 'c1' ||
                                 toCoord === 'g8' || toCoord === 'c8';

          return isKing && isKingStartPosition && isCastlingMove;
        }



        let draggedElement = null;

        document.querySelectorAll('.chesspiece').forEach(piece => {
            piece.addEventListener('dragstart', (e) => {
                draggedElement = e.target;
                e.target.style.opacity = '0.1'; // Делаем фигуру полупрозрачной при перетаскивани
                e.dataTransfer.setDragImage(e.target, 75 / 2, 75 / 2);
                // Подсветка возможных ходов или клеток может быть добавлена здесь

            });

            piece.addEventListener('dragend', (e) => {
                e.target.style.opacity = ''; // Возвращаем нормальную прозрачность фигуре
                // Убираем подсветку клеток
                // здесь должна быть запись ходов


            });
        });
        document.querySelectorAll('.promotion-choice').forEach(button => {
          button.addEventListener('click', function() {
              promotion = this.getAttribute('data-piece');
              console.log(promotion + " первый шаг");


            // Скрываем модальное окно после выбора
            document.getElementById('promotionModal').style.display = 'none';
            // Если promotion установлено, отправляем запрос с данными из временных переменных
                if (promotion) {
                    sendMoveRequest(tempFromCoord, tempToCoord, promotion,draggedElement_2);
                }
          });
        });

        // Функция для отображения модального окна выбора фигуры
        function showPromotionModal() {
          document.getElementById('promotionModal').style.display = 'block';
        }

        document.querySelectorAll('#chessboard div').forEach(square => {
            square.addEventListener('dragover', (e) => {
                e.preventDefault(); // Необходимо для возможности drop
                // Подсветка клетки, если нужно
            });

            square.addEventListener('drop', (e) => {
                e.preventDefault();
                targetSquare = e.target.closest('.black, .white'); // Находим клетку

                if (draggedElement && targetSquare && !end_of_game) {
                    // Определяем координаты from и to
                    const fromCoord = draggedElement.parentElement.getAttribute('data-coord');
                    let toCoord = targetSquare.getAttribute('data-coord');
                    const id = draggedElement.id;
                    tempFromCoord = fromCoord;
                    tempToCoord = toCoord;
                    draggedElement_2 = draggedElement;
                    // Проверяем, достигла ли пешка последней горизонтали
                      if (isPawnPromotion(fromCoord, toCoord, id)) {
                        // Показываем модальное окно для выбора фигуры
                        document.getElementById('promotionModal').style.display = 'block';

                        console.log(promotion +  " sdfsdf sfsdfsdf sdfs")
                        toCoord +=promotion
                      console.log(toCoord + " ikofhbhdgfhsjl")
                          promotion = None;

                      }



                    // Здесь AJAX запрос на сервер
                    fetch('http://127.0.0.1:8000/make_move', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCookie('csrftoken') // Получаем CSRF токен
                        },
                            body: JSON.stringify({from: fromCoord, to: toCoord,promo: promotion })

                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.move_made) {
                                console.log(data.chekmate)

                                // Если ход возможен, перемещаем фигуру
                                while (targetSquare.firstChild) {
                                    targetSquare.removeChild(targetSquare.firstChild); // Съединение фигуры
                                }
                                targetSquare.appendChild(draggedElement);
                                if (isCastling(fromCoord, toCoord, id)) // если рокировка
                                    {
                                      // Определяем начальную и конечную позиции ладьи в зависимости от toCoord
                                      let rookFrom, rookTo,num;
                                      if (toCoord === 'g1') {
                                        // Короткая рокировка для белых
                                        rookFrom = 'h1';
                                        rookTo = 'f1';
                                        num = 61
                                      } else if (toCoord === 'c1') {
                                        // Длинная рокировка для белых
                                        rookFrom = 'a1';
                                        rookTo = 'd1';
                                        num = 59
                                      } else if (toCoord === 'g8') {
                                        // Короткая рокировка для черных
                                        rookFrom = 'h8';
                                        rookTo = 'f8';
                                        num = 5
                                      } else if (toCoord === 'c8') {
                                        // Длинная рокировка для черных
                                        rookFrom = 'a8';
                                        rookTo = 'd8';
                                        num = 3
                                      }

                                      // Здесь ваш код для перемещения ладьи с rookFrom на rookTo
                                      // Удаляем ладью с начальной позиции
                                      const rookElement = document.querySelector(`[data-coord="${rookFrom}"] .chesspiece`);
                                      if (rookElement) {
                                        rookElement.parentElement.removeChild(rookElement);
                                      }

                                      // Рисуем ладью на новой позиции
                                      if(num > 10) // white or black
                                      {
                                          addPiece("rook_white",num)
                                      }
                                      else {addPiece("rook_black",num)}
                                      if (num == 3 || num == 59)
                                      {
                                          addMoveToStory("0-0-0");
                                      }
                                      else {addMoveToStory("0-0");}




                                    }

                                else {

                                    const moveString = fromCoord + toCoord; // Например, 'e2e4'
                                    addMoveToStory(moveString);
                                }
                                if(data.en_passant_move)
                                {

                                    removeEnPassantCapture(fromCoord,toCoord)
                                }
                                if(data.chekmate)
                                {
                                    showCheckmateModal("Шах и мат")
                                    end_of_game = true;
                                }
                                if(data.stalemate)
                                {
                                    showCheckmateModal("Пат")
                                    end_of_game = true;
                                }
                                if(data.is_insufficient_material)
                                {
                                    showCheckmateModal("Ничья")
                                    end_of_game = true;
                                }


                                } else {
                                console.log(data.message)
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        })
                        .finally(() => {
                            draggedElement.style.opacity = ''; // Возвращаем нормальную прозрачность
                            draggedElement = null; // Сбрасываем ссылку на перетаскиваемый элемент
                        });
                }
            });
        });


    }
        let moveNumber = 1; // Начальный номер хода
        let isWhiteTurn = true; // Флаг очереди хода белых

        function addMoveToStory(move) {
          // Получаем контейнер для истории ходов
          const storyElement = document.querySelector('.game-info .story');

          // Определяем, нужно ли создать новый элемент строки для хода
          let moveRow;
          if (isWhiteTurn || !storyElement.lastChild) {
            moveRow = document.createElement('div');
            moveRow.classList.add('move-row');
            storyElement.appendChild(moveRow);

            // Добавляем номер хода для новой строки
            const moveNumberElement = document.createElement('div');
            moveNumberElement.classList.add('move-number');
            moveNumberElement.textContent = moveNumber;
            moveRow.appendChild(moveNumberElement);

            moveNumber++; // Увеличиваем номер хода
          } else {
            // Если ход черных, используем последнюю строку
            moveRow = storyElement.lastChild;
          }

          // Создаем элемент для самого хода
          const moveElement = document.createElement('div');
          moveElement.classList.add('move', isWhiteTurn ? 'white' : 'black');
          moveElement.textContent = move;
          moveRow.appendChild(moveElement);
          // ...

            // Создаем псевдоэлемент разделитель, если ход черных
            if (!isWhiteTurn) {
              const separator = document.createElement('div');
              separator.classList.add('move-separator');
              moveRow.appendChild(separator);
            }

            // ...


          // Переключаем флаг очереди хода
          isWhiteTurn = !isWhiteTurn;
        }
        function showCheckmateModal(title) // вывод сообщениея об итогах игры
        {
            var modalTitle = document.getElementById('modalTitle');
            // Получаем модальное окно
              modalTitle.innerText = title;

            var modal = document.getElementById('checkmateModal');

            // Получаем элемент <span>, который закрывает модальное окно
            var closeButton = document.getElementsByClassName('close-button')[0];

            // Когда пользователь кликает на <span> (x), закрываем модальное окно
            closeButton.onclick = function() {
              modal.style.display = 'none';
            }
            // При нажатии вне модального окна, оно закроется
            window.onclick = function(event) {
              if (event.target == modal) {
                modal.style.display = 'none';
              }
            }
            modal.style.display = 'block';
        }
        function removePieceAtSquare(square) {
            const squareElement = document.querySelector(`[data-coord="${square}"]`);
            if (squareElement && squareElement.firstChild) {
                squareElement.removeChild(squareElement.firstChild);
            }
        }
        function removeEnPassantCapture(fromCoord, toCoord) {
            // Получаем столбец (файл) и горизонталь (ранг) из координаты конечного хода
            const toFile = toCoord[0]; // Например, 'd'
            let toRank = parseInt(toCoord[1], 10); // Например, 5

            // Определяем горизонталь съеденной пешки на основе направления хода
            if (fromCoord[1] > toCoord[1]) {
                // Для черных пешек, съеденная пешка находится на одну горизонталь выше
                toRank += 1;
            } else {
                // Для белых пешек, съеденная пешка находится на одну горизонталь ниже
                toRank -= 1;
            }

            // Строим координаты съеденной пешки
            const capturedPawnCoord = `${toFile}${toRank}`;

            // Удаляем съеденную пешку
            removePieceAtSquare(capturedPawnCoord);
        }
        function isPawnPromotion(fromCoord, toCoord, id)
        {
          // Проверяем, является ли элемент пешкой
          const isPawn = id.startsWith('pawn_');
          if (!isPawn) {
            return false;
          }

          // Определяем цвет пешки по ID
          const isWhite = id.includes('white');
          const isBlack = id.includes('black');

          // Получаем номер горизонтали из координаты конечного хода
          const rank = toCoord[1];

          // Проверяем, достигла ли пешка последней горизонтали
          if ((isWhite && rank === '8') || (isBlack && rank === '1')) {
            return true;
          }

          return false;
        }
    function sendMoveRequest(fromCoord, toCoord, promotion, draggedElement_2) {
    // Здесь AJAX запрос на сервер
    toCoord += promotion;
    fetch('http://127.0.0.1:8000/make_move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Получаем CSRF токен
        },
        body: JSON.stringify({from: fromCoord, to: toCoord, promo: promotion })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.move_made) {
            // Обработка случая, когда ход не выполнен
        } else {
            console.log(data.chekmate);

            // Если ход возможен, перемещаем фигуру
            while (targetSquare.firstChild) {
                targetSquare.removeChild(targetSquare.firstChild); // Съединение фигуры
            }
            targetSquare.appendChild(draggedElement_2);
            while (targetSquare.firstChild) {
                targetSquare.removeChild(targetSquare.firstChild); // Съединение фигуры
            }
            const moveString_2 = fromCoord + toCoord; // Например, 'e2e4'
            addMoveToStory(moveString_2);
            let num = getBoardIndex(toCoord[0], toCoord[1]);
            switch (toCoord[2]) {
                case 'r':
                    if (num > 10) {
                        addPiece("rook_black", num);
                    } else {
                        addPiece("rook_white", num);
                    }
                    break;
                case 'b':
                    if (num > 10) {
                        addPiece("bishop_black", num);
                    } else {
                        addPiece("bishop_white", num);
                    }
                    break;
                case 'q':
                    if (num > 10) {
                        addPiece("queen_black", num);
                    } else {
                        addPiece("queen_white", num);
                    }
                    break;
                case 'k':
                    if (num > 10) {
                        addPiece("knight_black", num);
                    } else {
                        addPiece("knight_white", num);
                    }
                    break;
                default:
                    break;
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        draggedElement_2.style.opacity = ''; // Возвращаем нормальную прозрачность
        draggedElement_2 = null; // Сбрасываем ссылку на перетаскиваемый элемент
    });
}

// Функция для получения значения CSRF токена
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        function getSquareIndex(file) {
                switch (file) {
                    case 'a':
                        return 0;
                    case 'b':
                        return 1;
                    case 'c':
                        return 2;
                    case 'd':
                        return 3;
                    case 'e':
                        return 4;
                    case 'f':
                        return 5;
                    case 'g':
                        return 6;
                    case 'h':
                        return 7;
                    default:
                        return -1; // Если введена неверная буква
                }
            }

            function getBoardIndex(file, rank) {
                const fileIndex = getSquareIndex(file);
                const rankIndex = 8 - parseInt(rank); // Переворачиваем ранг, так как шахматная доска инвертирована
                if (fileIndex >= 0 && fileIndex <= 7 && rankIndex >= 0 && rankIndex <= 7) {
                    return rankIndex * 8 + fileIndex;
                } else {
                    return -1; // Если введены неверные координаты
                }
            }

        function addPiece(piece, position) {
            const  pieceElement_2 = document.createElement('img');
            pieceElement_2.src = '/static/figures/' + piece + '.png';
            pieceElement_2.className = 'chesspiece';
            pieceElement_2.draggable = true;

            // Вычисляем координаты
            const x = 'abcdefgh'[position % 8];
            const y = 8 - Math.floor(position / 8);
            const coord = `${x}${y}`;

            // Устанавливаем id фигуры на основе её позиции
            const pieceId = `${piece}-${coord}`;
            pieceElement_2.id = pieceId;

            // Устанавливаем атрибут data-coord для фигуры
            pieceElement_2.setAttribute('data-coord', coord);
            makeDraggable(pieceElement_2);



            board.children[position].appendChild(pieceElement_2);
        }











    createChessBoard();
});