(ns history-master.option
  (:require [history-master.chrome]
            [history-master.stat :refer [stat-tab]]
            [history-master.activity :refer [activity-tab]]
            [antizer.reagent :as ant]
            [history-master.common :refer [default-range] :as c]
            [goog.dom :as gdom]
            [re-frame.core :as rf]
            [cljsjs.moment]
            [reagent.core :as r]
            [clojure.string :as str]))

(enable-console-print!)

(defn download-csv []
  (let [content (js/Blob. [(c/to-csv @(rf/subscribe [:histories]))])
        filename (str (str/join "_" (map c/date->human @(rf/subscribe [:date-range]))) ".csv")]
    (.download js/chrome.downloads (clj->js {:url (.createObjectURL js/window.URL content)
                                             :saveAs true
                                             :filename filename}))))

(defn top-nav [selected-menu]
  (r/with-let [selected-range (r/atom default-range)]
    [ant/affix
     [:div {:style {:background-color "#001529"}}
      [ant/row {:type "flex" :align "middle"}
       [ant/col {:span 3} [ant/button {:type "primary" :icon "dashboard" :ghost true :size "large" :target "_blank"
                                        :href c/homepage} "History Master"]]
       [ant/col {:span 7} [ant/menu {:selected-keys [@selected-menu] :theme "dark" :mode "horizontal"
                                     :on-click (fn [e] (let [clicked-menu (.-key e)]
                                                         (if (= "download" clicked-menu)
                                                           (download-csv)
                                                           (reset! selected-menu (.-key e))))) }
                           [ant/menu-item {:key "activity"} [ant/icon {:type "profile"}] "Activity"]
                           [ant/menu-item {:key "stat"} [ant/icon {:type "area-chart"}] "Statistics"]
                           [ant/menu-item {:key "download"} [ant/icon {:type "download"}] "Download as CSV"]]]
       [ant/col {:span 14}
        [ant/button {:ghost true :type "primary"
                     :on-click #(ant/message-info "Have a nice day!")}
         (str @(rf/subscribe [:total]) " results.")]
        [ant/date-picker-range-picker
         {:ranges {:Today [(js/moment) (-> (js/moment) (.add 1 "days"))]
                   :Yesterday [(-> (js/moment) (.subtract 1 "days")) (js/moment)]
                   "Last 7 Days" default-range
                   "Last 30 Days" [(-> (js/moment) (.subtract 29 "days")) (-> (js/moment) (.add 1 "days"))]}
          :disabled-date (fn [current]
                           (> (.valueOf current) (-> (js/moment) (.add 1 "days") (.valueOf))))
          :default-value @selected-range
          :on-change (fn [dates date-strs]
                       (reset! selected-range dates))}]
[ant/input-search {:placeholder "Leave this to retrieve all" :enter-button "Search" :style {:width 300}
                   :on-search (fn [v] (rf/dispatch (conj (into [:query-history] @selected-range) v)))}]]
       ;; [ant/col {:span 5}
       ;;  ]
       ]]]))

(defn main-body []
  (r/with-let [selected-menu (r/atom "activity")]
    [ant/layout
     [top-nav selected-menu]
     [ant/spin {:size "large" :tip "Loading...." :spinning @(rf/subscribe [:loading?])}
      (case @selected-menu
        "activity" [activity-tab (apply c/gen-date-ranges @(rf/subscribe [:date-range]))]
        "stat" [stat-tab])]
     [ant/layout-footer {:style {:text-align "center"}}
      [:p [:a {:href c/homepage :target "_blank"} 
           [ant/icon {:type "left"}]
           [ant/icon {:type "right"}]]
       " With "
       [ant/icon {:type "heart"}]
       " by "
       [:a {:href "http://liujiacai.net" :target "_blank"} "Jiacai Liu."]
       " Current version: " (->> js/chrome.runtime (.getManifest) (.-version))]]]))

(rf/dispatch-sync [:boot])
(r/render [main-body]
          (gdom/getElement "app"))
