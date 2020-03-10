(function ($, window) {
    $.fn.listFromJson = function (options) {
        var defaults = {
            url: '',
            hidden: '#value-hidden',
            classSelected: 'active'
        };
        var settings = $.extend(defaults, options);
        var $listFromJson = this;

        $listFromJson.each(function () {
            var $selectorUl = $(this);
            $.getJSON(settings.url, function (data) {
                $.each(data, function (i, name) {
                    $selectorUl.append(`<li>${name}</li>`);
                });
                $('li', $selectorUl).click(function () {
                    $('li', $selectorUl).removeClass(settings.classSelected);
                    $(this).addClass(settings.classSelected);
                    $(settings.hidden).val($(this).text()).trigger('change');
                });
            });
        });

        return $listFromJson;
    };
})(jQuery, window);

(function ($, window) {
    $.fn.checkboxListFromJson = function (options) {
        var defaults = {
            url: '',
            hidden: '#value-hidden',
            classSelected: 'active',
            classInput: 'required-input',
            maxCount: undefined,
            uncheckAllOptionName: 'anyof',
            OnSelectedCountChanged: undefined
        };
        var settings = $.extend(defaults, options);
        var $listFromJson = this;
        var selectedCount = 0;
        var itemCount = 0;

        $listFromJson.each(function () {
            var $selectorUl = $(this);
            $.getJSON(settings.url, function (data) {
                $.each(data, function (i, item) {
                    $selectorUl.append(generateListItem(item));
                });

                var $checkBox = $('.input-checkbox', $selectorUl).not('.uncheck-all');
                itemCount = $checkBox.length;
                bindCheckboxEvent($selectorUl, $checkBox);
                bindUncheckAllEvent($selectorUl);
            });
        });

        function generateListItem(item) {
            var isUncheckAllItem = item.name === settings.uncheckAllOptionName;
            return `
                <li>
                    <div class="radio-label-thumb ${item.class}">
                        <label>
                            <input type="checkbox" class="input-checkbox ${settings.classInput} ${isUncheckAllItem ? 'uncheck-all' : ''}" 
                                name="${item.name}" value ${item.disabled ? "disabled>" : ">"}
                                <div class="radio-thumb"
                                    style="background-image:url('${item.img}')">
                                </div>
                                <p>${item.text}</p>
                        </label>
                    </div>
                </li>`;
        }

        function bindCheckboxEvent($selectorUl, $checkbox) {
            $checkbox.on('change', function () {
                var checked = $(this).prop('checked');

                if (checked) {
                    if (settings.maxCount && $('.input-checkbox:checked', $selectorUl).length > settings.maxCount) {
                        $(this).prop('checked', false);
                        return;
                    }
                    $('.input-checkbox.uncheck-all', $selectorUl).prop('checked', false);
                }

                selectedCount = selectedCount + (checked ? 1 : -1);
                if (settings.OnSelectedCountChanged) {
                    settings.OnSelectedCountChanged(selectedCount, selectedCount == itemCount);
                }
            });
        }

        function bindUncheckAllEvent($selectorUl) {
            $('.input-checkbox.uncheck-all', $selectorUl).on('change', function () {
                var checked = $(this).prop('checked');
                if (!checked) {
                    return;
                }

                $('.input-checkbox', $selectorUl).not(this).prop('checked', false);
                selectedCount = 0;
                if (settings.OnSelectedCountChanged) {
                    settings.OnSelectedCountChanged(selectedCount, selectedCount == itemCount);
                }
            });
        }

        return $listFromJson;
    };
})(jQuery, window);

//top button
$(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() == 0) {
            $('.btn-totop').fadeOut();
        } else if ($(this).scrollTop() > 0) {
            $('.btn-totop').show();
        }
    });
    $('.btn-totop').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 400);
    });
});

//jason url
$(function () {
    $('.animaltype-list').listFromJson({
        url: 'js/dummy_pettype.json'
    });

    $('.allergy-list').checkboxListFromJson({
        url: 'js/dummy_allergy.json',
        OnSelectedCountChanged: function (_, isAllSelected) {
            $('.error-msg').toggle(isAllSelected);
        }
    });

    $('.preference-list').checkboxListFromJson({
        url: 'js/dummy_preference.json',
        disabledItemClass: 'bg-allergy'
    });

    $('.sickness-list').checkboxListFromJson({
        url: 'js/dummy_sickness.json',
        maxCount: 3
    });
})

//active toggle list
$(function () {
    $('.activeToggle li').click(function () {
        $('.activeToggle li').removeClass('active');
        $(this).addClass('active');
        $('#value-hidden').val($(this).data('type')).trigger('change');
    });
})

//clear button 
$(function () {
    $('.clear-input').click(function () {
        $(this).siblings('input').val('').trigger('keyup');
    }).siblings('input').keyup(function(){
        $(this).siblings('.clear-input').toggle($(this).val().length > 0);
    });
});

//form_register_03_breed.html
//form_edit_register_03_breed.html  
$(function () {
    $('.breed')
        .focus(function () {
            $('.select-breed[value="known"]').prop("checked", true);
        })
        .keyup(function () {
            $.getJSON('js/dummy_breed.json?query=' + $(this).val(), function (result) {
                var $ul = $('.breedtype-list').empty();
                if (result) {
                    $.each(result, function (_, breed) {
                        $ul.append('<li>' + breed + '</li>');
                    });
                } else {
                    $ul.append('<li class="no-results">검색결과가 없습니다.</li>');
                }
            });
            // $(this).siblings('.clear-input').toggle($(this).val().length > 0);
        }).trigger('keyup')
        .parents('.wrap-txt-input').click(function () {
            if ($(this).children().prop('disabled')) {
                $('.breed').prop('disabled', false);
                //$('.btn-global').removeClass('active');
                $('#value-hidden').val('').trigger('change');
            }
        });

    $('.breedtype-list').on('click', 'li', function () {
        if ($(this).hasClass('no-results')) {
            return;
        }
        $('#value-hidden').val($(this).text()).trigger('change');
        $('.select-breed[value="known"]').prop("checked", true);
        $('.breed').val($(this).text()).prop('disabled', true);
        //$('.btn-global').addClass('active');
    });

    $('.select-breed').change(function () {
        if ($(this).val() === 'unknown') {
            $('.wrap-txt-input, .breedtype-list').hide();
            //$('.btn-global').addClass('active');
        } else {
            $('.wrap-txt-input, .breedtype-list').show();
            if ($('.breed').prop('disabled') !== true) {
               // $('.btn-global').removeClass('active');
            }
        }
    });

    $('input[type=radio][name=breed]').change(function () {
        $('.select-breed-block').toggle(!$(this).hasClass('not'));
    });
});

//form_condition_06_feed.html
//form_edit_condition_06_feed.html
$(function () {
    $('.bg-dryfood input').change(function () {
        if ($(this).prop('checked')) {
            $('#dryfood').show();
        } else {
            $('#dryfood').hide();
        }
    });
    $('.bg-wetfood input').click(function () {
        if ($(this).prop('checked')) {
            $('#wetfood').show();
        } else {
            $('#wetfood').hide();
        }
    });
});

$(document).ready(function () {
    //form common
    $("form").submit(function (e) {
        if (!$('.btn-global').hasClass('active')) {
            $('.error-msg').show();
            e.preventDefault(e);
        }
    });
    //all form
    $(function () {
        //폼을 가지고 있는지 체크
        //인풋 형태가 바뀔때마다 이 페이지에 인풋 벨류값이 있는지 체크 
        $(document).on('change keyup','input.required-input' ,function () {
            var $input = $(this);
            var type = $input.attr('type');
            var isValid = false;
            if (type === 'radio' || type === 'checkbox') {
                isValid = $('.required-input:checked').length > 0 && !$('p.error-msg').is(':visible');
            } else if (type === 'text' || type === 'number' || type === 'hidden') {
                isValid = $input.val().length > 0;  
            }
            $('.btn-global').toggleClass('active', isValid);
        });

    });
    //form_register_01_name_nonmembers +form_edit_register_01_name_nonmembers
     $('#pet_name').keyup(function () {
         if ($(this).val()) {
             $('.error-msg').hide();
         } else {
             $('.error-msg').show();
         }
     });

    //form_condition_02_bodytype.html
    //form_edit_condition_02_bodytype.html
    $('.wrap-radio-label.list-type li').on('click', function (e) {
        $('.wrap-radio-label.list-type li').removeClass('on');
        $(this).addClass('on');
    });
    //form_condition_03_exercise.html
    //form_edit_condition_03_exercise.html
    //exerciseHours_form
    function countHours(hour) {
        currentNumber = parseInt($('.input-exercise-block .input-exercise').val()) + hour;
        if (Number.isNaN(currentNumber)) {
            currentNumber = 0;
        }
        else if (currentNumber < 0) {
            return;
        }
        if (currentNumber <= 0) {
            $('.subtract-numbers').removeClass('active');
        } else {
            $('.subtract-numbers').addClass('active');
        }

        $('.input-exercise-block .input-exercise').val(currentNumber);
    }
    $('.add-numbers').on('click', function (e) {
        countHours(1);
        e.preventDefault();
    });
    $('.subtract-numbers').on('click', function (e) {
        countHours(-1);
        e.preventDefault();
    });

    //real-time-loading.html
    $('#percent').on('change', function () {
        //서버전송량
        var val = parseInt($(this).val());

        var $circle = $('svg.loading .loading-bar ');
        if (isNaN(val)) {
            val = 1;
        }
        else {
            var r = $circle.attr('r');
            var c = Math.PI * (r * 2);
            if (val < 0) { val = 0; }
            if (val > 100) { val = 100; }
            var pct = ((100 - val) / 100) * c;
            $circle.css({ strokeDashoffset: pct });
        }
    });

    //result.html/////////////////////////////////////////////////
    //레이아웃변경
    var lastScrollTop = 0;
    if ($('.wrap-result-tab').length > 0) {
        $(window).scroll(function () {
            var st = $(this).scrollTop();
            if(st === lastScrollTop) {
                return;
            }
            if (st > lastScrollTop){
                var scrollTop = $(window).scrollTop();
                if (122 > scrollTop) {
                    $('.top-block').css({'top': '0' });
                    $('.wrap-result-tab').removeClass('fixed-top').removeClass('mgn-top');    
                } else if (122 <= scrollTop && 170 > scrollTop) {
                    $('.top-block').css({'top':( -(scrollTop-123)) });
                    $('.wrap-result-tab').removeClass('fixed-top').addClass('mgn-top');
                } else if (scrollTop > 170) {
                    $('.top-block').css({'top': '0' });
                    $('.wrap-result-tab').addClass('fixed-top').addClass('mgn-top').removeClass('fixed-48');             
                }
            } else {
                var scrollTop = $(window).scrollTop();
                if (0== scrollTop) { 
                } else if (122 >= scrollTop) {
                    $('.wrap-result-tab').removeClass('fixed-48').removeClass('mgn-top');  
                } else if (scrollTop > 122) {
                    $('.top-block').animate({'top':0 });
                    $('.wrap-result-tab').removeClass('fixed-top').addClass('fixed-48');        
                }
            }
            lastScrollTop = st;
        });
        
    }

    $('body').on('click',function(event){
        if(!$(event.target).is('.tooltip')){
          $('.tooltip').hide();
        }
     });
    
    //동물생애주기&체중분석플러그인
    if ($('#cycle_age').length > 0) {
        var petMonth = 120;
        $('#cycle_age').petCycle({
            petCurrent: petMonth,
            levels: [{ name: '성장기', min: 0, max: 11 }, { name: '성년기', min: 12, max: 95 }, { name: '노년기', min: 96, max: 150 }],
            title: parseInt((petMonth / 12)) + '세' + (petMonth % 12) + '개월'
        });
        $('#cycle_weight').petCycle({
            petCurrent: 8.8,
            levels: [{ name: '외소', min: 0, max: 7 }, { name: '표준', min: 7.1, max: 9 }, { name: '비만', min: 10, max: 30 }],
            title: '8.8kg'
        });
    }

    //탭과탭내슬라이드플러그인
    var currentTab = 1;
    var swiper;
    var summaryBlockHeight = $('.summary-block').outerHeight() + $('.top-block').outerHeight();
    var topOtherTap = summaryBlockHeight;
    $('.result-tab a').on('click', function (event) {
        var selectedTab = parseInt($(this).attr('data-toggle-index'));     
        $('.result-tab a').removeClass('active');
        $(this).addClass('active');
        
        showBlock(selectedTab);
        var st = $(window).scrollTop();
        if(st>122){
            $(window).scrollTop('123');
        }
        // if (currentTab === selectedTab) {
        //     lastScrollTop = 0;
        //     $(window).scrollTop(summaryBlockHeight);
        // } else {
        //     var topCurrentTab = $(window).scrollTop();
        //     lastScrollTop = 0;
        //     $(window).scrollTop(topOtherTap > summaryBlockHeight ? topOtherTap : summaryBlockHeight);
        //     topOtherTap = topCurrentTab;
        // }

        if (selectedTab === 2 && $('.swiper-container').length > 0) {
            swiper = new Swiper('.swiper-container', {
                effect: 'fade',
                pagination: {
                    el: '.swiper-pagination',
                    type: 'bullets'
                },
            });
        } else if(swiper) {
            swiper.destroy();
        }
        currentTab = selectedTab;
        event.preventDefault();
       
    });

    function showBlock(e) {
        $('.toggle').addClass('hidden').eq(parseInt(e - 1)).removeClass('hidden');
        if ($(".swiper-slide").length === 1) {
            $(".swiper-pagination").css("display", "none");
        }
    }
    ///////////////////////////////////////////////////////////
});

//form_register_04_age.html
//form_edit_register_04_age.html
//form_condition_08_pregnancy
//form_edit_condition_08_pregnancy
$(function () {
    ///////rolldate////////week
    if (window.Rolldate) {
        var rd = new Rolldate({
            el: '#birth_date',
            init: function () {
                $('.select-age[value="known"]').prop('checked', true);
            },
            confirm: function () {
                $('.btn-global').addClass('active');
            },
            customClass: 'dateclass'
        });
    }

    var ageOptions = [];
    for (let i = 0; i <= 20; i++) {
        ageOptions.push(`${i}세`);
    }
    var monthOptions = [];
    for (let i = 0; i <= 12; i++) {
        monthOptions.push(`${i}개월`);
    }
    if (window.RollSelect) {
        var rs = new RollSelect({
            el: '#birth_ballpark',
            items: [
                ageOptions,
                monthOptions
            ],
            init: function () {
                $('.select-age[value="unknown"]').prop('checked', true);
            },
            confirm: function () {
                $('.btn-global').addClass('active');
            },
            customClass: 'birthclass'
        });
    }

    $('.select-age').change(function () {
        if ($(this).val() === 'unknown') {
            rs.show();
            if (!$('#brith_ballpark').val()) {
                $('.btn-global').removeClass('active');
            }
        } else {
            rd.show();
            if (!$('#brith_date').val()) {
                $('.btn-global').removeClass('active');
            }
        }
    });

    $('#birth_date_show').click(function () {
        rd.show();
    });

    $('#birth_ballpark_show').click(function () {
        rs.show();
    });

    $("#age").submit(function (e) {
        if (!$('.btn-global').hasClass('active')) {
            e.preventDefault(e);
        }
    });

    ///////rolldate////////week
    var weekOptions = [];
    for (let i = 1; i <= 30; i++) {
        weekOptions.push(`${i}주`);
    }
    if (window.RollSelect) {
        var week_select = new RollSelect({
            el: '#week_pregnancy',
            items: [
                weekOptions
            ],
            init: function () {
                $('.select-week[value="pregnant"]').prop('checked', true);
            },
            confirm: function () {
                $('.btn-global').addClass('active');
            }
        });
    }
    $('.select-week').change(function () {
        if ($(this).val() === 'not') {
            $('#week_pregnancy').hide();
            $('.btn-global').addClass('active');
        } else {
            $('#week_pregnancy').show();
            week_select.show();
            if (!$('#week_pregnancy').val()) {
            $('.btn-global').removeClass('active');
            }
        }
    });
    $("#pregnancy").submit(function (e) {
        if (!$('.btn-global').hasClass('active')) {
            e.preventDefault(e);
        }
    });
});

//form_condition_01_weight.html
//form_edit_condition_01_weight.html
$(function () {
    function handleValue(value) {
        $('#weight_input').val(value);
        if (value > 0) {
            $('.btn-global').addClass('active');
        }else if(value == 0){
            $('.btn-global').removeClass('active');
        }
        //document.querySelector('#values').innerHTML = value;
    }
    if (window.SlideRuler) {
        new SlideRuler.default(
            {
                el: document.querySelector('.scale'),
                maxValue: 100,
                minValue: 0,
                currentValue: 0,
                handleValue: handleValue,
                precision: 0.1,
                canvasHeight: 62,
                canvasWidth: 328,
                fontColor: '#4e5263',
                colorDigit: '#8e7e78',
                colorDecimal: '#4e5263',
                lineWidth: 1,
                heightDigit: 15,
                heightDecimal: 24,
                fontMarginTop: 32

            }
        );
    }

    $("#weight").submit(function (e) {
        if (!$('.btn-global').hasClass('active')) {
            e.preventDefault(e);
        }
    });
});
