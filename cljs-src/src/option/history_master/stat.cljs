(ns history-master.stat 
  (:require [goog.string :as gstr]
            [goog.string.format]
            [goog.dom :as gdom]
            [reagent.core :as r]
            [history-master.common :refer [date->human]]
            [antizer.reagent :as ant]
            [re-frame.core :as rf]))

(def chart-width (* 0.95 (.-innerWidth js/window)))

(defn pv-trend
  "Param isn't used directly in render fn, instead extract it in component-did-update fn to render.
  Param as prop is used to trigger rerender with lifecycle functions.
  https://github.com/Day8/re-frame/wiki/When-do-components-update%3F"
  [_ width height]
  (let [render-chart (fn [div daily-visits]
                       (let [chart (.init js/echarts div)
                             opts {:color ["#23B7E5"]
                                   :tooltip {:trigger "item"
                                             :formatter (fn [params]
                                                          (let [[visit-day pv] (.-value params)]
                                                            (gstr/format "%s <br/> PV: %s"
                                                                         (date->human visit-day)
                                                                         pv)))}
                                   :toolbox {:show true
                                             :feature {:magicType {:show true :type ["line" "bar"]}
                                                       :dataView {:show true}
                                                       :restore {:show true}
                                                       :dataZoom {:show true}
                                                       :saveAsImage {:show true}}}
                                   :dataZoom {:show true :start 0}
                                   :legend {:data ["Page Views"]}
                                   :grid {:y2 100}
                                   :xAxis [{:type "time" :splitNumber 10}]
                                   :yAxis [{:name "PV" :type "value"}]
                                   :series [{:name "Page View" :type "line" :showAllSymbol true
                                             :symbolSize (fn [[_ pv]] (+ 2 (.round js/Math (/ pv 100))))
                                             :data (map (fn [{:keys [visit-day pv]}]
                                                          [(js/Date. visit-day) pv])
                                                        daily-visits)}]}]
                         (.setOption chart (clj->js opts))))
        init-component (fn [this] 
                         (render-chart (r/dom-node this) (second (r/argv this))))]
    (r/create-class
     {:display-name "pv-trend"
      :reagent-render (fn [] [:div {:style {:width (or width chart-width) :height (or height 400)}}])
      :component-did-mount init-component
      :component-did-update init-component})))

(defn pie-chart
  [_ width height]
  (let [render-chart (fn [div items]
                       (let [chart (.init js/echarts div)
                             opts {:tooltip {:trigger "item"
                                             :formatter "{b} : {c} ({d}%)"}
                                   :legend {:orient "vertical" :x "left" :data (map :name items)}
                                   :toolbox {:show true
                                             :feature {:magicType {:show true :type ["pie" "funnel"]
                                                                   :option {:funnel {:x "25%" :width "50%" :funnelAlign "left" :max 1548}}}
                                                       :dataView {:show true}
                                                       :restore {:show true}
                                                       :saveAsImage {:show true}}}
                                   :calculable true
                                   :series [{:type "pie" :radius "75%" :center ["50%" "60%"]
                                             :data items}]}]
                         (.setOption chart (clj->js opts))))
        init-component (fn [this] 
                         (render-chart (r/dom-node this) (second (r/argv this))))]
    (r/create-class
     {:display-name "visit-percentage"
      :reagent-render (fn [] [:div {:style {:width (or width chart-width) :height (or height 400)}}])
      :component-did-mount init-component
      :component-did-update init-component})))

(defn stat-tab []
  [ant/layout-content
   [ant/card {:title "Page Views"}
    [ant/row {:type "flex" :justify "center"}
     [ant/col 
      [pv-trend @(rf/subscribe [:pv-trend])]]]]

   (r/with-let [group-key (r/atom "title")
                top-n (r/atom 10)]
     [ant/card {:title (r/as-element [:div "TOP " [ant/input-number {:min 5 :max 50 :value @top-n :on-change #(when (number? %) 
                                                                                                                (reset! top-n %))}] "Websites"])
                :extra (r/as-element
                        [:div "Group by: "
                         [ant/radio-group {:default-value @group-key
                                           :on-change (fn [evt] (reset! group-key (goog.object/getValueByKeys evt "target" "value")))}
                          [ant/radio {:value "title"} "Title"]
                          [ant/radio {:value "domain"} "Domain"]]])}
      [ant/row {:type "flex" :justify "center"}
       [ant/col [pie-chart @(rf/subscribe [:topn-percentage (keyword @group-key) @top-n])]]]
      ])
   [ant/card {:title "URL Schemes"}
    [ant/row {:type "flex" :justify "center"}
     [ant/col [pie-chart @(rf/subscribe [:scheme-percentage])]]]]])
