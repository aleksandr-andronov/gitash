{addcss file="%productofday%/productofday.v1.css"}
{if count($list)>1 && $show_slider_arrows}{* Если товаров больше двух *}
    {addcss file="%productofday%/arrows.css"}
{/if}
{$ctrl=$this_controller}
{if count($list)>1} {* Если товаров больше двух *}
    {* Скрипт карусели *}
    {addjs file="%productofday%/jcarousel.js?v=2"}
    {addjs file="%productofday%/autoscroll.js?v=2"}

    {if $show_slider_arrows}
        {addjs file="%productofday%/arrows.js?v=2"}
    {/if}
{/if}
{* Скрипт таймера отсчёта *}
{addjs file="%productofday%/productofday.js?v=2"}
{if !empty($list)}
    <div class="productOfDayWrapper">
        <ul>
            {foreach $list as $product}
                <li style="background-image:url( {$product->getMainImage()->getUrl($ctrl->getParam('img_width', 0), $ctrl->getParam('img_height', 0), 'axy')})">
                    <a href="{$product->getUrl()}">
                        <div class="pofd-title">{$product.productofday_title|default:'Товар дня'}</div>
                        <div class="pofd-productTitle">{$product.title}</div>
                        <div class="pofd-priceBlock">
                            {$old_price=$product->getCost($old_price_id, null, false)}
                            {if $old_price>0}
                                <del class="pofd-oldPrice">
                                    {$product->getCost($old_price_id)} {$product->getCurrency()}
                                </del>
                            {/if}
                            <div class="pofd-price">
                                {$product->getCost()} {$product->getCurrency()}
                                {if $ctrl->getParam('show_discount', 0) && $old_price > 0 && $ctrl->getParam('show_discount_inline', 0)}
                                    <sup class="pofd-discount-inlineperc">
                                        {$discount=$ctrl->api->getDiscountPercent($old_price, $product->getCost(null, null, false))}
                                        -{$discount}%
                                    </sup>
                                {/if}
                            </div>
                            {if $ctrl->getParam('show_discount', 0) && $old_price > 0}
                                {if !$ctrl->getParam('show_discount_inline', 0)}
                                    <div class="pofd-discount">
                                        {if $ctrl->getParam('show_discount_as_price', 0)}
                                            {$discount=round($old_price-$product->getCost(null, null, false))}
                                            {t}Выгода{/t} {$discount|format_price} {$product->getCurrency()}
                                        {else}
                                            {$discount=$ctrl->api->getDiscountPercent($old_price, $product->getCost(null, null, false))}
                                            {t}Скидка{/t} {$discount} %
                                        {/if}
                                    </div>
                                {else}
                                    <div class="pofd-discount-inline">
                                        {$discount=round($old_price-$product->getCost(null, null, false))}
                                        {t}Ваша выгода{/t} {$discount|format_price} {$product->getCurrency()}
                                    </div>
                                {/if}
                            {/if}
                        </div>
                        <div class="pofd-productBottom">
                            {if $ctrl->getParam('show_num', 0)}
                                <div class="pofd-whiteTitleLeft {if count($list) > 1 && $show_slider_arrows}pofd-arrows{/if}">
                                    {t}Осталось{/t} {$product.num} {$product->getUnit()->stitle}</div>
                            {/if}
                            {if $ctrl->getParam('show_timer', 0)}
                                <div class="pofd-rightSide">
                                    <div class="pofd-whiteTitleRight {if count($list) > 1 && $show_slider_arrows}pofd-arrows{/if}">
                                        {t}До окончания акции осталось{/t}:
                                    </div>
                                    <div class="pofd-timerWrapper">
                                        {$hour_arr=$ctrl->api->getTimeArray($product)}
                                        <span class="pofd-timerItem">
                                            <span class="pofd-days pofd-timerItemBlock">{$hour_arr.days}</span>
                                            <span class="pofd-timerItemHint">{t}дней{/t}</span>
                                        </span>
                                        <span class="pofd-dots">:</span>
                                        <span class="pofd-timerItem">
                                            <span class="pofd-hours pofd-timerItemBlock">{$hour_arr.hours}</span>
                                            <span class="pofd-timerItemHint">{t}часов{/t}</span>
                                        </span>
                                        <span class="pofd-dots">:</span>
                                        <span class="pofd-timerItem">
                                            <span class="pofd-minutes pofd-timerItemBlock">{$hour_arr.minutes}</span>
                                            <span class="pofd-timerItemHint">{t}мин.{/t}</span>
                                        </span>
                                        <span class="pofd-dots">:</span>
                                        <span class="pofd-timerItem">
                                            <span class="pofd-seconds pofd-timerItemBlock">{$hour_arr.seconds}</span>
                                            <span class="pofd-timerItemHint">{t}сек.{/t}</span>
                                        </span>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </a>
                </li>
            {/foreach}
        </ul>
        {if count($list)>1 && $show_slider_arrows}{* Если товаров больше двух *}
            <button type="button" class="jcarousel-control-prev version1"><span>&lsaquo;</span></button>
            <button type="button" class="jcarousel-control-next version1"><span>&rsaquo;</span></button>
        {/if}
    </div>
    <script type="text/javascript">
        $(function () {
            {if count($list)>1}{* Если товаров больше двух *}
            //Добавляем автоскролл
            $(".productOfDayWrapper")
                .jcarousel({
                    {if $show_slider_circular}
                    wrap: 'circular'
                    {/if}
                })
                .jcarouselAutoscroll({
                    {if $show_slider_auto_time}
                    interval: {$show_slider_auto_time},
                    {/if}
                    target: '+=1',
                    autostart: {if $show_slider_auto}true{else}false{/if}
                });

            {if $show_slider_arrows}
            $('.jcarousel-control-prev')
                .on('jcarouselcontrol:active', function () {
                    $(this).removeClass('inactive');
                })
                .on('jcarouselcontrol:inactive', function () {
                    $(this).addClass('inactive');
                })
                .jcarouselControl({
                    target: '-=1'
                });

            $('.jcarousel-control-next')
                .on('jcarouselcontrol:active', function () {
                    $(this).removeClass('inactive');
                })
                .on('jcarouselcontrol:inactive', function () {
                    $(this).addClass('inactive');
                })
                .jcarouselControl({
                    target: '+=1'
                });
            {/if}
            {/if}
        });
    </script>
    <style>
        .productOfDayWrapper .pofd-title {
            font-size: 24px;
            color: {$ctrl->getParam('main_color', '#f07762')};
        }

        .productOfDayWrapper .pofd-priceBlock .pofd-discount {
            font-size: 30px;
            display: inline-flex;
            padding: 7px 20px;
            margin-top: 10px;
            margin-left: -20px;
            color: white;
            background-color: #f07762;
            background: linear-gradient(0deg, {$ctrl->getParam('discount_gradient_start', '#E00A0F')} 0%, {$ctrl->getParam('discount_gradient_finish', '#f07762')} 100%);
        }

        .productOfDayWrapper .pofd-priceBlock .pofd-discount-inlineperc {
            font-size: 14px;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            background-color: #f07762;
            background: linear-gradient(0deg, {$ctrl->getParam('discount_gradient_start', '#E00A0F')} 0%, {$ctrl->getParam('discount_gradient_finish', '#f07762')} 100%);
        }

        .productOfDayWrapper .pofd-priceBlock .pofd-discount-inline {
            font-size: 30px;
            display: inline-flex;
            padding: 7px 20px;
            margin-top: 10px;
            margin-left: -20px;
            color: white;
            background-color: #f07762;
            background: linear-gradient(0deg, {$ctrl->getParam('discount_gradient_start', '#E00A0F')} 0%, {$ctrl->getParam('discount_gradient_finish', '#f07762')} 100%);
        }

        .productOfDayWrapper .pofd-productBottom .pofd-timerItem .pofd-timerItemBlock {
            display: block;
            min-width: 36px;
            height: 36px;
            background-color: black;
            font-size: 24px;
            line-height: 36px;
            color: {$ctrl->getParam('timer_font_color', 'black')};
            box-shadow: 0 0 8px white;
            border-radius: 5px;
            background-image: linear-gradient(270deg, {$ctrl->getParam('timer_gradient_start', 'black')}  0%, {$ctrl->getParam('timer_gradient_finish', 'gray')} 50%, {$ctrl->getParam('timer_gradient_start', 'black')} 100%);
        }

        .productOfDayWrapper .jcarousel-control-prev,
        .productOfDayWrapper .jcarousel-control-next {
            background: {$ctrl->getParam('arrows_background_color', '#4E443C')};
            color: {$ctrl->getParam('arrows_text_color', '#ffffff')};
        }
    </style>
{/if}