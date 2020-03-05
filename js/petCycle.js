/////cycle
(function ($, window) {
    $.fn.petCycle = function (options) {
        var defaults = {
            petCurrent: 160,
            levels: [{name:'성장기', min:0, max:11}, {name:'성년기', min:12, max:95}, {name:'노년기', min:96, max:150}],
            title: ''
        };
        var settings = $.extend(defaults, options);

        this.each(function(){
            var petCycle = this;
            var currentLevel = getLevel(settings.petCurrent);

            setLabel(petCycle, currentLevel);
            fillProgressBar(petCycle, currentLevel);
        });

        function getLevel(value) {
            if (value <= settings.levels[0].max) {
                return 1;
            } else if (settings.levels[0].max < value && value <= settings.levels[1].max) {
                return 2;
            } else {
                return 3;
            }
        }

        function setLabel(petCycle, currentLevel) {
            $('.user-pet-age .months', petCycle).html(settings.title);
            $('.level1', petCycle).html(settings.levels[0].max);
            $('.level2,.level3', petCycle).html(settings.levels[1].max);

            $('.user-pet-level', petCycle).html(settings.levels[currentLevel - 1].name);
            $('.level-text-group span', petCycle).eq(currentLevel - 1).addClass('active');
        }

        function getProgressbarPercent(levelIdx, value) {
            var level = settings.levels[levelIdx - 1]
            var currentLevelWidth = level.max - level.min;

            if (level.max <= value) {
                return { 
                    percent: 100, 
                    percentInCurrentLevel: 100
                };
            }
            var leftPart = (levelIdx-1) * 1/3;
            var inCurrentLevel = (value - level.min) / currentLevelWidth;
            return { 
                percent: (leftPart + (inCurrentLevel * 1/3)) * 100, 
                percentInCurrentLevel: inCurrentLevel * 100
            };
        }

        function fillProgressBar(petCycle, currentLevel) {
            var p  = getProgressbarPercent(currentLevel, settings.petCurrent);
            $('.pet-group .pet-position', petCycle).css('left', p.percent + '%');
            $('.cycle-bar', petCycle).css('width', p.percent + '%');

            var $barInEachLevels = $('.level i', petCycle);
            for (var i = 0; i < currentLevel - 1; i++) {
                $barInEachLevels.eq(i).css('width', '100%');
            }
            $barInEachLevels.eq(currentLevel - 1).css('width', p.percentInCurrentLevel + '%');
        }

        return this;
    };

}(jQuery, window));