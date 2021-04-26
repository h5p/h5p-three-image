var H5P = H5P || {};

/**
 * Class responsible for creating a help text dialog
 */
H5P.JoubelHelpTextDialog = (function ($) {

  var numInstances = 0;
  /**
   * Display a pop-up containing a message.
   *
   * @param {H5P.jQuery}  $container  The container which message dialog will be appended to
   * @param {string}      message     The message
   * @param {string}      closeButtonTitle The title for the close button
   * @return {H5P.jQuery}
   */
  function JoubelHelpTextDialog(header, message, closeButtonTitle) {
    H5P.EventDispatcher.call(this);

    var self = this;

    numInstances++;
    var headerId = 'joubel-help-text-header-' + numInstances;
    var helpTextId = 'joubel-help-text-body-' + numInstances;

    var $helpTextDialogBox = $('<div>', {
      'class': 'joubel-help-text-dialog-box',
      'role': 'dialog',
      'aria-labelledby': headerId,
      'aria-describedby': helpTextId
    });

    $('<div>', {
      'class': 'joubel-help-text-dialog-background'
    }).appendTo($helpTextDialogBox);

    var $helpTextDialogContainer = $('<div>', {
      'class': 'joubel-help-text-dialog-container'
    }).appendTo($helpTextDialogBox);

    $('<div>', {
      'class': 'joubel-help-text-header',
      'id': headerId,
      'role': 'header',
      'html': header
    }).appendTo($helpTextDialogContainer);

    $('<div>', {
      'class': 'joubel-help-text-body',
      'id': helpTextId,
      'html': message,
      'role': 'document',
      'tabindex': 0
    }).appendTo($helpTextDialogContainer);

    var handleClose = function () {
      $helpTextDialogBox.remove();
      self.trigger('closed');
    };

    var $closeButton = $('<div>', {
      'class': 'joubel-help-text-remove',
      'role': 'button',
      'title': closeButtonTitle,
      'tabindex': 1,
      'click': handleClose,
      'keydown': function (event) {
        // 32 - space, 13 - enter
        if ([32, 13].indexOf(event.which) !== -1) {
          event.preventDefault();
          handleClose();
        }
      }
    }).appendTo($helpTextDialogContainer);

    /**
     * Get the DOM element
     * @return {HTMLElement}
     */
    self.getElement = function () {
      return $helpTextDialogBox;
    };

    self.focus = function () {
      $closeButton.focus();
    };
  }

  JoubelHelpTextDialog.prototype = Object.create(H5P.EventDispatcher.prototype);
  JoubelHelpTextDialog.prototype.constructor = JoubelHelpTextDialog;

  return JoubelHelpTextDialog;
}(H5P.jQuery));
var H5P = H5P || {};

/**
 * Class responsible for creating auto-disappearing dialogs
 */
H5P.JoubelMessageDialog = (function ($) {

  /**
   * Display a pop-up containing a message.
   *
   * @param {H5P.jQuery} $container The container which message dialog will be appended to
   * @param {string} message The message
   * @return {H5P.jQuery}
   */
  function JoubelMessageDialog ($container, message) {
    var timeout;

    var removeDialog = function () {
      $warning.remove();
      clearTimeout(timeout);
      $container.off('click.messageDialog');
    };

    // Create warning popup:
    var $warning = $('<div/>', {
      'class': 'joubel-message-dialog',
      text: message
    }).appendTo($container);

    // Remove after 3 seconds or if user clicks anywhere in $container:
    timeout = setTimeout(removeDialog, 3000);
    $container.on('click.messageDialog', removeDialog);

    return $warning;
  }

  return JoubelMessageDialog;
})(H5P.jQuery);
var H5P = H5P || {};

/**
 * Class responsible for creating a circular progress bar
 */

H5P.JoubelProgressCircle = (function ($) {

  /**
   * Constructor for the Progress Circle
   *
   * @param {Number} number The amount of progress to display
   * @param {string} progressColor Color for the progress meter
   * @param {string} backgroundColor Color behind the progress meter
   */
  function ProgressCircle(number, progressColor, fillColor, backgroundColor) {
    progressColor = progressColor || '#1a73d9';
    fillColor = fillColor || '#f0f0f0';
    backgroundColor = backgroundColor || '#ffffff';
    var progressColorRGB = this.hexToRgb(progressColor);

    //Verify number
    try {
      number = Number(number);
      if (number === '') {
        throw 'is empty';
      }
      if (isNaN(number)) {
        throw 'is not a number';
      }
    } catch (e) {
      number = 'err';
    }

    //Draw circle
    if (number > 100) {
      number = 100;
    }

    // We can not use rgba, since they will stack on top of each other.
    // Instead we create the equivalent of the rgba color
    // and applies this to the activeborder and background color.
    var progressColorString = 'rgb(' + parseInt(progressColorRGB.r, 10) +
      ',' + parseInt(progressColorRGB.g, 10) +
      ',' + parseInt(progressColorRGB.b, 10) + ')';

    // Circle wrapper
    var $wrapper = $('<div/>', {
      'class': "joubel-progress-circle-wrapper"
    });

    //Active border indicates progress
    var $activeBorder = $('<div/>', {
      'class': "joubel-progress-circle-active-border"
    }).appendTo($wrapper);

    //Background circle
    var $backgroundCircle = $('<div/>', {
      'class': "joubel-progress-circle-circle"
    }).appendTo($activeBorder);

    //Progress text/number
    $('<span/>', {
      'text': number + '%',
      'class': "joubel-progress-circle-percentage"
    }).appendTo($backgroundCircle);

    var deg = number * 3.6;
    if (deg <= 180) {
      $activeBorder.css('background-image',
        'linear-gradient(' + (90 + deg) + 'deg, transparent 50%, ' + fillColor + ' 50%),' +
        'linear-gradient(90deg, ' + fillColor + ' 50%, transparent 50%)')
        .css('border', '2px solid' + backgroundColor)
        .css('background-color', progressColorString);
    } else {
      $activeBorder.css('background-image',
        'linear-gradient(' + (deg - 90) + 'deg, transparent 50%, ' + progressColorString + ' 50%),' +
        'linear-gradient(90deg, ' + fillColor + ' 50%, transparent 50%)')
        .css('border', '2px solid' + backgroundColor)
        .css('background-color', progressColorString);
    }

    this.$activeBorder = $activeBorder;
    this.$backgroundCircle = $backgroundCircle;
    this.$wrapper = $wrapper;

    this.initResizeFunctionality();

    return $wrapper;
  }

  /**
   * Initializes resize functionality for the progress circle
   */
  ProgressCircle.prototype.initResizeFunctionality = function () {
    var self = this;

    $(window).resize(function () {
      // Queue resize
      setTimeout(function () {
        self.resize();
      });
    });

    // First resize
    setTimeout(function () {
      self.resize();
    }, 0);
  };

  /**
   * Resize function makes progress circle grow or shrink relative to parent container
   */
  ProgressCircle.prototype.resize = function () {
    var $parent = this.$wrapper.parent();

    if ($parent !== undefined && $parent) {

      // Measurements
      var fontSize = parseInt($parent.css('font-size'), 10);

      // Static sizes
      var fontSizeMultiplum = 3.75;
      var progressCircleWidthPx = parseInt((fontSize / 4.5), 10) % 2 === 0 ? parseInt((fontSize / 4.5), 10) + 4 : parseInt((fontSize / 4.5), 10) + 5;
      var progressCircleOffset = progressCircleWidthPx / 2;

      var width = fontSize * fontSizeMultiplum;
      var height = fontSize * fontSizeMultiplum;
      this.$activeBorder.css({
        'width': width,
        'height': height
      });

      this.$backgroundCircle.css({
        'width': width - progressCircleWidthPx,
        'height': height - progressCircleWidthPx,
        'top': progressCircleOffset,
        'left': progressCircleOffset
      });
    }
  };

  /**
   * Hex to RGB conversion
   * @param hex
   * @returns {{r: Number, g: Number, b: Number}}
   */
  ProgressCircle.prototype.hexToRgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return ProgressCircle;

}(H5P.jQuery));
var H5P = H5P || {};

H5P.JoubelProgressbar = (function ($) {

  /**
   * Joubel progressbar class
   * @method JoubelProgressbar
   * @constructor
   * @param  {number}          steps Number of steps
   * @param {Object} [options] Additional options
   * @param {boolean} [options.disableAria] Disable readspeaker assistance
   * @param {string} [options.progressText] A progress text for describing
   *  current progress out of total progress for readspeakers.
   *  e.g. "Slide :num of :total"
   */
  function JoubelProgressbar(steps, options) {
    H5P.EventDispatcher.call(this);
    var self = this;
    this.options = $.extend({
      progressText: 'Slide :num of :total'
    }, options);
    this.currentStep = 0;
    this.steps = steps;

    this.$progressbar = $('<div>', {
      'class': 'h5p-joubelui-progressbar',
      on: {
        click: function () {
          self.toggleTooltip();
          return false;
        },
        mouseenter: function () {
          self.showTooltip();
        },
        mouseleave: function () {
          setTimeout(function () {
            self.hideTooltip();
          }, 1500);
        }
      }
    });
    this.$background = $('<div>', {
      'class': 'h5p-joubelui-progressbar-background'
    }).appendTo(this.$progressbar);

    $('body').click(function () {
      self.toggleTooltip(true);
    });
  }

  JoubelProgressbar.prototype = Object.create(H5P.EventDispatcher.prototype);
  JoubelProgressbar.prototype.constructor = JoubelProgressbar;

  /**
   * Display tooltip
   * @method showTooltip
   */
  JoubelProgressbar.prototype.showTooltip = function () {
    var self = this;

    if (this.currentStep === 0 || this.tooltip !== undefined) {
      return;
    }

    var parentWidth = self.$progressbar.offset().left + self.$progressbar.width();

    this.tooltip = new H5P.Drop({
      target: this.$background.get(0),
      content: this.currentStep + '/' + this.steps,
      classes: 'drop-theme-arrows-bounce h5p-joubelui-drop',
      position: 'top right',
      openOn: 'always',
      tetherOptions: {
        attachment: 'bottom center',
        targetAttachment: 'top right'
      }
    });
    this.tooltip.on('open', function () {
      var $drop = $(self.tooltip.drop);
      var left = $drop.position().left;
      var dropWidth = $drop.width();

      // Need to handle drops getting outside of the progressbar:
      if (left < 0) {
        $drop.css({marginLeft: (-left) + 'px'});
      }
      else if (left + dropWidth > parentWidth) {
        $drop.css({marginLeft: (parentWidth - (left + dropWidth)) + 'px'});
      }
    });
  };

  JoubelProgressbar.prototype.updateAria = function () {
    var self = this;
    if (this.options.disableAria) {
      return;
    }

    if (!this.$currentStatus) {
      this.$currentStatus = $('<div>', {
        'class': 'h5p-joubelui-progressbar-slide-status-text',
        'aria-live': 'assertive'
      }).appendTo(this.$progressbar);
    }
    var interpolatedProgressText = self.options.progressText
      .replace(':num', self.currentStep)
      .replace(':total', self.steps);
    this.$currentStatus.html(interpolatedProgressText);
  };

  /**
   * Hides tooltip
   * @method hideTooltip
   */
  JoubelProgressbar.prototype.hideTooltip = function () {
    if (this.tooltip !== undefined) {
      this.tooltip.remove();
      this.tooltip.destroy();
      this.tooltip = undefined;
    }
  };

  /**
   * Toggles tooltip-visibility
   * @method toggleTooltip
   * @param  {boolean} [closeOnly] Don't show, only close if open
   */
  JoubelProgressbar.prototype.toggleTooltip = function (closeOnly) {
    if (this.tooltip === undefined && !closeOnly) {
      this.showTooltip();
    }
    else if (this.tooltip !== undefined) {
      this.hideTooltip();
    }
  };

  /**
   * Appends to a container
   * @method appendTo
   * @param  {H5P.jquery} $container
   */
  JoubelProgressbar.prototype.appendTo = function ($container) {
    this.$progressbar.appendTo($container);
  };

  /**
   * Update progress
   * @method setProgress
   * @param  {number}    step
   */
  JoubelProgressbar.prototype.setProgress = function (step) {
    // Check for valid value:
    if (step > this.steps || step < 0) {
      return;
    }
    this.currentStep = step;
    this.$background.css({
      width: ((this.currentStep/this.steps)*100) + '%'
    });

    this.updateAria();
  };

  /**
   * Increment progress with 1
   * @method next
   */
  JoubelProgressbar.prototype.next = function () {
    this.setProgress(this.currentStep+1);
  };

  /**
   * Reset progressbar
   * @method reset
   */
  JoubelProgressbar.prototype.reset = function () {
    this.setProgress(0);
  };

  /**
   * Check if last step is reached
   * @method isLastStep
   * @return {Boolean}
   */
  JoubelProgressbar.prototype.isLastStep = function () {
    return this.steps === this.currentStep;
  };

  return JoubelProgressbar;
})(H5P.jQuery);
var H5P = H5P || {};

/**
 * @module
 */
H5P.JoubelScoreBar = (function ($) {

  /* Need to use an id for the star SVG since that is the only way to reference
     SVG filters  */
  var idCounter = 0;

  /**
   * Creates a score bar
   * @class H5P.JoubelScoreBar
   * @param {number} maxScore  Maximum score
   * @param {string} [label] Makes it easier for readspeakers to identify the scorebar
   * @param {string} [helpText] Score explanation
   * @param {string} [scoreExplanationButtonLabel] Label for score explanation button
   */
  function JoubelScoreBar(maxScore, label, helpText, scoreExplanationButtonLabel) {
    var self = this;

    self.maxScore = maxScore;
    self.score = 0;
    idCounter++;

    /**
     * @const {string}
     */
    self.STAR_MARKUP = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.77 53.87" aria-hidden="true" focusable="false">' +
        '<title>star</title>' +
        '<filter id="h5p-joubelui-score-bar-star-inner-shadow-' + idCounter + '" x0="-50%" y0="-50%" width="200%" height="200%">' +
          '<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur>' +
          '<feOffset dy="2" dx="4"></feOffset>' +
          '<feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>' +
          '<feFlood flood-color="#ffe95c" flood-opacity="1"></feFlood>' +
          '<feComposite in2="shadowDiff" operator="in"></feComposite>' +
          '<feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite>' +
          '<feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur>' +
          '<feOffset dy="-2" dx="-4"></feOffset>' +
          '<feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>' +
          '<feFlood flood-color="#ffe95c" flood-opacity="1"></feFlood>' +
          '<feComposite in2="shadowDiff" operator="in"></feComposite>' +
          '<feComposite in2="firstfilter" operator="over"></feComposite>' +
        '</filter>' +
        '<path class="h5p-joubelui-score-bar-star-shadow" d="M35.08,43.41V9.16H20.91v0L9.51,10.85,9,10.93C2.8,12.18,0,17,0,21.25a11.22,11.22,0,0,0,3,7.48l8.73,8.53-1.07,6.16Z"/>' +
        '<g>' +
          '<path class="h5p-joubelui-score-bar-star-border" d="M61.36,22.8,49.72,34.11l2.78,16a2.6,2.6,0,0,1,.05.64c0,.85-.37,1.6-1.33,1.6A2.74,2.74,0,0,1,49.94,52L35.58,44.41,21.22,52a2.93,2.93,0,0,1-1.28.37c-.91,0-1.33-.75-1.33-1.6,0-.21.05-.43.05-.64l2.78-16L9.8,22.8A2.57,2.57,0,0,1,9,21.25c0-1,1-1.33,1.81-1.49l16.07-2.35L34.09,2.83c.27-.59.85-1.33,1.55-1.33s1.28.69,1.55,1.33l7.21,14.57,16.07,2.35c.75.11,1.81.53,1.81,1.49A3.07,3.07,0,0,1,61.36,22.8Z"/>' +
          '<path class="h5p-joubelui-score-bar-star-fill" d="M61.36,22.8,49.72,34.11l2.78,16a2.6,2.6,0,0,1,.05.64c0,.85-.37,1.6-1.33,1.6A2.74,2.74,0,0,1,49.94,52L35.58,44.41,21.22,52a2.93,2.93,0,0,1-1.28.37c-.91,0-1.33-.75-1.33-1.6,0-.21.05-.43.05-.64l2.78-16L9.8,22.8A2.57,2.57,0,0,1,9,21.25c0-1,1-1.33,1.81-1.49l16.07-2.35L34.09,2.83c.27-.59.85-1.33,1.55-1.33s1.28.69,1.55,1.33l7.21,14.57,16.07,2.35c.75.11,1.81.53,1.81,1.49A3.07,3.07,0,0,1,61.36,22.8Z"/>' +
          '<path filter="url(#h5p-joubelui-score-bar-star-inner-shadow-' + idCounter + ')" class="h5p-joubelui-score-bar-star-fill-full-score" d="M61.36,22.8,49.72,34.11l2.78,16a2.6,2.6,0,0,1,.05.64c0,.85-.37,1.6-1.33,1.6A2.74,2.74,0,0,1,49.94,52L35.58,44.41,21.22,52a2.93,2.93,0,0,1-1.28.37c-.91,0-1.33-.75-1.33-1.6,0-.21.05-.43.05-.64l2.78-16L9.8,22.8A2.57,2.57,0,0,1,9,21.25c0-1,1-1.33,1.81-1.49l16.07-2.35L34.09,2.83c.27-.59.85-1.33,1.55-1.33s1.28.69,1.55,1.33l7.21,14.57,16.07,2.35c.75.11,1.81.53,1.81,1.49A3.07,3.07,0,0,1,61.36,22.8Z"/>' +
        '</g>' +
      '</svg>';

    /**
     * @function appendTo
     * @memberOf H5P.JoubelScoreBar#
     * @param {H5P.jQuery}  $wrapper  Dom container
     */
    self.appendTo = function ($wrapper) {
      self.$scoreBar.appendTo($wrapper);
    };

    /**
     * Create the text representation of the scorebar .
     *
     * @private
     * @return {string}
     */
    var createLabel = function (score) {
      if (!label) {
        return '';
      }

      return label.replace(':num', score).replace(':total', self.maxScore);
    };

    /**
     * Creates the html for this widget
     *
     * @method createHtml
     * @private
     */
    var createHtml = function () {
      // Container div
      self.$scoreBar = $('<div>', {
        'class': 'h5p-joubelui-score-bar',
      });

      var $visuals = $('<div>', {
        'class': 'h5p-joubelui-score-bar-visuals',
        appendTo: self.$scoreBar
      });

      // The progress bar wrapper
      self.$progressWrapper = $('<div>', {
        'class': 'h5p-joubelui-score-bar-progress-wrapper',
        appendTo: $visuals
      });

      self.$progress = $('<div>', {
        'class': 'h5p-joubelui-score-bar-progress',
        'html': createLabel(self.score),
        appendTo: self.$progressWrapper
      });

      // The star
      $('<div>', {
        'class': 'h5p-joubelui-score-bar-star',
        html: self.STAR_MARKUP
      }).appendTo($visuals);

      // The score container
      var $numerics = $('<div>', {
        'class': 'h5p-joubelui-score-numeric',
        appendTo: self.$scoreBar,
        'aria-hidden': true
      });

      // The current score
      self.$scoreCounter = $('<span>', {
        'class': 'h5p-joubelui-score-number h5p-joubelui-score-number-counter',
        text: 0,
        appendTo: $numerics
      });

      // The separator
      $('<span>', {
        'class': 'h5p-joubelui-score-number-separator',
        text: '/',
        appendTo: $numerics
      });

      // Max score
      self.$maxScore = $('<span>', {
        'class': 'h5p-joubelui-score-number h5p-joubelui-score-max',
        text: self.maxScore,
        appendTo: $numerics
      });

      if (helpText) {
        H5P.JoubelUI.createTip(helpText, {
          tipLabel: scoreExplanationButtonLabel ? scoreExplanationButtonLabel : helpText,
          helpIcon: true
        }).appendTo(self.$scoreBar);
        self.$scoreBar.addClass('h5p-score-bar-has-help');
      }
    };

    /**
     * Set the current score
     * @method setScore
     * @memberOf H5P.JoubelScoreBar#
     * @param  {number} score
     */
    self.setScore = function (score) {
      // Do nothing if score hasn't changed
      if (score === self.score) {
        return;
      }
      self.score = score > self.maxScore ? self.maxScore : score;
      self.updateVisuals();
    };

    /**
     * Increment score
     * @method incrementScore
     * @memberOf H5P.JoubelScoreBar#
     * @param  {number=}        incrementBy Optional parameter, defaults to 1
     */
    self.incrementScore = function (incrementBy) {
      self.setScore(self.score + (incrementBy || 1));
    };

    /**
     * Set the max score
     * @method setMaxScore
     * @memberOf H5P.JoubelScoreBar#
     * @param  {number}    maxScore The max score
     */
    self.setMaxScore = function (maxScore) {
      self.maxScore = maxScore;
    };

    /**
     * Updates the progressbar visuals
     * @memberOf H5P.JoubelScoreBar#
     * @method updateVisuals
     */
    self.updateVisuals = function () {
      self.$progress.html(createLabel(self.score));
      self.$scoreCounter.text(self.score);
      self.$maxScore.text(self.maxScore);

      setTimeout(function () {
        // Start the progressbar animation
        self.$progress.css({
          width: ((self.score / self.maxScore) * 100) + '%'
        });

        H5P.Transition.onTransitionEnd(self.$progress, function () {
          // If fullscore fill the star and start the animation
          self.$scoreBar.toggleClass('h5p-joubelui-score-bar-full-score', self.score === self.maxScore);
          self.$scoreBar.toggleClass('h5p-joubelui-score-bar-animation-active', self.score === self.maxScore);

          // Only allow the star animation to run once
          self.$scoreBar.one("animationend", function() {
            self.$scoreBar.removeClass("h5p-joubelui-score-bar-animation-active");
          });
        }, 600);
      }, 300);
    };

    /**
     * Removes all classes
     * @method reset
     */
    self.reset = function () {
      self.$scoreBar.removeClass('h5p-joubelui-score-bar-full-score');
    };

    createHtml();
  }

  return JoubelScoreBar;
})(H5P.jQuery);
var H5P = H5P || {};

H5P.SimpleRoundedButton = (function ($) {

  /**
   * Creates a new tip
   */
  function SimpleRoundedButton(text) {

    var $simpleRoundedButton = $('<div>', {
      'class': 'joubel-simple-rounded-button',
      'title': text,
      'role': 'button',
      'tabindex': '0'
    }).keydown(function (e) {
      // 32 - space, 13 - enter
      if ([32, 13].indexOf(e.which) !== -1) {
        $(this).click();
        e.preventDefault();
      }
    });

    $('<span>', {
      'class': 'joubel-simple-rounded-button-text',
      'html': text
    }).appendTo($simpleRoundedButton);

    return $simpleRoundedButton;
  }

  return SimpleRoundedButton;
}(H5P.jQuery));
var H5P = H5P || {};

H5P.JoubelSlider = (function ($) {

  /**
   * Creates a new Slider
   *
   * @param {object} [params] Additional parameters
   */
  function JoubelSlider(params) {
    H5P.EventDispatcher.call(this);

    this.$slider = $('<div>', $.extend({
      'class': 'h5p-joubel-ui-slider'
    }, params));

    this.$slides = [];
    this.currentIndex = 0;
    this.numSlides = 0;
  }
  JoubelSlider.prototype = Object.create(H5P.EventDispatcher.prototype);
  JoubelSlider.prototype.constructor = JoubelSlider;

  JoubelSlider.prototype.addSlide = function ($content) {
    $content.addClass('h5p-joubel-ui-slide').css({
      'left': (this.numSlides*100) + '%'
    });
    this.$slider.append($content);
    this.$slides.push($content);

    this.numSlides++;

    if(this.numSlides === 1) {
      $content.addClass('current');
    }
  };

  JoubelSlider.prototype.attach = function ($container) {
    $container.append(this.$slider);
  };

  JoubelSlider.prototype.move = function (index) {
    var self = this;

    if(index === 0) {
      self.trigger('first-slide');
    }
    if(index+1 === self.numSlides) {
      self.trigger('last-slide');
    }
    self.trigger('move');

    var $previousSlide = self.$slides[this.currentIndex];
    H5P.Transition.onTransitionEnd(this.$slider, function () {
      $previousSlide.removeClass('current');
      self.trigger('moved');
    });
    this.$slides[index].addClass('current');

    var translateX = 'translateX(' + (-index*100) + '%)';
    this.$slider.css({
      '-webkit-transform': translateX,
      '-moz-transform': translateX,
      '-ms-transform': translateX,
      'transform': translateX
    });

    this.currentIndex = index;
  };

  JoubelSlider.prototype.remove = function () {
    this.$slider.remove();
  };

  JoubelSlider.prototype.next = function () {
    if(this.currentIndex+1 >= this.numSlides) {
      return;
    }

    this.move(this.currentIndex+1);
  };

  JoubelSlider.prototype.previous = function () {
    this.move(this.currentIndex-1);
  };

  JoubelSlider.prototype.first = function () {
    this.move(0);
  };

  JoubelSlider.prototype.last = function () {
    this.move(this.numSlides-1);
  };

  return JoubelSlider;
})(H5P.jQuery);
var H5P = H5P || {};

/**
 * Class responsible for creating speech bubbles
 */
H5P.JoubelSpeechBubble = (function ($) {

  var $currentSpeechBubble;
  var $currentContainer;  
  var $tail;
  var $innerTail;
  var removeSpeechBubbleTimeout;
  var currentMaxWidth;

  var DEFAULT_MAX_WIDTH = 400;

  var iDevice = navigator.userAgent.match(/iPod|iPhone|iPad/g) ? true : false;

  /**
   * Creates a new speech bubble
   *
   * @param {H5P.jQuery} $container The speaking object
   * @param {string} text The text to display
   * @param {number} maxWidth The maximum width of the bubble
   * @return {H5P.JoubelSpeechBubble}
   */
  function JoubelSpeechBubble($container, text, maxWidth) {
    maxWidth = maxWidth || DEFAULT_MAX_WIDTH;
    currentMaxWidth = maxWidth;
    $currentContainer = $container;

    this.isCurrent = function ($tip) {
      return $tip.is($currentContainer);
    };

    this.remove = function () {
      remove();
    };

    var fadeOutSpeechBubble = function ($speechBubble) {
      if (!$speechBubble) {
        return;
      }

      // Stop removing bubble
      clearTimeout(removeSpeechBubbleTimeout);

      $speechBubble.removeClass('show');
      setTimeout(function () {
        if ($speechBubble) {
          $speechBubble.remove();
          $speechBubble = undefined;
        }
      }, 500);
    };

    if ($currentSpeechBubble !== undefined) {
      remove();
    }

    var $h5pContainer = getH5PContainer($container);

    // Make sure we fade out old speech bubble
    fadeOutSpeechBubble($currentSpeechBubble);

    // Create bubble
    $tail = $('<div class="joubel-speech-bubble-tail"></div>');
    $innerTail = $('<div class="joubel-speech-bubble-inner-tail"></div>');
    var $innerBubble = $(
      '<div class="joubel-speech-bubble-inner">' +
      '<div class="joubel-speech-bubble-text">' + text + '</div>' +
      '</div>'
    ).prepend($innerTail);

    $currentSpeechBubble = $(
      '<div class="joubel-speech-bubble" aria-live="assertive">'
    ).append([$tail, $innerBubble])
      .appendTo($h5pContainer);

    // Show speech bubble with transition
    setTimeout(function () {
      $currentSpeechBubble.addClass('show');
    }, 0);

    position($currentSpeechBubble, $currentContainer, maxWidth, $tail, $innerTail);

    // Handle click to close
    H5P.$body.on('mousedown.speechBubble', handleOutsideClick);

    // Handle window resizing
    H5P.$window.on('resize', '', handleResize);

    // Handle clicks when inside IV which blocks bubbling.
    $container.parents('.h5p-dialog')
      .on('mousedown.speechBubble', handleOutsideClick);

    if (iDevice) {
      H5P.$body.css('cursor', 'pointer');
    }

    return this;
  }

  // Remove speechbubble if it belongs to a dom element that is about to be hidden
  H5P.externalDispatcher.on('domHidden', function (event) {
    if ($currentSpeechBubble !== undefined && event.data.$dom.find($currentContainer).length !== 0) {
      remove();
    }
  });

  /**
   * Returns the closest h5p container for the given DOM element.
   * 
   * @param {object} $container jquery element
   * @return {object} the h5p container (jquery element)
   */
  function getH5PContainer($container) {
    var $h5pContainer = $container.closest('.h5p-frame');

    // Check closest h5p frame first, then check for container in case there is no frame.
    if (!$h5pContainer.length) {
      $h5pContainer = $container.closest('.h5p-container');
    }

    return $h5pContainer;
  }

  /**
   * Event handler that is called when the window is resized.
   */
  function handleResize() {
    position($currentSpeechBubble, $currentContainer, currentMaxWidth, $tail, $innerTail);
  }

  /**
   * Repositions the speech bubble according to the position of the container.
   * 
   * @param {object} $currentSpeechbubble the speech bubble that should be positioned   
   * @param {object} $container the container to which the speech bubble should point 
   * @param {number} maxWidth the maximum width of the speech bubble
   * @param {object} $tail the tail (the triangle that points to the referenced container)
   * @param {object} $innerTail the inner tail (the triangle that points to the referenced container)
   */
  function position($currentSpeechBubble, $container, maxWidth, $tail, $innerTail) {
    var $h5pContainer = getH5PContainer($container);

    // Calculate offset between the button and the h5p frame
    var offset = getOffsetBetween($h5pContainer, $container);

    var direction = (offset.bottom > offset.top ? 'bottom' : 'top');
    var tipWidth = offset.outerWidth * 0.9; // Var needs to be renamed to make sense
    var bubbleWidth = tipWidth > maxWidth ? maxWidth : tipWidth;

    var bubblePosition = getBubblePosition(bubbleWidth, offset);
    var tailPosition = getTailPosition(bubbleWidth, bubblePosition, offset, $container.width());
    // Need to set font-size, since element is appended to body.
    // Using same font-size as parent. In that way it will grow accordingly
    // when resizing
    var fontSize = 16;//parseFloat($parent.css('font-size'));

    // Set width and position of speech bubble
    $currentSpeechBubble.css(bubbleCSS(
      direction,
      bubbleWidth,
      bubblePosition,
      fontSize
    ));

    var preparedTailCSS = tailCSS(direction, tailPosition);
    $tail.css(preparedTailCSS);
    $innerTail.css(preparedTailCSS);
  }

  /**
   * Static function for removing the speechbubble
   */
  var remove = function () {
    H5P.$body.off('mousedown.speechBubble');
    H5P.$window.off('resize', '', handleResize);
    $currentContainer.parents('.h5p-dialog').off('mousedown.speechBubble');
    if (iDevice) {
      H5P.$body.css('cursor', '');
    }
    if ($currentSpeechBubble !== undefined) {
      // Apply transition, then remove speech bubble
      $currentSpeechBubble.removeClass('show');

      // Make sure we remove any old timeout before reassignment
      clearTimeout(removeSpeechBubbleTimeout);
      removeSpeechBubbleTimeout = setTimeout(function () {
        $currentSpeechBubble.remove();
        $currentSpeechBubble = undefined;
      }, 500);
    }
    // Don't return false here. If the user e.g. clicks a button when the bubble is visible,
    // we want the bubble to disapear AND the button to receive the event
  };

  /**
   * Remove the speech bubble and container reference
   */
  function handleOutsideClick(event) {
    if (event.target === $currentContainer[0]) {
      return; // Button clicks are not outside clicks
    }

    remove();
    // There is no current container when a container isn't clicked
    $currentContainer = undefined;
  }

  /**
   * Calculate position for speech bubble
   *
   * @param {number} bubbleWidth The width of the speech bubble
   * @param {object} offset
   * @return {object} Return position for the speech bubble
   */
  function getBubblePosition(bubbleWidth, offset) {
    var bubblePosition = {};

    var tailOffset = 9;
    var widthOffset = bubbleWidth / 2;

    // Calculate top position
    bubblePosition.top = offset.top + offset.innerHeight;

    // Calculate bottom position
    bubblePosition.bottom = offset.bottom + offset.innerHeight + tailOffset;

    // Calculate left position
    if (offset.left < widthOffset) {
      bubblePosition.left = 3;
    }
    else if ((offset.left + widthOffset) > offset.outerWidth) {
      bubblePosition.left = offset.outerWidth - bubbleWidth - 3;
    }
    else {
      bubblePosition.left = offset.left - widthOffset + (offset.innerWidth / 2);
    }

    return bubblePosition;
  }

  /**
   * Calculate position for speech bubble tail
   *
   * @param {number} bubbleWidth The width of the speech bubble
   * @param {object} bubblePosition Speech bubble position
   * @param {object} offset
   * @param {number} iconWidth The width of the tip icon
   * @return {object} Return position for the tail
   */
  function getTailPosition(bubbleWidth, bubblePosition, offset, iconWidth) {
    var tailPosition = {};
    // Magic numbers. Tuned by hand so that the tail fits visually within
    // the bounds of the speech bubble.
    var leftBoundary = 9;
    var rightBoundary = bubbleWidth - 20;

    tailPosition.left = offset.left - bubblePosition.left + (iconWidth / 2) - 6;
    if (tailPosition.left < leftBoundary) {
      tailPosition.left = leftBoundary;
    }
    if (tailPosition.left > rightBoundary) {
      tailPosition.left = rightBoundary;
    }

    tailPosition.top = -6;
    tailPosition.bottom = -6;

    return tailPosition;
  }

  /**
   * Return bubble CSS for the desired growth direction
   *
   * @param {string} direction The direction the speech bubble will grow
   * @param {number} width The width of the speech bubble
   * @param {object} position Speech bubble position
   * @param {number} fontSize The size of the bubbles font
   * @return {object} Return CSS
   */
  function bubbleCSS(direction, width, position, fontSize) {
    if (direction === 'top') {
      return {
        width: width + 'px',
        bottom: position.bottom + 'px',
        left: position.left + 'px',
        fontSize: fontSize + 'px',
        top: ''
      };
    }
    else {
      return {
        width: width + 'px',
        top: position.top + 'px',
        left: position.left + 'px',
        fontSize: fontSize + 'px',
        bottom: ''
      };
    }
  }

  /**
   * Return tail CSS for the desired growth direction
   *
   * @param {string} direction The direction the speech bubble will grow
   * @param {object} position Tail position
   * @return {object} Return CSS
   */
  function tailCSS(direction, position) {
    if (direction === 'top') {
      return {
        bottom: position.bottom + 'px',
        left: position.left + 'px',
        top: ''
      };
    }
    else {
      return {
        top: position.top + 'px',
        left: position.left + 'px',
        bottom: ''
      };
    }
  }

  /**
   * Calculates the offset between an element inside a container and the
   * container. Only works if all the edges of the inner element are inside the
   * outer element.
   * Width/height of the elements is included as a convenience.
   *
   * @param {H5P.jQuery} $outer
   * @param {H5P.jQuery} $inner
   * @return {object} Position offset
   */
  function getOffsetBetween($outer, $inner) {
    var outer = $outer[0].getBoundingClientRect();
    var inner = $inner[0].getBoundingClientRect();

    return {
      top: inner.top - outer.top,
      right: outer.right - inner.right,
      bottom: outer.bottom - inner.bottom,
      left: inner.left - outer.left,
      innerWidth: inner.width,
      innerHeight: inner.height,
      outerWidth: outer.width,
      outerHeight: outer.height
    };
  }

  return JoubelSpeechBubble;
})(H5P.jQuery);
var H5P = H5P || {};

H5P.JoubelThrobber = (function ($) {

  /**
   * Creates a new tip
   */
  function JoubelThrobber() {

    // h5p-throbber css is described in core
    var $throbber = $('<div/>', {
      'class': 'h5p-throbber'
    });

    return $throbber;
  }

  return JoubelThrobber;
}(H5P.jQuery));
H5P.JoubelTip = (function ($) {
  var $conv = $('<div/>');

  /**
   * Creates a new tip element.
   *
   * NOTE that this may look like a class but it doesn't behave like one.
   * It returns a jQuery object.
   *
   * @param {string} tipHtml The text to display in the popup
   * @param {Object} [behaviour] Options
   * @param {string} [behaviour.tipLabel] Set to use a custom label for the tip button (you want this for good A11Y)
   * @param {boolean} [behaviour.helpIcon] Set to 'true' to Add help-icon classname to Tip button (changes the icon)
   * @param {boolean} [behaviour.showSpeechBubble] Set to 'false' to disable functionality (you may this in the editor)
   * @param {boolean} [behaviour.tabcontrol] Set to 'true' if you plan on controlling the tabindex in the parent (tabindex="-1")
   * @return {H5P.jQuery|undefined} Tip button jQuery element or 'undefined' if invalid tip
   */
  function JoubelTip(tipHtml, behaviour) {

    // Keep track of the popup that appears when you click the Tip button
    var speechBubble;

    // Parse tip html to determine text
    var tipText = $conv.html(tipHtml).text().trim();
    if (tipText === '') {
      return; // The tip has no textual content, i.e. it's invalid.
    }

    // Set default behaviour
    behaviour = $.extend({
      tipLabel: tipText,
      helpIcon: false,
      showSpeechBubble: true,
      tabcontrol: false
    }, behaviour);

    // Create Tip button
    var $tipButton = $('<div/>', {
      class: 'joubel-tip-container' + (behaviour.showSpeechBubble ? '' : ' be-quiet'),
      title: behaviour.tipLabel,
      'aria-label': behaviour.tipLabel,
      'aria-expanded': false,
      role: 'button',
      tabindex: (behaviour.tabcontrol ? -1 : 0),
      click: function (event) {
        // Toggle show/hide popup
        toggleSpeechBubble();
        event.preventDefault();
      },
      keydown: function (event) {
        if (event.which === 32 || event.which === 13) { // Space & enter key
          // Toggle show/hide popup
          toggleSpeechBubble();
          event.stopPropagation();
          event.preventDefault();
        }
        else { // Any other key
          // Toggle hide popup
          toggleSpeechBubble(false);
        }
      },
      // Add markup to render icon
      html: '<span class="joubel-icon-tip-normal ' + (behaviour.helpIcon ? ' help-icon': '') + '">' +
              '<span class="h5p-icon-shadow"></span>' +
              '<span class="h5p-icon-speech-bubble"></span>' +
              '<span class="h5p-icon-info"></span>' +
            '</span>'
      // IMPORTANT: All of the markup elements must have 'pointer-events: none;'
    });

    const $tipAnnouncer = $('<div>', {
      'class': 'hidden-but-read',
      'aria-live': 'polite',
      appendTo: $tipButton,
    });

    /**
     * Tip button interaction handler.
     * Toggle show or hide the speech bubble popup when interacting with the
     * Tip button.
     *
     * @private
     * @param {boolean} [force] 'true' shows and 'false' hides.
     */
    var toggleSpeechBubble = function (force) {
      if (speechBubble !== undefined && speechBubble.isCurrent($tipButton)) {
        // Hide current popup
        speechBubble.remove();
        speechBubble = undefined;

        $tipButton.attr('aria-expanded', false);
        $tipAnnouncer.html('');
      }
      else if (force !== false && behaviour.showSpeechBubble) {
        // Create and show new popup
        speechBubble = H5P.JoubelSpeechBubble($tipButton, tipHtml);
        $tipButton.attr('aria-expanded', true);
        $tipAnnouncer.html(tipHtml);
      }
    };

    return $tipButton;
  }

  return JoubelTip;
})(H5P.jQuery);
var H5P = H5P || {};

/**
 * H5P Joubel UI library.
 *
 * This is a utility library, which does not implement attach. I.e, it has to bee actively used by
 * other libraries
 * @module
 */
H5P.JoubelUI = (function ($) {

  /**
   * The internal object to return
   * @class H5P.JoubelUI
   * @static
   */
  function JoubelUI() {}

  /* Public static functions */

  /**
   * Create a tip icon
   * @method H5P.JoubelUI.createTip
   * @param  {string}  text   The textual tip
   * @param  {Object}  params Parameters
   * @return {H5P.JoubelTip}
   */
  JoubelUI.createTip = function (text, params) {
    return new H5P.JoubelTip(text, params);
  };

  /**
   * Create message dialog
   * @method H5P.JoubelUI.createMessageDialog
   * @param  {H5P.jQuery}               $container The dom container
   * @param  {string}                   message    The message
   * @return {H5P.JoubelMessageDialog}
   */
  JoubelUI.createMessageDialog = function ($container, message) {
    return new H5P.JoubelMessageDialog($container, message);
  };

  /**
   * Create help text dialog
   * @method H5P.JoubelUI.createHelpTextDialog
   * @param  {string}             header  The textual header
   * @param  {string}             message The textual message
   * @param  {string}             closeButtonTitle The title for the close button
   * @return {H5P.JoubelHelpTextDialog}
   */
  JoubelUI.createHelpTextDialog = function (header, message, closeButtonTitle) {
    return new H5P.JoubelHelpTextDialog(header, message, closeButtonTitle);
  };

  /**
   * Create progress circle
   * @method H5P.JoubelUI.createProgressCircle
   * @param  {number}             number          The progress (0 to 100)
   * @param  {string}             progressColor   The progress color in hex value
   * @param  {string}             fillColor       The fill color in hex value
   * @param  {string}             backgroundColor The background color in hex value
   * @return {H5P.JoubelProgressCircle}
   */
  JoubelUI.createProgressCircle = function (number, progressColor, fillColor, backgroundColor) {
    return new H5P.JoubelProgressCircle(number, progressColor, fillColor, backgroundColor);
  };

  /**
   * Create throbber for loading
   * @method H5P.JoubelUI.createThrobber
   * @return {H5P.JoubelThrobber}
   */
  JoubelUI.createThrobber = function () {
    return new H5P.JoubelThrobber();
  };

  /**
   * Create simple rounded button
   * @method H5P.JoubelUI.createSimpleRoundedButton
   * @param  {string}                  text The button label
   * @return {H5P.SimpleRoundedButton}
   */
  JoubelUI.createSimpleRoundedButton = function (text) {
    return new H5P.SimpleRoundedButton(text);
  };

  /**
   * Create Slider
   * @method H5P.JoubelUI.createSlider
   * @param  {Object} [params] Parameters
   * @return {H5P.JoubelSlider}
   */
  JoubelUI.createSlider = function (params) {
    return new H5P.JoubelSlider(params);
  };

  /**
   * Create Score Bar
   * @method H5P.JoubelUI.createScoreBar
   * @param  {number=}       maxScore The maximum score
   * @param {string} [label] Makes it easier for readspeakers to identify the scorebar
   * @return {H5P.JoubelScoreBar}
   */
  JoubelUI.createScoreBar = function (maxScore, label, helpText, scoreExplanationButtonLabel) {
    return new H5P.JoubelScoreBar(maxScore, label, helpText, scoreExplanationButtonLabel);
  };

  /**
   * Create Progressbar
   * @method H5P.JoubelUI.createProgressbar
   * @param  {number=}       numSteps The total numer of steps
   * @param {Object} [options] Additional options
   * @param {boolean} [options.disableAria] Disable readspeaker assistance
   * @param {string} [options.progressText] A progress text for describing
   *  current progress out of total progress for readspeakers.
   *  e.g. "Slide :num of :total"
   * @return {H5P.JoubelProgressbar}
   */
  JoubelUI.createProgressbar = function (numSteps, options) {
    return new H5P.JoubelProgressbar(numSteps, options);
  };

  /**
   * Create standard Joubel button
   *
   * @method H5P.JoubelUI.createButton
   * @param {object} params
   *  May hold any properties allowed by jQuery. If href is set, an A tag
   *  is used, if not a button tag is used.
   * @return {H5P.jQuery} The jquery element created
   */
  JoubelUI.createButton = function(params) {
    var type = 'button';
    if (params.href) {
      type = 'a';
    }
    else {
      params.type = 'button';
    }
    if (params.class) {
      params.class += ' h5p-joubelui-button';
    }
    else {
      params.class = 'h5p-joubelui-button';
    }
    return $('<' + type + '/>', params);
  };

  /**
   * Fix for iframe scoll bug in IOS. When focusing an element that doesn't have
   * focus support by default the iframe will scroll the parent frame so that
   * the focused element is out of view. This varies dependening on the elements
   * of the parent frame.
   */
  if (H5P.isFramed && !H5P.hasiOSiframeScrollFix &&
      /iPad|iPhone|iPod/.test(navigator.userAgent)) {
    H5P.hasiOSiframeScrollFix = true;

    // Keep track of original focus function
    var focus = HTMLElement.prototype.focus;

    // Override the original focus
    HTMLElement.prototype.focus = function () {
      // Only focus the element if it supports it natively
      if ( (this instanceof HTMLAnchorElement ||
            this instanceof HTMLInputElement ||
            this instanceof HTMLSelectElement ||
            this instanceof HTMLTextAreaElement ||
            this instanceof HTMLButtonElement ||
            this instanceof HTMLIFrameElement ||
            this instanceof HTMLAreaElement) && // HTMLAreaElement isn't supported by Safari yet.
          !this.getAttribute('role')) { // Focus breaks if a different role has been set
          // In theory this.isContentEditable should be able to recieve focus,
          // but it didn't work when tested.

        // Trigger the original focus with the proper context
        focus.call(this);
      }
    };
  }

  return JoubelUI;
})(H5P.jQuery);
