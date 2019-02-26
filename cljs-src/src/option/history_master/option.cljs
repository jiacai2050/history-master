(ns history-master.option
  (:require [history-master.chrome]
            [history-master.stat :refer [stat-tab]]
            [history-master.activity :refer [activity-tab]]
            [history-master.local-db :refer [current-version]]
            [history-master.io :as io]
            [history-master.common :refer [default-range] :as c]
            [antizer.reagent :as ant]
            [goog.dom :as gdom]
            [re-frame.core :as rf]
            [cljsjs.moment]
            [reagent.core :as r]
            [clojure.string :as str]))

(enable-console-print!)

(defn top-nav [selected-menu]
  [ant/affix
   [:div {:style {:background-color "#001529"}}
    [ant/row {:type "flex" :align "middle"}
     [ant/col {:span 3} [ant/button {:type "primary" :icon "dashboard" :ghost true :size "large" :target "_blank"
                                     :href c/homepage} "History Master"]]
     [ant/col {:span 7} [ant/menu {:selected-keys [@selected-menu] :theme "dark" :mode "horizontal"
                                   :on-click (fn [e] (let [clicked-menu (.-key e)]
                                                       (case clicked-menu
                                                         "export" (io/export-histories)
                                                         "import" (io/import-histories)
                                                         (reset! selected-menu clicked-menu))))}
                         [ant/menu-item {:key "activity"} [ant/icon {:type "profile"}] "Activity"]
                         [ant/menu-item {:key "stat"} [ant/icon {:type "area-chart"}] "Statistics"]
                         [ant/menu-sub-menu {:title (r/as-element [:span {:class "submenu-title-wrapper"}
                                                                   [ant/icon {:type "sync"}]
                                                                   [ant/tooltip {:title "among Firefox/Chrome" :placement "right"}
                                                                    "Sync"]
                                                                   ])}
                          [ant/menu-item {:key "export"} [ant/icon {:type "download"}] "Export"]
                          [ant/menu-item {:key "import"} [ant/icon {:type "upload"}] [ant/tooltip {:title "NOTE: Chrome only support add histories at current time."}
                                                                                      "Import"]]]]]
     [ant/col {:span 14}
      [ant/button {:ghost true :type "primary"
                   :on-click #(ant/message-info "Have a nice day!")}
       (str @(rf/subscribe [:total]) " results.")]
      [ant/date-picker-range-picker
       {:ranges {:Today [(js/moment) (-> (js/moment) (.add 1 "days"))]
                 :Yesterday [(-> (js/moment) (.subtract 1 "days")) (js/moment)]
                 "Last 7 Days" default-range
                 "Last 30 Days" [(-> (js/moment) (.subtract 29 "days")) (-> (js/moment) (.add 1 "days"))]
                 "ALL" [(-> (.unix js/moment 0)) (-> (js/moment) (.add 1 "days"))]}
        :disabled-date (fn [current]
                         (> (.valueOf current) (-> (js/moment) (.add 1 "days") (.valueOf))))
        :default-value default-range
        :on-change (fn [dates date-strs]
                     (rf/dispatch [:set-date-range dates]))}]
      [ant/input-search {:placeholder "Leave this to retrieve all" :enter-button "Search" :style {:width 300}
                         :on-search (fn [v] (rf/dispatch [:query-history v]))}]]]]])

(defn main-body []
  (r/with-let [selected-menu (r/atom "activity")]
    [ant/layout
     [top-nav selected-menu]
     [ant/spin {:size "large" :tip "Loading...." :spinning @(rf/subscribe [:loading?])}
      (case @selected-menu
        "activity" [activity-tab]
        "stat" [stat-tab])]
     [ant/layout-footer {:style {:text-align "center"}}
      [:p [:a {:href c/homepage :target "_blank"} 
           [ant/icon {:type "left"}]
           [ant/icon {:type "right"}]]
       " With "
       [ant/icon {:type "heart"}]
       " by "
       [:a {:href "http://liujiacai.net" :target "_blank"} "Jiacai Liu."]
       " Current version: " (current-version)]]]))

(rf/dispatch-sync [:boot])
(r/render [main-body]
          (gdom/getElement "app"))
