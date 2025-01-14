(function ($) {
    $.fn.virtualKeyboard = function () {
        var keyboardHtml = `
            <div class="keyboard">
                <div class="row">
                    <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <button class="btn btn-primary">Q</button>
                        <button class="btn btn-primary">W</button>
                        <button class="btn btn-primary">E</button>
                        <button class="btn btn-primary">R</button>
                        <button class="btn btn-primary">T</button>
                        <button class="btn btn-primary">Y</button>
                        <button class="btn btn-primary">U</button>
                        <button class="btn btn-primary">I</button>
                        <button class="btn btn-primary">O</button>
                        <button class="btn btn-primary">P</button>
                        <button class="btn btn-primary">A</button>
                        <button class="btn btn-primary">S</button>
                        <button class="btn btn-primary">D</button>
                        <button class="btn btn-primary">F</button>
                        <button class="btn btn-primary">G</button>
                        <button class="btn btn-primary">H</button>
                        <button class="btn btn-primary">J</button>
                        <button class="btn btn-primary">K</button>
                        <button class="btn btn-primary">L</button>
                        <button class="btn btn-primary">Z</button>
                        <button class="btn btn-primary">X</button>
                        <button class="btn btn-primary">C</button>
                        <button class="btn btn-primary">V</button>
                        <button class="btn btn-primary">B</button>
                        <button class="btn btn-primary">N</button>
                        <button class="btn btn-primary">M</button>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 numbers">
                        <button class="btn btn-primary">1</button>
                        <button class="btn btn-primary">2</button>
                        <button class="btn btn-primary">3</button>
                        <button class="btn btn-primary">4</button>
                        <button class="btn btn-primary">5</button>
                        <button class="btn btn-primary">6</button>
                        <button class="btn btn-primary">7</button>
                        <button class="btn btn-primary">8</button>
                        <button class="btn btn-primary">9</button>
                        <button class="btn btn-primary">0</button>
                        <button class="btn btn-primary">.</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <button class="btn btn-primary">@</button>
                        <button class="btn btn-primary">&</button>
                        <button class="btn btn-primary">(</button>
                        <button class="btn btn-primary">)</button>
                        <button class="btn btn-primary">;</button>
                        <button class="btn btn-primary">:</button>
                        <button class="btn btn-primary">'</button>
                        <button class="btn btn-primary">"</button>
                        <button class="btn btn-primary">?</button>
                        <button class="btn btn-primary">,</button>
                        <button class="btn btn-primary">*</button>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 numbers"></div>
                </div>
                <div class="row">
                    <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <button class="btn btn-danger" id="backspace">⌫</button>
                        <button class="btn btn-success spaceButton" id="space">[ ]</button>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 numbers"></div>
                </div>
            </div>`;

        var $keyboard = $(keyboardHtml).appendTo('body');

        this.on('focus', function () {
            var $inputField = $(this);
            var offset = $inputField.offset();
            var inputHeight = $inputField.outerHeight();

            $keyboard.css({
                top: offset.top + inputHeight,
                left: offset.left
            }).show();

            $keyboard.find('button').off('click').on('click', function () {
                var currentValue = $inputField.val();
                var buttonValue = $(this).text();

                if (buttonValue === '[ ]') {
                    $inputField.val(currentValue + ' ');
                } else if (buttonValue === '⌫') {
                    $inputField.val(currentValue.slice(0, -1));
                } else {
                    $inputField.val(currentValue + buttonValue);
                }
                $inputField.focus(); // keep focus on the input field
            });

            /*$(document).on('click', function (e) {
                if (!$(e.target).closest($keyboard).length && !$(e.target).closest($inputField).length) {
                    $keyboard.hide();
                }
            });*/
        });

        /*this.on('blur', function () {
            setTimeout(function () {
                if (!$(':focus').closest('.keyboard').length) {
                    $keyboard.hide();
                }
            }, 200);
        });*/

        return this;
    };
}(jQuery));