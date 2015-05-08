//flip

      function flip(board_id, content){
        this.rows     = 5;
        this.letters  = 20;

        this.board    = document.getElementById(board_id);
        this.chars    = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
        this.content  = content;
        this.c        = 0;

        this.current_row    = 0;
        this.row_animations = 0;

        //data store representing the board dom (don't read the dom for data)
        this.data     = [];

        this.templates = {
          row: document.getElementById('template_row').innerHTML,
          letter: document.getElementById('template_letter').innerHTML
        };

        this.initialize_loop();
        this.build_board();
        this.seed_row();
        this.flip_row();
      }

      
      flip.prototype.initialize_loop = function(){
        var that = this;

        //after each animationIteration...
        this.board.addEventListener('webkitAnimationIteration', function(e){
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
            that.row_animations--;

            if(that.row_animations == 0){
              setTimeout(function(){
                that.flip_next_row();
              }, 5000);
            }
            return;
          }

          //get ready to show "the next letter" (as the animation runs, this letter is revealed)
          letter.querySelector('.top').innerHTML  = next;
          letter.querySelector('.back').innerHTML = next;

          //increment the letter
          oletter.current = next;
          e.target.parentNode.style.webkitAnimationPlayState  = 'running';
        });
      };

      flip.prototype.build_board= function(){
        var board = this.board,
            _elr  = document.createElement('div'),
            _ell  = document.createElement('div'),
            _row, _letter, lid;

        //clear the board and reset data
        board.innerHTML = '';
        data = [];

        //set up "row" and "letter" elements
        _elr.innerHTML = this.templates.row;
        _ell.innerHTML = this.templates.letter;

        _elr = _elr.firstElementChild;
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
              target: '-',
              current: '-',
              el: null
            };  

            //in dom
            lid = [r,l].join('_');
            _letter = _ell.cloneNode(true);
            _letter.setAttribute('id', lid);

            this.data[r][l].el = _letter;
            _row.appendChild( _letter );
          }
        }
      };


      flip.prototype.render_letter = function(r,l){
        var o    = this.data[r][l],
            el   = o.el,
            next = this.get_next_char(o);

        el.querySelector('.top').innerHTML = next;
        el.querySelector('.back').innerHTML = next;
        el.querySelector('.front').innerHTML = o.current;
        el.querySelector('.bottom').innerHTML = o.current;

        o.current = next;
      };


      flip.prototype.get_next_char = function(o){
        var current_index = this.chars.indexOf(o.current.toUpperCase()),
            next =  (current_index == this.chars.length -1) ? this.chars[0] : this.chars[current_index + 1]; 
        return next;
      };

      flip.prototype.seed_row = function(){
        //reset row_animations
        this.row_animations = 0;

        var text = this.sanitize_text(this.content[this.c]);

        for(var l = 0; l < this.letters; l++){
          if(text.charAt(l) !== this.data[this.current_row][l].target){
            this.data[this.current_row][l].target = text.charAt(l);
            this.row_animations++;
          }
        }

        this.c++;
        if(this.c == this.content.length){
          this.c = 0;
        }
      };

      flip.prototype.sanitize_text = function(text){
        //default text to empty string
        text = (text || '');

        //fixme: this regex should match this.chars
        //remove any unwanted letters
        text = text.replace(/[^a-zA-Z0-9 -]/g, '').toUpperCase();

        //pad the string, so the number of chars == this.letters
        while(text.length < this.letters){
          text += ' ';
        };

        //text.length should equal this.letters (trim the string to fit the grid) 
        text = text.substring(0, this.letters);
        return text;
      };

      flip.prototype.flip_row = function(){
        var oletter, row = this.current_row;

        for(var l = 0; l < this.letters; l++){
          oletter = this.data[row][l];

          if(oletter.current !== oletter.target){
          oletter.el.className = "letter flipflap";
          }
        }
      };

      flip.prototype.flip_next_row = function(){
        this.current_row++;
        if(this.current_row == this.rows){
          this.current_row = 0;
        }
        this.seed_row();
        this.flip_row();
      };
