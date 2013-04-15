//flip

      function flip(board_id, content){
        this.rows = 5;
        this.letters = 20;

        this.board = document.getElementById(board_id);
        this.content = content;
        this.c = 0;

        this.templates = {
          row: document.getElementById('template_row').innerHTML,
          letter: document.getElementById('template_letter').innerHTML
        };

        //data store representing the board dom (don't read the dom for data)
        this.data = [];

        this.chars = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";


        this.initialize_loop();
        this.build_board();
        this.update_board();
      }

      
      flip.prototype.initialize_loop = function(){
        var that = this;

        //after each animationIteration...
        this.board.addEventListener('webkitAnimationIteration', function(e){
          //console.group('animationiteration');
          e.target.parentNode.style.webkitAnimationPlayState  = 'paused';

          var letter     = e.target.parentNode,
              idx        = letter.getAttribute('id').split('_'),
              oletter    = that.data[idx[0]][idx[1]],
              next, target, current;

              next    = that.get_next_char(oletter);
              target  = oletter.target;
              current = oletter.current;


          //"flatten things out"; show the current char -- get ready for next loop
          letter.querySelector('.bottom').innerHTML = current;
          letter.querySelector('.front').innerHTML  = current;

          //if the target char is showing, stop
          if(oletter.current == oletter.target){
            letter.className = "letter";
            //console.log(current);
            //console.groupEnd();
            return;
          }
          
          
          //get ready to show "the next letter" (as the animation runs, this letter is revealed)
          letter.querySelector('.top').innerHTML  = next;
          letter.querySelector('.back').innerHTML = next;

          //increment the letter
          oletter.current = next;
          e.target.parentNode.style.webkitAnimationPlayState  = 'running';
          //console.log(e.elapsedTime);
          //console.groupEnd();

        });
      };

      flip.prototype.build_board= function(){
        //console.log('in build board');
        var board = this.board,
            _elr = document.createElement('div'),
            _ell = document.createElement('div'),
            _row, _letter, lid;


        //clear the board
        board.innerHTML = '';
        data = [];


        //set up "row" element
        _elr.innerHTML = this.templates.row;
        _elr = _elr.firstElementChild;
        _ell.innerHTML = this.templates.letter;
        _ell = _ell.firstElementChild;


        //build rows and letters in memory
        for(var r = 0; r < this.rows; r++){
          //in data
          this.data.push(new Array(this.letters));

          //in dom
          _row = _elr.cloneNode(true);
          board.appendChild( _row );

          for(var l = 0; l < this.letters; l++){
            //in data
            this.data[r][l] = {
              target: ' ',
              current: '-',
              el: null
            };  

            //in dom
            lid = [r,l].join('_');
            _letter = _ell.cloneNode(true);
            _letter.setAttribute('id', lid);

            this.data[r][l].el = _letter;
            _row.appendChild( _letter );

            //console.log('building board, about to render_letter');
            //console.log(this.data[r][l]);

            //this.render_letter(r,l)

          }
        }
        
        //console.log(this.board);
      };


      flip.prototype.render_letter = function(r,l){
        var o = this.data[r][l],

            el = o.el,
            next = this.get_next_char(o);

        el.querySelector('.top').innerHTML = next;
        el.querySelector('.back').innerHTML = next;

        el.querySelector('.front').innerHTML = o.current;
        el.querySelector('.bottom').innerHTML = o.current;

        o.current = next;

        el.className = 'letter flipflap';
      };

      flip.prototype.get_next_char = function(o){
        var current_index = this.chars.indexOf(o.current.toUpperCase()),
            next =  (current_index == this.chars.length -1) ? this.chars[0] : this.chars[current_index + 1]; 

        return next;
      };

      flip.prototype.update_board = function(){
        var text;
        for(var r = 0; r < this.rows; r++){
          text = this.sanitize_text(this.content[this.c])
          this.c++;
          if(this.c == this.content.length){
            this.c = 0;
          }
          for(var l = 0; l < this.letters; l++){
            this.data[r][l].target = text.charAt(l);

            //console.log('update_board, about to render_letter');

            if(this.data[r][l].target == this.data[r][l].current){continue};
            this.render_letter(r,l);
          }
        }
      };

      flip.prototype.sanitize_text = function(text){
        //default text to empty string
        text = (text || '');

        //fixme: this regex should match this.chars
        //remove any unwanted letters
        text = text.replace(/[^a-zA-Z0-9 -]/g, '').toUpperCase();
        //console.log(text);

        //pad the string, so the number of chars == this.letters
        while(text.length < this.letters){
          text += ' ';
        };

        //text.length should equal this.letters (trim the string to fit the grid) 
        text = text.substring(0, this.letters);
        return text;
      };
