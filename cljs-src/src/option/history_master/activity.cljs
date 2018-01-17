(ns history-master.activity
  (:require [re-frame.core :as rf]
            [reagent.core :as r]
            [antizer.reagent :as ant]
            [history-master.common :refer [default-range] :as c]))

(defn timeline-sidebar [availiable-ranges selected-day]
  (let [pv-map @(rf/subscribe [:pv-map])]
    [ant/layout-sider
     [ant/affix
      [ant/menu {:selected-keys [@selected-day] :theme "dark"
                 :on-click (fn [clicked-menu] (reset! selected-day (.-key clicked-menu)))}
       (for [current-day availiable-ranges]
         ^{:key current-day} [ant/menu-item
                              [ant/tooltip {:title (pv-map current-day "0") :placement "rightBottom"}
                               (c/date->human current-day)]])]]]))

(defn comparsion [a b index-key]
  (apply compare (map index-key (js->clj [a b] :keywordize-keys true))))

(defn visit-details-table [selected-day]
  (let [histories @(rf/subscribe [:visit-details-by-day (js/parseInt @selected-day)])]
    [ant/table {:dataSource histories :bordered true :row-key "id" :size "small" :style {:width "80%"} 
                :title (constantly (r/as-element [:center (c/date->human (js/parseInt @selected-day))]) )
                :scroll {:y 900}
                :columns [{:title "Visit Time" :dataIndex "visit-time" :width 150
                           :render #(c/time->human %)
                           :sorter #(comparsion %1 %2 :visit-time) :defaultSortOrder "descend"
                           ;; FIXME why on-filter can't work
                           :onFilter (fn [value record]
                                       (= value (c/extract-hour-from-date (:visit-time (js->clj record :keywordize-keys true)))))
                           :filters (->> histories 
                                         (map #(-> % :visit-time c/extract-hour-from-date))
                                         set
                                         (map #(do {:text % :value %}))
                                         (sort-by #(- (js/parseInt (:value %))))
                                         clj->js)}
                          {:title "Title" :dataIndex "title" :width 500
                           :render (fn [text record idx]
                                     (let [url (.-url record)]
                                       (r/as-element [ant/popover {:content (r/as-element [:a {:target "_blank" :href url} url])}
                                                      [:img {:src (str "chrome://favicon/" url)}]
                                                      " "
                                                      [:a {:href url :target "_blank"} (subs text 0 300)]])))}
                          {:title "Visit Count" :dataIndex "visit-count" :width 130 :sorter #(comparsion %1 %2 :visit-count)}
                          {:title "Action" :key "action" :width 80
                           :render (fn [text record]
                                     (r/as-element [ant/popconfirm {:title "Are you sure?"
                                                                    :on-confirm #(rf/dispatch [:delete-history {:via :single
                                                                                                                :item (js->clj record :keywordize-keys true)}])}
                                                    [ant/button {:icon "delete" :type "danger"}]]))}]
                :pagination {:show-size-changer true
                             :default-page-size 50
                             :page-size-options ["50" "100" "200" "500"]
                             :show-total #(str "Total: " % " ")}}]))

(defn activity-tab [availiable-ranges]
  (let [selected-day (r/atom (str (first availiable-ranges)))]
    [ant/layout
     [timeline-sidebar availiable-ranges selected-day]
     [ant/layout-content
      [visit-details-table selected-day]]]))
